import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import * as cheerio from "cheerio";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".codex-cache", "supervisors");
const OUTPUT = path.join(ROOT, "src", "supervisorDetails.js");
const APP_SOURCE = path.join(ROOT, "src", "App.jsx");
const INDEX_TIMEOUT_MS = 60000;
const PROFILE_TIMEOUT_MS = 2500;
const FETCH_PROFILE_DETAILS = process.env.BUAA_FETCH_PROFILES === "1";

const URLS = {
  bmeTeachers: "https://bme.buaa.edu.cn/teachers.aspx?catID=7",
  bmeShiTeachers: "https://shi.buaa.edu.cn/xyjslb.jsp?id=1144&lang=zh_CN&st=0&urltype=tsites.CollegeTeacherList&wbtreeid=1001",
  bmeMasterDirections: "https://bme.buaa.edu.cn/zhaopinHr.aspx?catID=9&curID=713&subcatID=40",
  bmePhd2026: "https://bme.buaa.edu.cn/newsInfo.aspx?catID=13&curID=14729&subcatID=1027",
  msePeople: "https://ygy.buaa.edu.cn/info/1022/3032.htm",
  mseDetail: "https://ygy.buaa.edu.cn/szdw1/szryxx.htm",
  mseShiTeachers: "https://shi.buaa.edu.cn/xyjslb.jsp?id=1189&lang=zh_CN&st=0&urltype=tsites.CollegeTeacherList&wbtreeid=1001",
  msePhd2026: "https://ygy.buaa.edu.cn/info/1004/4492.htm",
  shiTeacherSearch: "https://shi.buaa.edu.cn/system/resource/tsites/advancesearch.jsp",
};

const BME_BASE = "https://bme.buaa.edu.cn/";
const MSE_BASE = "https://ygy.buaa.edu.cn/szdw1/szryxx.htm";
const LOCAL_FALLBACKS = {
  "bme-teachers.html": ".codex-bme-teachers.html",
  "bme-phd-2026.html": ".codex-bme-phd2026.html",
  "mse-people.html": ".codex-mse-people.html",
  "mse-detail-0.html": ".codex-mse-index.html",
  "mse-phd-2026.html": ".codex-mse-phd2026.html",
};

function cleanName(value) {
  return String(value ?? "").replace(/\s|\u00a0/g, "").replace(/★/g, "");
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t\r\n]+/g, " ")
    .replace(/ ?([，。；：、]) ?/g, "$1")
    .trim();
}

function normalizeUrl(href, base) {
  if (!href || href === "http://" || href === "https://") return undefined;
  try {
    return new URL(href, base).href;
  } catch {
    return undefined;
  }
}

async function ensureDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

async function readUrl(url, cacheName, timeoutMs = INDEX_TIMEOUT_MS) {
  await ensureDir();
  const cachePath = path.join(CACHE_DIR, cacheName);
  try {
    return await fs.readFile(cachePath, "utf8");
  } catch {
    const localFallback = LOCAL_FALLBACKS[cacheName];
    if (localFallback) {
      try {
        const html = await fs.readFile(path.join(ROOT, localFallback), "utf8");
        await fs.writeFile(cachePath, html, "utf8");
        return html;
      } catch {
        // Fall through to network.
      }
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      const html = decodeHtml(buffer);
      await fs.writeFile(cachePath, html, "utf8");
      return html;
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function readOptionalUrl(url, cacheName, timeoutMs = INDEX_TIMEOUT_MS) {
  try {
    return await readUrl(url, cacheName, timeoutMs);
  } catch (error) {
    console.warn(`Warning: skipped ${url}: ${error.message}`);
    return undefined;
  }
}

async function loadExistingDetails() {
  try {
    const content = await fs.readFile(OUTPUT, "utf8");
    const match = content.match(/export const supervisorDetails = ([\s\S]*);\s*$/);
    return match?.[1] ? JSON.parse(match[1]) : {};
  } catch {
    return {};
  }
}

function getTargetNames(appSource) {
  const mentorBlocks = [...appSource.matchAll(/mentors:\s*\[([\s\S]*?)\]/g)].map((match) => match[1]);
  const bme = new Set(
    mentorBlocks.flatMap((block) => [...block.matchAll(/"([^"]+)"/g)].map((match) => cleanName(match[1]))),
  );
  const mseBlock = appSource.match(/const msePeople = \[([\s\S]*?)\];/)?.[1] ?? "";
  const mse = new Set([...mseBlock.matchAll(/\["([^"]+)",\s*"https?:\/\//g)].map((match) => cleanName(match[1])));
  return { bme, mse, all: new Set([...bme, ...mse]) };
}

function pickNames(details, names) {
  return Object.fromEntries(Object.entries(details).filter(([name]) => names.has(name)));
}

function getNamesMissingShiProfile(details, names) {
  return Array.from(names).filter((name) => !details[name]?.profileUrl?.includes("shi.buaa.edu.cn"));
}

function cacheNameFor(url, prefix, name) {
  const digest = createHash("sha1").update(url).digest("hex").slice(0, 12);
  const safeName = name.replace(/[\\/:*?"<>|]/g, "_");
  return `${prefix}-${safeName}-${digest}.html`;
}

function cacheNameForName(prefix, name, extension = "html") {
  const safeName = name.replace(/[\\/:*?"<>|]/g, "_");
  return `${prefix}-${safeName}.${extension}`;
}

function decodeHtml(buffer) {
  const utf8 = new TextDecoder("utf-8").decode(buffer);
  const replacementCount = (utf8.match(/\uFFFD/g) ?? []).length;
  if (replacementCount > 5) return new TextDecoder("gb18030").decode(buffer);
  return utf8;
}

function getEmail(text) {
  const emails = [...text.matchAll(/[A-Za-z0-9._%+-]+@buaa\.edu\.cn/gi)]
    .map((match) => match[0])
    .filter((email) => !/^bme@/i.test(email) && !/^bhygjc@/i.test(email));
  return emails[0];
}

function getAdvisorTags(text) {
  const tags = [];
  if (/硕士生导师|硕导/.test(text)) tags.push("硕士生导师");
  if (/博士生导师|博导/.test(text)) tags.push("博士生导师");
  return tags;
}

function getCleanResearchSummary(value) {
  const summary = cleanText(value).slice(0, 180);
  if (!summary || summary.length < 12) return undefined;
  if (/@buaa\.edu\.cn|E-?Mail|电子邮箱|联系方式/i.test(summary)) return undefined;
  if (/^[等及、，。；\s]+项目/.test(summary)) return undefined;
  if (/[\u4e00-\u9fa5]{2,4}\s*(教授|副教授|讲师|研究员|副研究员|硕导|博导)/.test(summary)) return undefined;
  return summary;
}

function getTitle(text, fallback) {
  const titleMatch = cleanText(text).match(/(教授|副教授|讲师|助理教授|研究员|副研究员|主任医师|副主任医师|医师)(?:、?(?:硕士生导师|博士生导师|博导|硕导|医师))*/);
  return titleMatch?.[0]?.replace(/\/+/g, "、") ?? fallback;
}

function getResearchSummary(text) {
  const normalized = cleanText(text);
  const sections = [
    /近五年代表性论著[:：]?(.{30,260}?)(?:科研项目|主持|基金|联系方式|$)/,
    /【研究领域】(.{16,220}?)(?:【|$)/,
    /研究领域(.{16,220}?)(?:【|教育背景|工作经历|代表性|科研项目|论文|$)/,
    /代表性科研论文[:：]?(.{30,260}?)(?:科研项目|基金|联系方式|$)/,
    /代表性论文[:：]?(.{30,260}?)(?:科研项目|基金|联系方式|$)/,
    /主持(?:国家自然科学基金|基金|项目)(.{8,180}?)(?:。|；|;|$)/,
    /(国家自然科学基金.{8,180}?)(?:。|；|;|$)/,
  ];
  for (const section of sections) {
    const match = normalized.match(section);
    const summary = getCleanResearchSummary(match?.[1]);
    if (summary) return summary;
  }
  return undefined;
}

function parseBmeTeacherIndex(html) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const details = {};
  $("a").each((_, el) => {
    const name = cleanName($(el).text());
    const profileUrl = normalizeUrl($(el).attr("href"), BME_BASE);
    if (!name || !profileUrl || !/(teacherInfo|shi\.buaa\.edu\.cn)/.test(profileUrl)) return;
    details[name] ??= {
      profileUrl,
      sourceUrl: profileUrl,
      tags: [],
    };
  });
  return details;
}

function parseShiTeacherList(html, baseUrl) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const details = {};
  const addTeacher = (rawName, href, rawTitle) => {
    const profileUrl = normalizeUrl(href, baseUrl);
    if (!profileUrl?.includes("shi.buaa.edu.cn") || !profileUrl.includes("/zh_CN/index.htm")) return;
    const name = cleanName(rawName);
    if (!name || ["首页", "下页", "上页", "尾页"].includes(name)) return;
    const title = cleanText(rawTitle);
    details[name] ??= {
      profileUrl,
      sourceUrl: profileUrl,
      title: title || undefined,
      tags: getAdvisorTags(`${title} ${name}`),
    };
  };

  for (const match of html.matchAll(/addimg\("[^"]*","([^"]+)","([^"]+)","[^"]*"\)/g)) {
    addTeacher(match[2], match[1]);
  }

  $("a").each((_, el) => {
    const text = cleanText($(el).text());
    const name = cleanName(text.match(/^[\u4e00-\u9fa5]{2,4}/)?.[0]);
    const title = cleanText(text.replace(name, ""));
    addTeacher(name, $(el).attr("href"), title);
  });
  return details;
}

function getShiTeacherPageUrls(html, baseUrl) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const urls = new Set([baseUrl]);
  $("a").each((_, el) => {
    const text = cleanText($(el).text());
    const href = normalizeUrl($(el).attr("href"), baseUrl);
    if (!href || !["首页", "上页", "下页", "尾页"].includes(text)) return;
    if (href.includes("xyjslb.jsp") && href.includes("tsites.CollegeTeacherList")) urls.add(href);
  });
  for (const match of html.matchAll(/PAGENUM=(\d+)/g)) {
    const page = Number(match[1]);
    if (Number.isFinite(page) && page > 1) {
      const url = new URL(baseUrl);
      url.searchParams.set("PAGENUM", String(page));
      urls.add(url.href);
    }
  }
  const totalPage = Number(html.match(/totalpage=(\d+)/)?.[1] ?? "1");
  if (Number.isFinite(totalPage) && totalPage > 1) {
    for (let page = 2; page <= totalPage; page += 1) {
      const url = new URL(baseUrl);
      url.searchParams.set("PAGENUM", String(page));
      url.searchParams.set("totalpage", String(totalPage));
      urls.add(url.href);
    }
  }
  return Array.from(urls).sort((a, b) => {
    const pageOf = (url) => Number(new URL(url).searchParams.get("PAGENUM") ?? "1");
    return pageOf(a) - pageOf(b);
  });
}

async function getShiTeacherDetails(indexUrl, cachePrefix) {
  const firstPage = await readOptionalUrl(indexUrl, `${cachePrefix}-shi-teachers-1.html`);
  if (!firstPage) return {};
  const pages = [{ html: firstPage, baseUrl: indexUrl }];
  const pageUrls = getShiTeacherPageUrls(firstPage, indexUrl).slice(1);
  for (const url of pageUrls) {
    const page = new URL(url).searchParams.get("PAGENUM") ?? "1";
    const html = await readOptionalUrl(url, `${cachePrefix}-shi-teachers-${page}.html`);
    if (html) pages.push({ html, baseUrl: url });
  }
  return mergeDetails(...pages.map(({ html, baseUrl }) => parseShiTeacherList(html, baseUrl)));
}

function getShiSearchUrl(name) {
  return getShiSearchPageUrl(name, 1);
}

function getShiSearchPageUrl(name, pageindex) {
  const params = new URLSearchParams({
    collegeid: "0",
    disciplineid: "0",
    enrollid: "0",
    pageindex: String(pageindex),
    pagesize: "12",
    rankid: "0",
    degreeid: "0",
    honorid: "0",
    pinyin: "",
    profilelen: "100",
    teacherName: name,
    searchDirection: "",
    viewmode: "8",
    viewid: "1036809",
    siteOwner: "1857672118",
    viewUniqueId: "1036809",
    showlang: "zh_CN",
    ispreview: "false",
    basenum: "0",
    ellipsis: "...",
    alignright: "false",
    productType: "0",
    tutorType: "",
  });
  return `${URLS.shiTeacherSearch}?${params}`;
}

function parseShiSearchResult(jsonTexts, name) {
  const exactMatches = [];
  for (const jsonText of jsonTexts) {
    if (!jsonText) continue;
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      continue;
    }
    exactMatches.push(
      ...(data.teacherData ?? [])
        .filter((item) => cleanName(item.showName) === name && item.url?.includes("/zh_CN/index.htm")),
    );
  }
  const matchesByUrl = new Map(exactMatches.map((item) => [normalizeUrl(item.url, "https://shi.buaa.edu.cn/"), item]));
  const matches = Array.from(matchesByUrl.entries()).filter(([url]) => url);
  if (matches.length !== 1) return {};
  const [profileUrl, match] = matches[0];
  return {
    [name]: {
      profileUrl,
      sourceUrl: profileUrl,
      title: cleanText(match.prorank) || undefined,
      tags: [],
    },
  };
}

function getTotalPage(jsonText) {
  let data;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return 1;
  }
  return Number(data.totalpage) || 1;
}

async function getShiSearchDetails(names) {
  const details = {};
  for (const name of names) {
    const jsonTexts = [];
    const firstJson = await readOptionalUrl(getShiSearchUrl(name), cacheNameForName("shi-search", name, "json"), 8000);
    if (firstJson) jsonTexts.push(firstJson);
    const totalPage = Math.min(getTotalPage(firstJson), 4);
    for (let page = 2; page <= totalPage; page += 1) {
      const jsonText = await readOptionalUrl(
        getShiSearchPageUrl(name, page),
        cacheNameForName(`shi-search-${page}`, name, "json"),
        8000,
      );
      if (jsonText) jsonTexts.push(jsonText);
    }
    Object.assign(details, parseShiSearchResult(jsonTexts, name));
  }
  return details;
}

function parseProfilePage(html, url, fallback = {}) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const text = cleanText($("body").text());
  const profileUrl = text.match(/https?:\/\/shi\.buaa\.edu\.cn\/[^\s电子邮箱【]+/)?.[0] ?? url;
  return {
    ...fallback,
    profileUrl,
    sourceUrl: fallback.sourceUrl ?? url,
    title: getTitle(text, fallback.title),
    email: getEmail(text) ?? fallback.email,
    tags: Array.from(new Set([...(fallback.tags ?? []), ...getAdvisorTags(text)])),
    researchSummary: getResearchSummary(text) ?? fallback.researchSummary,
  };
}

function parseMseListLikePage(html, baseUrl) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const details = {};

  $("a[title]").each((_, el) => {
    const name = cleanName($(el).text());
    const title = $(el).attr("title") ?? "";
    const sourceUrl = normalizeUrl($(el).attr("href"), baseUrl);
    if (!name || !sourceUrl || !title.includes("老师个人页面")) return;
    details[name] ??= {
      sourceUrl,
      tags: [],
    };
  });

  $("div.li-r, div.li-r_tzgg").each((_, el) => {
    const anchor = $(el).find("a[title]").first();
    const name = cleanName(anchor.text());
    if (!name) return;
    const text = cleanText($(el).text());
    const profileUrl = text.match(/https?:\/\/shi\.buaa\.edu\.cn\/[^\s电子邮箱【]+/)?.[0];
    details[name] = {
      ...(details[name] ?? {}),
      title: getTitle(text, details[name]?.title ?? "师资人员"),
      email: getEmail(text),
      profileUrl,
      sourceUrl: normalizeUrl(anchor.attr("href"), baseUrl),
      tags: Array.from(new Set([...(details[name]?.tags ?? []), ...getAdvisorTags(text)])),
      researchSummary: getResearchSummary(text),
    };
  });

  return details;
}

function parsePhdAdmissions(html, sourceUrl, targetNames) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const text = cleanText($("body").text());
  const details = {};
  for (const match of text.matchAll(/([\u4e00-\u9fa5]{2,4})[\s，、；;:：]*([A-Za-z0-9._%+-]+@buaa\.edu\.cn)/g)) {
    const name = cleanName(match[1]);
    const email = match[2];
    if (!targetNames.has(name)) continue;
    if (!name || ["联系人", "电子邮箱", "招生导师", "博士招生"].includes(name)) continue;
    details[name] = {
      ...(details[name] ?? {}),
      email,
      tags: Array.from(new Set([...(details[name]?.tags ?? []), "博士生导师"])),
      admissions: [
        {
          label: "2026博士招生资格名单线索",
          sourceUrl,
        },
      ],
    };
  }
  return details;
}

function uniqueAdmissions(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.label ?? ""}|${item.sourceUrl ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mergeDetails(...objects) {
  const merged = {};
  for (const object of objects) {
    for (const [name, detail] of Object.entries(object)) {
      const current = merged[name] ?? {};
      merged[name] = {
        ...current,
        ...Object.fromEntries(Object.entries(detail).filter(([, value]) => value !== undefined && value !== "")),
        tags: Array.from(new Set([...(current.tags ?? []), ...(detail.tags ?? [])])),
        admissions: uniqueAdmissions([...(current.admissions ?? []), ...(detail.admissions ?? [])]),
      };
    }
  }
  return merged;
}

async function getMseDetailPages() {
  const pages = [];
  const firstPage = await readOptionalUrl(URLS.mseDetail, "mse-detail-0.html");
  if (firstPage) pages.push({ html: firstPage, baseUrl: URLS.mseDetail });
  for (let page = 1; page <= 14; page += 1) {
    const url = `https://ygy.buaa.edu.cn/szdw1/szryxx/${page}.htm`;
    const html = await readOptionalUrl(url, `mse-detail-${page}.html`);
    if (html) pages.push({ html, baseUrl: url });
  }
  return pages;
}

async function enrichProfiles(details, schoolKey) {
  const entries = Object.entries(details).filter(([, detail]) => detail.profileUrl || detail.sourceUrl);
  const enriched = {};
  for (let index = 0; index < entries.length; index += 1) {
    const batch = entries.slice(index, index + 8);
    const results = await Promise.all(batch.map(async ([name, detail]) => {
      const url = detail.profileUrl ?? detail.sourceUrl;
      if (!url) return [name, detail];
      const hasUsefulDetail = detail.email && detail.tags?.length && (detail.researchSummary || detail.profileUrl);
      if (hasUsefulDetail) return [name, detail];
      try {
        const requestedCacheName = cacheNameFor(url, schoolKey, name);
        const cachedFiles = await fs.readdir(CACHE_DIR).catch(() => []);
        const safeName = name.replace(/[\\/:*?"<>|]/g, "_");
        const cacheName = cachedFiles.includes(requestedCacheName)
          ? requestedCacheName
          : cachedFiles.find((file) => file.startsWith(`${schoolKey}-${safeName}-`));
        if (!cacheName && !FETCH_PROFILE_DETAILS) return [name, detail];
        const html = cacheName
          ? await fs.readFile(path.join(CACHE_DIR, cacheName), "utf8")
          : await readUrl(url, requestedCacheName, PROFILE_TIMEOUT_MS);
        return [name, parseProfilePage(html, url, detail)];
      } catch {
        return [name, detail];
      }
    }));
    for (const [name, detail] of results) enriched[name] = detail;
  }
  return enriched;
}

async function main() {
  const existing = await loadExistingDetails();
  const targetNames = getTargetNames(await fs.readFile(APP_SOURCE, "utf8"));
  const bmeTeacherHtml = await readOptionalUrl(URLS.bmeTeachers, "bme-teachers.html");
  const bmeTeachers = bmeTeacherHtml ? parseBmeTeacherIndex(bmeTeacherHtml) : {};
  const bmeShiTeachers = await getShiTeacherDetails(URLS.bmeShiTeachers, "bme");
  const msePeopleHtml = await readOptionalUrl(URLS.msePeople, "mse-people.html");
  const msePeople = msePeopleHtml ? parseMseListLikePage(msePeopleHtml, URLS.msePeople) : {};
  const msePages = await getMseDetailPages();
  const mseDetails = mergeDetails(...msePages.map(({ html, baseUrl }) => parseMseListLikePage(html, baseUrl)));
  const mseShiTeachers = await getShiTeacherDetails(URLS.mseShiTeachers, "mse");
  const shiTeachers = mergeDetails(bmeShiTeachers, mseShiTeachers);
  await readOptionalUrl(URLS.msePhd2026, "mse-phd-2026.html");
  const bmePhdHtml = await readOptionalUrl(URLS.bmePhd2026, "bme-phd-2026.html");
  const admissions = mergeDetails(
    existing.admissions ?? {},
    bmePhdHtml ? parsePhdAdmissions(bmePhdHtml, URLS.bmePhd2026, targetNames.all) : {},
  );
  const baseBmeDetails = pickNames(mergeDetails(existing.bme ?? {}, bmeTeachers, shiTeachers, admissions), targetNames.bme);
  const baseMseDetails = pickNames(mergeDetails(existing.mse ?? {}, msePeople, mseDetails, shiTeachers, admissions), targetNames.mse);
  const shiSearchTeachers = await getShiSearchDetails(new Set([
    ...getNamesMissingShiProfile(baseBmeDetails, targetNames.bme),
    ...getNamesMissingShiProfile(baseMseDetails, targetNames.mse),
  ]));

  const bmeEnriched = await enrichProfiles(
    pickNames(mergeDetails(baseBmeDetails, shiSearchTeachers), targetNames.bme),
    "bme",
  );
  const mseEnriched = await enrichProfiles(
    pickNames(mergeDetails(baseMseDetails, shiSearchTeachers), targetNames.mse),
    "mse",
  );
  const sortObject = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b, "zh-Hans-CN")));
  const supervisorDetails = {
    bme: sortObject(bmeEnriched),
    mse: sortObject(mseEnriched),
    admissions: sortObject(admissions),
    sources: {
      bmeTeachers: URLS.bmeTeachers,
      bmeShiTeachers: URLS.bmeShiTeachers,
      bmeMasterDirections: URLS.bmeMasterDirections,
      bmePhd2026: URLS.bmePhd2026,
      msePeople: URLS.msePeople,
      mseDetail: URLS.mseDetail,
      mseShiTeachers: URLS.mseShiTeachers,
      msePhd2026: URLS.msePhd2026,
      shiTeacherSearch: URLS.shiTeacherSearch,
    },
  };
  const content = `// Auto-generated from public BUAA school pages. Run: npm run generate:details\nexport const supervisorDetails = ${JSON.stringify(supervisorDetails, null, 2)};\n`;
  await fs.writeFile(OUTPUT, content, "utf8");
  console.log(
    `Generated ${Object.keys(bmeEnriched).length} BME, ${Object.keys(mseEnriched).length} MSE, ` +
    `${Object.keys(admissions).length} admission records -> ${path.relative(ROOT, OUTPUT)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
