import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import * as cheerio from "cheerio";
import { supervisorManualOverrides } from "./supervisor-manual-overrides.js";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".codex-cache", "supervisors");
const OUTPUT = path.join(ROOT, "src", "supervisorDetails.js");
const APP_SOURCE = path.join(ROOT, "src", "App.jsx");
const INDEX_TIMEOUT_MS = 60000;
const PROFILE_TIMEOUT_MS = 2500;
const FETCH_PROFILE_DETAILS = process.env.BUAA_FETCH_PROFILES === "1";
const REFRESH_CACHE = process.env.BUAA_REFRESH_CACHE === "1";
const MAX_SHI_SEARCH_PAGES = 30;
const PROFILE_BATCH_SIZE = 8;
const TSITES_ENCRYPT_PATH = "/system/resource/tsites/tsitesencrypt.jsp";
const ALLOWED_TAGS = new Set(["硕士生导师", "博士生导师", "兼职导师"]);

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
const SCHOOL_HOST_RE = /(?:^|\.)?(?:bme|ygy)\.buaa\.edu\.cn$/i;
const SHI_HOST_RE = /(?:^|\.)?shi\.buaa\.edu\.cn$/i;
const PROFILE_NOISE_RE = /var\s+codeInfo|window\.location|jQuery\(|qrcode|二维码|扫描手机二维码|欢迎您的访问|您是第|开通时间|最后更新时间|登录\|\s*English\s*\|\s*手机版|_tsites_com_view_mode_type_|ImageScale|点击次数|发布时间|友情链接|Site Map|版权所有|Copyright/i;
const DIRECTION_NARRATIVE_RE = /我的研究方向|目前对于|有望|可以用来|最终将有望|领衔研制|完成了|长期从事|致力于|广泛运用|尤其关注|服务.*战略需求|研究并不透彻|欢迎/;
const PROFILE_LIST_PAGE_RE = /(?:teachers|studentInfo|zhaopinHr)\.aspx|xyjslb\.jsp|\/szdw1\/szryxx(?:\/\d+\.htm)?$/i;
const PROFILE_DETAIL_PAGE_RE = /teacherInfo\.aspx|\/info\/\d+\/\d+\.htm$/i;
const SUMMARY_FORBIDDEN_RE = /教育背景|教育经历|学习经历|工作经历|社会兼职|学术兼职|联系方式|电子邮箱|开授课程|同专业|获得.*学位|博士学位|大学本科|委员会|优秀教师奖|优秀青年|新世纪优秀人才|入选.*人才|支持计划|获奖|奖励|代表性论文|近五年代表性论著|获授权|高被引|国家自然科学基金|国家重点研发|科研项目|项目负责人|基金|项目|课题|发表|期刊|会议|审稿人|SCI|ESI|IEEE/i;
const DIRECTION_FORBIDDEN_RE = /师资索引|教师索引|人员列表|个人页面|页面入口|教育背景|教育经历|学习经历|工作经历|代表性|科研项目|论文|联系方式|电子邮箱|招生信息|个人简介|简介】|学术荣誉|荣誉与奖励|国家自然科学基金|国家重点研发|基金|项目|课题|面上项目|青年项|优秀青年|新世纪优秀人才|入选|支持计划|获授权|获奖|奖励|院士|获得.*学位|^\d{4}年|至今|社会兼职|学术兼职|同专业|开授课程|委员会|大学|相关成果|发表|期刊|会议|高被引|被引|审稿人|实验室|Nature|Cancer Research|Medical Image Analysis|NeuroImage|Human Brain Mapping|IEEE|MICCAI|CVPR|IPMI/i;
const SECTION_LABEL_RE = /^(?:【)?(研究领域与方向|研究方向简介|研究方向|研究领域|主要研究方向|主要研究领域|研究兴趣|个人简介)(?:】)?[:：]?$/;
const GENERIC_EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
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

function stripProfileNoise(value) {
  return String(value ?? "")
    .replace(/var\s+codeInfo[\s\S]*$/i, " ")
    .replace(/jQuery\(function\(\)\{[\s\S]*$/i, " ")
    .replace(/var\s+_tsites_com_view_mode_type_[\s\S]*$/i, " ")
    .replace(/ImageScale\([^\)]*\)[\s\S]*$/i, " ")
    .replace(/扫描手机二维码[\s\S]*$/i, " ")
    .replace(/登录\|\s*English\s*\|\s*手机版[\s\S]*$/i, " ")
    .replace(/(?:点击次数|发布时间)[:：]?[^\n\r]*$/gim, " ")
    .replace(/\/\/[^\n\r]*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(value) {
  return stripProfileNoise(String(value ?? ""))
    .replace(/\u00a0/g, " ")
    .replace(/[ \t\r\n]+/g, " ")
    .replace(/ ?([，。；：、]) ?/g, "$1")
    .trim();
}

function cleanSectionText(value) {
  return stripProfileNoise(String(value ?? ""))
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/ ?([，。；：、]) ?/g, "$1")
    .trim();
}

function getStructuredBodyText($) {
  const blocks = [];
  $("script,style,noscript").remove();
  $("body").find("h1,h2,h3,h4,h5,h6,p,li").each((_, el) => {
    const text = cleanText($(el).text());
    if (!text || PROFILE_NOISE_RE.test(text)) return;
    if (text) blocks.push(text);
  });
  return blocks.length ? blocks.join("\n") : $("body").text();
}

function normalizeUrl(href, base) {
  if (!href || href === "http://" || href === "https://") return undefined;
  try {
    return new URL(href, base).href;
  } catch {
    return undefined;
  }
}

function getUrlHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function isShiTeacherHome(url) {
  return SHI_HOST_RE.test(getUrlHost(url)) && String(url).includes("/zh_CN/index.htm");
}

function isSchoolOfficialUrl(url) {
  return SCHOOL_HOST_RE.test(getUrlHost(url));
}

function isLikelyProfileUrl(url) {
  if (!url) return false;
  if (isShiTeacherHome(url)) return true;
  if (!isSchoolOfficialUrl(url)) return false;
  if (PROFILE_LIST_PAGE_RE.test(url)) return false;
  return PROFILE_DETAIL_PAGE_RE.test(url);
}

function hasDirectProfile(detail) {
  return Boolean(
    isShiTeacherHome(detail?.teacherHomeUrl) ||
    isLikelyProfileUrl(detail?.officialUrl) ||
    isLikelyProfileUrl(detail?.profileUrl),
  );
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== "");
}

async function ensureDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

async function readUrl(url, cacheName, timeoutMs = INDEX_TIMEOUT_MS) {
  await ensureDir();
  const cachePath = path.join(CACHE_DIR, cacheName);
  if (!REFRESH_CACHE) {
    try {
      return await fs.readFile(cachePath, "utf8");
    } catch {
      // Fall through.
    }
  }
  const localFallback = LOCAL_FALLBACKS[cacheName];
  if (localFallback && !REFRESH_CACHE) {
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
  } catch (error) {
    if (REFRESH_CACHE) {
      try {
        return await fs.readFile(cachePath, "utf8");
      } catch {
        // Fall through.
      }
    }
    if (localFallback) {
      const html = await fs.readFile(path.join(ROOT, localFallback), "utf8");
      await fs.writeFile(cachePath, html, "utf8");
      return html;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
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
  const mseProfiles = new Map(
    [...mseBlock.matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)]
      .map((match) => [cleanName(match[1]), normalizeUrl(match[2], URLS.msePeople)])
      .filter(([name, url]) => name && url),
  );
  const mse = new Set(mseProfiles.keys());
  return { bme, mse, mseProfiles, all: new Set([...bme, ...mse]) };
}

function pickNames(details, names) {
  return Object.fromEntries(Object.entries(details).filter(([name]) => names.has(name)));
}

function getNamesMissingShiProfile(details, names) {
  return Array.from(names).filter((name) => {
    const detail = details[name] ?? {};
    return !isShiTeacherHome(detail.teacherHomeUrl) && !isShiTeacherHome(detail.profileUrl);
  });
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

function normalizeEmail(email) {
  return String(email ?? "").trim().replace(/^mailto:/i, "").toLowerCase();
}

function getEmailPriority(email) {
  if (/^[A-Za-z0-9._%+-]+@buaa\.edu\.cn$/i.test(email)) return 0;
  if (/^[A-Za-z0-9._%+-]+@(126|163|qq|hotmail|outlook|foxmail)\.com$/i.test(email)) return 1;
  return 2;
}

function getEmail(text) {
  const emails = uniqueItems(
    [...String(text ?? "").matchAll(GENERIC_EMAIL_RE)]
      .map((match) => normalizeEmail(match[0]))
      .filter((email) =>
        email &&
        !/^bme@/i.test(email) &&
        !/^bhygjc@/i.test(email) &&
        !/^postmaster@/i.test(email) &&
        !/^webmaster@/i.test(email),
      ),
  ).sort((a, b) => getEmailPriority(a) - getEmailPriority(b));
  return emails[0];
}

function getAdvisorTags(text) {
  const tags = [];
  if (/硕士生导师|硕导/.test(text)) tags.push("硕士生导师");
  if (/博士生导师|博导/.test(text)) tags.push("博士生导师");
  return tags;
}

function uniqueItems(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function cleanTag(tag) {
  const text = cleanText(tag);
  if (!text) return undefined;
  return ALLOWED_TAGS.has(text) ? text : undefined;
}

function cleanTags(tags) {
  return uniqueItems((tags ?? []).map(cleanTag).filter(Boolean));
}

function getShiSearchAdvisorTags(item) {
  return Array.from(new Set([
    ...getAdvisorTags(`${item.gtutor ?? ""} ${item.doctorTutor ?? ""} ${item.prorank ?? ""}`),
  ]));
}

function normalizeShiProfileUrl(url) {
  const profileUrl = normalizeUrl(url, "https://shi.buaa.edu.cn/");
  const httpsUrl = profileUrl?.replace(/^http:\/\//, "https://");
  const homeMatch = httpsUrl?.match(/^(https:\/\/shi\.buaa\.edu\.cn\/[^/]+\/zh_CN\/index)(?:\.htm|\/.*)?$/);
  return homeMatch ? `${homeMatch[1]}.htm` : httpsUrl;
}

function findShiProfileUrl(text) {
  return normalizeShiProfileUrl(
    String(text ?? "").match(/https?:\/\/shi\.buaa\.edu\.cn\/[A-Za-z0-9._%/-]+\/zh_CN\/index\.htm/i)?.[0],
  );
}

function getCleanResearchSummary(value) {
  const summary = cleanText(value)
    .replace(/^[】\]\s]+/, "")
    .replace(/^【?(研究方向|研究领域|招生方向|主要研究方向|科研方向|教育背景)】?[:：]?/, "")
    .replace(/^(近年来)?(研究)?(主要)?(聚焦于|集中于|主要包括|包括|围绕|主要从事)/, "")
    .trim()
    .slice(0, 220);
  if (!summary || summary.length < 12) return undefined;
  if (!/[\u4e00-\u9fa5]/.test(summary)) return undefined;
  if (PROFILE_NOISE_RE.test(summary)) return undefined;
  if (/扫描手机二维码|欢迎您的访问|位访客|开通时间|最后更新时间|登录\|\s*English\s*\|\s*手机版/.test(summary)) return undefined;
  if (/@buaa\.edu\.cn|E-?Mail|电子邮箱|联系方式/i.test(summary)) return undefined;
  if (/^[等及、，。；\s]+项目/.test(summary)) return undefined;
  if (/[\u4e00-\u9fa5]{2,4}\s*(教授|副教授|讲师|研究员|副研究员|硕导|博导)/.test(summary)) return undefined;
  if (/^(?:20\d{2}|19\d{2})[年\-\/.]/.test(summary)) return undefined;
  if (SUMMARY_FORBIDDEN_RE.test(summary)) return undefined;
  return summary;
}

function splitDirectionText(value) {
  const normalized = cleanSectionText(value)
    .replace(/^【?(研究方向|研究领域|招生方向|主要研究方向)】?[:：]?/, "")
    .replace(/\.{3,}/g, "");
  if (!normalized || PROFILE_NOISE_RE.test(normalized)) return [];
  const inlineNumberedItems = cleanDirectionItems(
    normalized
      .split(/\s*(?:\[\d+\]|\(\d+\)|（\d+）)\s*/)
      .map((item) => item.trim())
      .filter(Boolean),
  );
  if (inlineNumberedItems.length >= 2) return inlineNumberedItems;
  const lines = normalized.split(/\n+/).map(cleanText).filter(Boolean);
  const numberedLines = lines
    .filter((line) => /^(?:\[\d+\]|\(\d+\)|（\d+）|\d+[.、])\s*/.test(line))
    .map((line) => line.replace(/^(?:\[\d+\]|\(\d+\)|（\d+）|\d+[.、])\s*/, ""));
  const numberedLineItems = cleanDirectionItems(numberedLines);
  if (numberedLineItems.length >= 2) return numberedLineItems;

  const compactListItems = uniqueItems(
    lines
      .filter((line) => line.length <= 120 && /[;；、，,]/.test(line) && !/[。！？]/.test(line))
      .flatMap((line) => line.split(/[;；、，,]/))
      .map(cleanDirectionItem)
      .filter(Boolean),
  );
  if (compactListItems.length >= 2) return compactListItems.slice(0, 6);
  if (normalized.length > 120) return [];

  const numbered = [...normalized.matchAll(/(?:^|\n)\s*(?:\[\d+\]|\(\d+\)|（\d+）|\d+[.、])\s*([^\n]+)/g)]
    .map((match) => match[1]);
  const pieces = [
    ...numbered,
    ...lines,
    ...(normalized.length <= 80 ? normalized.split(/[;；、，,]/) : []),
  ];
  return uniqueItems(
    pieces
      .map(cleanDirectionItem)
      .filter(Boolean),
  ).slice(0, 6);
}

function cleanDirectionItem(value) {
  const rawItem = cleanText(value);
  if (!rawItem || PROFILE_NOISE_RE.test(rawItem) || DIRECTION_NARRATIVE_RE.test(rawItem)) return undefined;
  if (/^(通过|利用|结合|解析|探索|开展|加强|重点|针对|研发|实现|提升|研究制定|协同|对人体|在全基因组|本实验室|基于|常用|上述|这些|为制定|制定|催生|推动|参与|担任|聚焦于|将)/.test(rawItem)) return undefined;
  if (/var\s+_tsites|ImageScale|点赞|学生信息|访客|点击次数|发布时间/i.test(rawItem)) return undefined;
  if (/近\d+年承担|近五年承担/.test(rawItem)) return undefined;
  if (/获.*奖|竞赛|专著|教程|经费|万元|在研|主持人?|科技进步|挑战杯|擂主|揭榜挂帅|第一完成人|出版|审稿人|理事|编委|委员会/i.test(rawItem)) return undefined;
  if (/^[\u4e00-\u9fa5]{2,4}[，,][\u4e00-\u9fa5]{2,4}/.test(rawItem)) return undefined;
  const item = rawItem
    .replace(/^Ø+\s*/, "")
    .replace(/^[•·▪◦]\s*/, "")
    .replace(/^[】\]）),，、.。．\s]+|[,，、\s.。…]+$/g, "")
    .replace(/^[：:]\s*/, "")
    .replace(/^[\[(（［【]?\d+[\])）］】、.]*\s*/, "")
    .replace(/^\d+[）)、.]\s*/, "")
    .replace(/^\d+\s+/, "")
    .replace(/^[a-z][.、]\s*/i, "")
    .replace(/[。；;].*$/, "")
    .replace(/[，,]\s*(?:以|研究|开发|实现|解决|特别是|主要|集中|通过|结合|为|并|探索|解析|服务|防止|主持|承担|担任).*$/, "")
    .replace(/^及成果】\s*/, "")
    .replace(/^(近年来)?研究(主要)?(聚焦于|集中于|主要包括|包括)/, "")
    .replace(/^.*?\s+研究主要包括/, "")
    .replace(/^包括/, "")
    .replace(/^具体包括/, "")
    .replace(/^主要从事/, "")
    .replace(/^专注于/, "")
    .replace(/^为/, "")
    .replace(/的教学科研工作$/, "")
    .replace(/^课题组聚焦/, "")
    .replace(/^围绕/, "")
    .replace(/：.*$/, "")
    .replace(/^立足学科交叉.*$/, "")
    .replace(/\s+(?:开展|研发|研究|加强|重点|针对|集中|主要|通过|利用|结合|解析|探索|服务|担任).*$/, "")
    .replace(/^(并)?(探索|解析|开展|研究|开发|研发)/, "")
    .replace(/主$/, "");
  if (item.length < 4 || item.length > 40) return undefined;
  if (!/[\u4e00-\u9fa5]/.test(item)) return undefined;
  if (DIRECTION_FORBIDDEN_RE.test(item)) return undefined;
  if (/作为|欢迎|访客|点击|发布时间|学生信息/.test(item)) return undefined;
  if (/以下[一二三四五六七八九十\d]+方面|^\d{4}[\/-]\d{2}/.test(item)) return undefined;
  if (/^(在|以在|建有|结合|解决|开展跨尺度|另一主要方向|清华)/.test(item)) return undefined;
  if (/(其他|能够替代)$/.test(item)) return undefined;
  if (/^(包括|具体包括|主要从事|主持|承担|立足学科交叉|主持在研多项)$/.test(item)) return undefined;
  if (/@buaa\.edu\.cn/i.test(item)) return undefined;
  return item;
}

function cleanDirectionItems(items) {
  return uniqueItems(
    (items ?? [])
      .flatMap((item) => {
        const text = cleanSectionText(item);
        if (!text) return [];
        return /\[\d+\]|\(\d+\)|（\d+）/.test(text)
          ? text.split(/\s*(?:\[\d+\]|\(\d+\)|（\d+）)\s*/).filter(Boolean)
          : [text];
      })
      .map(cleanDirectionItem)
      .filter(Boolean),
  ).slice(0, 6);
}

function cleanTitle(value) {
  const titleTokens = uniqueItems(
    cleanText(value).match(/副主任医师|主任医师|副研究员|助理教授|副教授|研究员|讲师|教授|医师/g) ?? [],
  );
  return titleTokens.length ? titleTokens.join("、") : undefined;
}

function getTitle(text, fallback) {
  const titleMatch = cleanText(text).match(
    /(副主任医师|主任医师|副研究员|助理教授|副教授|研究员|讲师|教授|医师)(?:、?(?:副主任医师|主任医师|副研究员|助理教授|副教授|研究员|讲师|教授|医师|硕士生导师|博士生导师|博导|硕导))*/,
  );
  return cleanTitle(titleMatch?.[0]) ?? cleanTitle(fallback);
}

function getResearchSummary(text) {
  const normalized = cleanText(text);
  const sections = [
    /(?:【研究方向】|研究方向[:：]?|主要研究方向[:：]?|招生方向[:：]?)(.{16,220}?)(?:【|教育背景|工作经历|代表性|科研项目|论文|联系方式|$)/,
    /【研究领域】(.{16,220}?)(?:【|代表性|科研项目|项目|课题|论文|$)/,
    /(?:研究领域与方向|主要研究领域|研究领域)[:：]?(.{16,220}?)(?:【|教育背景|工作经历|代表性|科研项目|项目|课题|论文|$)/,
    /主要从事(.{12,220}?)(?:的研究|研究工作|领域|技术研究|$)/,
  ];
  for (const section of sections) {
    const match = normalized.match(section);
    const summary = getCleanResearchSummary(match?.[1]);
    if (summary) return summary;
  }
  return undefined;
}

function getResearchDirections(text) {
  const normalized = cleanSectionText(text);
  const endMarkers = "【|教育背景|工作经历|个人简介|简介|学术荣誉|荣誉与奖励|代表性|科研项目|项目|课题|论文|联系方式";
  const sections = [
    new RegExp(`(?:【研究方向】|研究方向[:：]?|主要研究方向[:：]?|招生方向[:：]?)([\\s\\S]{8,1200}?)(?:${endMarkers}|$)`),
    new RegExp(`(?:【研究领域】|研究领域与方向|主要研究领域[:：]?|研究领域[:：]?|研究兴趣[:：]?)([\\s\\S]{8,1200}?)(?:${endMarkers}|$)`),
  ];
  for (const section of sections) {
    const match = normalized.match(section);
    const directions = splitDirectionText(match?.[1]);
    if (directions.length) return directions;
  }
  return [];
}

function getStructuredSections($) {
  const blocks = $("body").find("h1,h2,h3,h4,h5,h6,p,li,div").toArray();
  const sections = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const currentText = cleanText($(blocks[index]).text());
    const labelMatch = currentText.match(SECTION_LABEL_RE);
    if (!labelMatch) continue;

    const label = labelMatch[1];
    const content = [];
    const seen = new Set();

    for (let nextIndex = index + 1; nextIndex < blocks.length; nextIndex += 1) {
      const nextText = cleanText($(blocks[nextIndex]).text());
      if (!nextText) continue;
      if (PROFILE_NOISE_RE.test(nextText)) continue;
      if (SECTION_LABEL_RE.test(nextText)) break;
      if (nextText === currentText || seen.has(nextText)) continue;
      seen.add(nextText);
      content.push(nextText);
      if (content.length >= 8) break;
    }

    sections.push({ label, content });
  }

  return sections;
}

function getSectionDirections($) {
  const sections = getStructuredSections($)
    .filter((section) => /研究方向|研究领域|研究兴趣/.test(section.label));
  for (const section of sections) {
    const focusedEntries = section.content.slice(0, section.label.includes("简介") ? 3 : 2);
    const directItems = cleanDirectionItems(
      focusedEntries.flatMap((entry) => splitDirectionText(entry)),
    );
    if (directItems.length) return directItems;

    const compactItems = cleanDirectionItems(
      focusedEntries
        .filter((entry) => entry.length <= 120)
        .flatMap((entry) => entry.split(/[;；、，,\n]/)),
    );
    if (compactItems.length) return compactItems;
  }

  return [];
}

function getSectionSummary($) {
  const sections = getStructuredSections($);
  const preferred = [
    ...sections.filter((section) => /研究方向简介|研究方向|研究领域|研究兴趣/.test(section.label)),
    ...sections.filter((section) => section.label === "个人简介"),
  ];

  for (const section of preferred) {
    for (const entry of section.content) {
      const summary = getCleanResearchSummary(entry);
      if (summary) return summary;
    }
  }

  return undefined;
}

function getShiHomePanels($, baseUrl) {
  const tabs = $(".TabbedPanelsTab").toArray().map((el) => cleanText($(el).text()));
  const panels = $(".TabbedPanelsContentGroup > .TabbedPanelsContent").toArray();
  if (!tabs.length || !panels.length) return [];

  return tabs.map((label, index) => {
    const panel = panels[index];
    const root = panel ? $(panel) : null;
    const texts = uniqueItems(
      (root ? root.find("a,div,p,li,span").toArray() : [])
        .map((el) => cleanText($(el).text()))
        .filter((text) => text && text !== label),
    );
    const links = root
      ? root.find("a[href]").toArray()
        .map((el) => ({
          text: cleanText($(el).text()),
          url: normalizeUrl($(el).attr("href"), baseUrl),
        }))
        .filter((item) => item.text && item.url)
      : [];

    return {
      label,
      texts,
      links,
    };
  });
}

function getShiHomePanelDirections($, baseUrl) {
  const sections = getShiHomePanels($, baseUrl)
    .filter((section) => /研究方向|研究领域/.test(section.label));
  if (!sections.length) return [];

  const linkedDirections = cleanDirectionItems(
    sections.flatMap((section) => section.links.map((item) => item.text)),
  );
  if (linkedDirections.length) return linkedDirections;

  return cleanDirectionItems(
    sections.flatMap((section) => section.texts.flatMap((text) => splitDirectionText(text))),
  );
}

function getShiHomePanelSummary($, baseUrl) {
  const sections = getShiHomePanels($, baseUrl);
  const preferred = [
    ...sections.filter((section) => /个人简介/.test(section.label)),
    ...sections.filter((section) => /研究方向|研究领域/.test(section.label)),
  ];

  for (const section of preferred) {
    for (const text of section.texts) {
      const summary = getCleanResearchSummary(text);
      if (summary) return summary;
    }
  }

  return undefined;
}

function getTsiteViewMode(html) {
  return html.match(/_tsites_com_view_mode_type_\s*=\s*(\d+)/)?.[1] ?? "8";
}

async function decryptTsiteEmail($, pageUrl, html) {
  const fields = $('span[_tsites_encrypt_field="_tsites_encrypt_field"]').toArray()
    .map((el) => ({
      id: $(el).attr("id"),
      content: cleanText($(el).text()),
    }))
    .filter((field) => field.id && field.content);
  if (!fields.length) return undefined;

  const mode = getTsiteViewMode(html);
  const endpoint = new URL(TSITES_ENCRYPT_PATH, pageUrl);
  const decoded = await Promise.all(fields.map(async ({ id, content }) => {
    try {
      const url = new URL(endpoint);
      url.searchParams.set("id", id);
      url.searchParams.set("content", content);
      url.searchParams.set("mode", mode);
      const response = await fetch(url);
      if (!response.ok) return undefined;
      const data = await response.json();
      return data?.content;
    } catch {
      return undefined;
    }
  }));

  return getEmail(decoded.join(" "));
}

function pickSharedTeacherFallbacks(details, names) {
  return Object.fromEntries(
    Object.entries(details)
      .filter(([name]) => names.has(name))
      .map(([name, detail]) => [
        name,
        {
          title: detail.title,
          email: detail.email,
          teacherHomeUrl: detail.teacherHomeUrl,
          profileUrl: detail.teacherHomeUrl ?? detail.profileUrl,
          tags: getAdvisorTags((detail.tags ?? []).join(" ")),
        },
      ]),
  );
}

function parseBmeTeacherIndex(html) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const details = {};
  $("a").each((_, el) => {
    const name = cleanName($(el).text());
    const url = normalizeUrl($(el).attr("href"), BME_BASE);
    if (!name || !url || !/(teacherInfo|shi\.buaa\.edu\.cn)/.test(url)) return;
    const current = details[name] ?? { tags: [] };
    if (SHI_HOST_RE.test(getUrlHost(url))) {
      const teacherHomeUrl = normalizeShiProfileUrl(url);
      details[name] = {
        ...current,
        teacherHomeUrl,
        profileUrl: current.profileUrl ?? teacherHomeUrl,
      };
      return;
    }
    details[name] = isSchoolOfficialUrl(url)
      ? {
          ...current,
          officialUrl: url,
          profileUrl: url,
          sourceUrl: url,
        }
      : current;
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
      teacherHomeUrl: profileUrl,
      profileUrl,
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
  const pageUrls = getShiTeacherPageUrls(firstPage, indexUrl).slice(1);
  const remainingPages = await Promise.all(
    pageUrls.map(async (url) => {
      const page = new URL(url).searchParams.get("PAGENUM") ?? "1";
      const html = await readOptionalUrl(url, `${cachePrefix}-shi-teachers-${page}.html`);
      return html ? { html, baseUrl: url } : null;
    }),
  );
  const pages = [{ html: firstPage, baseUrl: indexUrl }, ...remainingPages.filter(Boolean)];
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

function getExactShiSearchMatches(jsonTexts, name) {
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
        .filter((item) => {
          const itemName = cleanName(item.showName || item.teacherName || item.name);
          return itemName === name && item.url?.includes("/zh_CN/index.htm");
        }),
    );
  }
  const matchesByUrl = new Map(exactMatches.map((item) => [normalizeShiProfileUrl(item.url), item]));
  return Array.from(matchesByUrl.entries()).filter(([url]) => url);
}

function hasUniqueShiSearchMatch(jsonTexts, name) {
  return getExactShiSearchMatches(jsonTexts, name).length === 1;
}

function parseShiSearchResult(jsonTexts, name) {
  const matches = getExactShiSearchMatches(jsonTexts, name);
  if (matches.length !== 1) return {};
  const [profileUrl, match] = matches[0];
  return {
    [name]: {
      teacherHomeUrl: profileUrl,
      profileUrl,
      title: cleanText(match.prorank) || undefined,
      email: getEmail(match.mail ?? ""),
      tags: getShiSearchAdvisorTags(match),
      directions: [],
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
  const nameArray = Array.from(names);
  for (let index = 0; index < nameArray.length; index += 4) {
    const batch = nameArray.slice(index, index + 4);
    const results = await Promise.all(batch.map(async (name) => {
      const jsonTexts = [];
      const firstJson = await readOptionalUrl(getShiSearchUrl(name), cacheNameForName("shi-search", name, "json"), 8000);
      if (firstJson) jsonTexts.push(firstJson);
      const totalPage = Math.min(getTotalPage(firstJson), MAX_SHI_SEARCH_PAGES);
      for (let page = 2; page <= totalPage; page += 1) {
        if (hasUniqueShiSearchMatch(jsonTexts, name)) break;
        const jsonText = await readOptionalUrl(
          getShiSearchPageUrl(name, page),
          cacheNameForName(`shi-search-${page}`, name, "json"),
          8000,
        );
        if (jsonText) jsonTexts.push(jsonText);
      }
      return parseShiSearchResult(jsonTexts, name);
    }));
    for (const result of results) Object.assign(details, result);
  }
  return details;
}

function parseProfilePage(html, url, fallback = {}) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const rawText = getStructuredBodyText($);
  const text = cleanText(rawText);
  const metaDescription = cleanText($('meta[name="description"]').attr("content") ?? "");
  const foundTeacherHome = findShiProfileUrl(`${metaDescription} ${text}`);
  const officialUrl = firstValue(
    isSchoolOfficialUrl(fallback.officialUrl) ? fallback.officialUrl : undefined,
    isSchoolOfficialUrl(url) ? url : undefined,
    isSchoolOfficialUrl(fallback.profileUrl) ? fallback.profileUrl : undefined,
    isSchoolOfficialUrl(fallback.sourceUrl) ? fallback.sourceUrl : undefined,
  );
  const teacherHomeUrl = firstValue(
    fallback.teacherHomeUrl,
    isShiTeacherHome(fallback.officialUrl) ? normalizeShiProfileUrl(fallback.officialUrl) : undefined,
    isShiTeacherHome(url) ? url : undefined,
    isShiTeacherHome(foundTeacherHome) ? foundTeacherHome : undefined,
    isShiTeacherHome(fallback.profileUrl) ? fallback.profileUrl : undefined,
  );
  const profileUrl = officialUrl ?? fallback.profileUrl ?? teacherHomeUrl ?? url;
  const directions = cleanDirectionItems([
    ...getResearchDirections(rawText),
    ...getSectionDirections($),
  ]);
  const fallbackDirections = fallback.directions?.length
    ? fallback.directions
    : splitDirectionText(fallback.researchSummary);
  const researchSummary = firstValue(
    getResearchSummary(text),
    getSectionSummary($),
    getCleanResearchSummary(fallback.researchSummary),
  );
  return {
    ...fallback,
    officialUrl,
    teacherHomeUrl,
    profileUrl,
    sourceUrl: officialUrl ?? fallback.sourceUrl ?? url,
    title: getTitle(`${metaDescription} ${text}`, fallback.title),
    email: getEmail(`${metaDescription} ${text}`) ?? fallback.email,
    tags: Array.from(new Set([...(fallback.tags ?? []), ...getAdvisorTags(text)])),
    directions: directions.length ? directions : fallbackDirections,
    researchSummary,
  };
}

async function parseProfilePageAsync(html, url, fallback = {}) {
  const parsed = parseProfilePage(html, url, fallback);
  if (!isShiTeacherHome(url)) return parsed;

  const $ = cheerio.load(html, { decodeEntities: true });
  const panelDirections = getShiHomePanelDirections($, url);
  const panelSummary = getShiHomePanelSummary($, url);
  const decodedEmail = parsed.email ? undefined : await decryptTsiteEmail($, url, html);

  return {
    ...parsed,
    teacherHomeUrl: parsed.teacherHomeUrl ?? normalizeShiProfileUrl(url),
    email: parsed.email ?? decodedEmail,
    directions: panelDirections.length
      ? cleanDirectionItems(panelDirections)
      : cleanDirectionItems(parsed.directions ?? []),
    researchSummary: firstValue(
      panelSummary,
      getCleanResearchSummary(parsed.researchSummary),
      getSectionSummary($),
    ),
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
      officialUrl: isSchoolOfficialUrl(sourceUrl) ? sourceUrl : undefined,
      profileUrl: sourceUrl,
      sourceUrl,
      tags: [],
    };
  });

  $("div.li-r, div.li-r_tzgg").each((_, el) => {
    const anchor = $(el).find("a[title]").first();
    const name = cleanName(anchor.text());
    if (!name) return;
    const text = cleanText($(el).text());
    const profileUrl = findShiProfileUrl(text);
    const sourceUrl = normalizeUrl(anchor.attr("href"), baseUrl);
    details[name] = {
      ...(details[name] ?? {}),
      title: getTitle(text, details[name]?.title ?? "师资人员"),
      email: getEmail(text),
      officialUrl: isSchoolOfficialUrl(sourceUrl) ? sourceUrl : details[name]?.officialUrl,
      profileUrl: isSchoolOfficialUrl(sourceUrl) ? sourceUrl : (details[name]?.profileUrl ?? profileUrl),
      teacherHomeUrl: isShiTeacherHome(profileUrl) ? profileUrl : details[name]?.teacherHomeUrl,
      sourceUrl,
      tags: Array.from(new Set([...(details[name]?.tags ?? []), ...getAdvisorTags(text)])),
      directions: getResearchDirections(text),
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
    const key = `${item?.label ?? ""}|${item?.sourceUrl ?? ""}`;
    if (!item || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mergeDetails(...objects) {
  const merged = {};
  for (const object of objects) {
    for (const [name, detail] of Object.entries(object)) {
      const current = merged[name] ?? {};
      const cleanDetail = Object.fromEntries(
        Object.entries(detail).filter(([, value]) => value !== undefined && value !== ""),
      );
      const officialUrl = firstValue(
        isSchoolOfficialUrl(cleanDetail.officialUrl) ? cleanDetail.officialUrl : undefined,
        isSchoolOfficialUrl(cleanDetail.profileUrl) ? cleanDetail.profileUrl : undefined,
        isSchoolOfficialUrl(cleanDetail.sourceUrl) ? cleanDetail.sourceUrl : undefined,
        isSchoolOfficialUrl(current.officialUrl) ? current.officialUrl : undefined,
      );
      const teacherHomeUrl = firstValue(
        cleanDetail.teacherHomeUrl,
        isShiTeacherHome(cleanDetail.officialUrl) ? normalizeShiProfileUrl(cleanDetail.officialUrl) : undefined,
        isShiTeacherHome(cleanDetail.profileUrl) ? cleanDetail.profileUrl : undefined,
        isShiTeacherHome(cleanDetail.sourceUrl) ? cleanDetail.sourceUrl : undefined,
        isShiTeacherHome(current.officialUrl) ? normalizeShiProfileUrl(current.officialUrl) : undefined,
        current.teacherHomeUrl,
      );
      const profileUrl = firstValue(
        officialUrl,
        isSchoolOfficialUrl(current.profileUrl) ? current.profileUrl : undefined,
        isShiTeacherHome(current.profileUrl) ? undefined : current.profileUrl,
        teacherHomeUrl,
        cleanDetail.profileUrl,
        current.profileUrl,
      );
      const sourceUrl = firstValue(officialUrl, cleanDetail.sourceUrl, current.sourceUrl, profileUrl);
      const researchSummary = firstValue(
        getCleanResearchSummary(cleanDetail.researchSummary),
        getCleanResearchSummary(current.researchSummary),
      );
      merged[name] = {
        ...current,
        ...cleanDetail,
        officialUrl,
        teacherHomeUrl,
        profileUrl,
        sourceUrl,
        researchSummary,
        tags: cleanTags([...(current.tags ?? []), ...(detail.tags ?? [])]),
        directions: cleanDirectionItems([...(current.directions ?? []), ...(detail.directions ?? [])]),
        admissions: uniqueAdmissions([...(current.admissions ?? []), ...(detail.admissions ?? [])]),
      };
    }
  }
  return merged;
}

async function getMseDetailPages() {
  const configs = [
    { url: URLS.mseDetail, cacheName: "mse-detail-0.html" },
    ...Array.from({ length: 14 }, (_, index) => ({
      url: `https://ygy.buaa.edu.cn/szdw1/szryxx/${index + 1}.htm`,
      cacheName: `mse-detail-${index + 1}.html`,
    })),
  ];
  const pages = await Promise.all(
    configs.map(async ({ url, cacheName }) => {
      const html = await readOptionalUrl(url, cacheName);
      return html ? { html, baseUrl: url } : null;
    }),
  );
  return pages.filter(Boolean);
}

function getProfileFetchUrl(detail) {
  return firstValue(
    isLikelyProfileUrl(detail.officialUrl) ? detail.officialUrl : undefined,
    isLikelyProfileUrl(detail.profileUrl) ? detail.profileUrl : undefined,
    isLikelyProfileUrl(detail.sourceUrl) ? detail.sourceUrl : undefined,
    isShiTeacherHome(detail.teacherHomeUrl) ? detail.teacherHomeUrl : undefined,
  );
}

function getProfileCachePrefixes(url, schoolKey) {
  if (isSchoolOfficialUrl(url) && getUrlHost(url).includes("ygy.buaa.edu.cn")) return ["mse-official", "mse"];
  if (isSchoolOfficialUrl(url) && getUrlHost(url).includes("bme.buaa.edu.cn")) return ["bme", "bme-official"];
  return [schoolKey];
}

function findCachedProfile(cachedFiles, url, schoolKey, name) {
  const prefixes = getProfileCachePrefixes(url, schoolKey);
  for (const prefix of prefixes) {
    const exactName = cacheNameFor(url, prefix, name);
    if (cachedFiles.includes(exactName)) return exactName;
  }
  const safeName = name.replace(/[\\/:*?"<>|]/g, "_");
  return cachedFiles.find((file) =>
    prefixes.some((prefix) => file.startsWith(`${prefix}-${safeName}-`)),
  );
}

async function enrichProfiles(details, schoolKey) {
  const entries = Object.entries(details).filter(([, detail]) => getProfileFetchUrl(detail));
  const enriched = {};
  const cachedFiles = await fs.readdir(CACHE_DIR).catch(() => []);
  for (let index = 0; index < entries.length; index += PROFILE_BATCH_SIZE) {
    const batch = entries.slice(index, index + PROFILE_BATCH_SIZE);
    const results = await Promise.all(batch.map(async ([name, detail]) => {
      const url = getProfileFetchUrl(detail);
      if (!url) return [name, detail];
      try {
        const primaryPrefix = getProfileCachePrefixes(url, schoolKey)[0];
        const requestedCacheName = cacheNameFor(url, primaryPrefix, name);
        const cacheName = findCachedProfile(cachedFiles, url, schoolKey, name);
        if (!cacheName && !FETCH_PROFILE_DETAILS) return [name, detail];
        const html = cacheName
          ? await fs.readFile(path.join(CACHE_DIR, cacheName), "utf8")
          : await readUrl(url, requestedCacheName, PROFILE_TIMEOUT_MS);
        return [name, await parseProfilePageAsync(html, url, detail)];
      } catch {
        return [name, detail];
      }
    }));
    for (const [name, detail] of results) enriched[name] = detail;
  }
  return enriched;
}

async function getMseOfficialDetails(mseProfiles) {
  const entries = Array.from(mseProfiles.entries());
  const details = {};
  for (let index = 0; index < entries.length; index += PROFILE_BATCH_SIZE) {
    const batch = entries.slice(index, index + PROFILE_BATCH_SIZE);
    const results = await Promise.all(batch.map(async ([name, url]) => {
      if (!url) return [name, {}];
      const fallback = isSchoolOfficialUrl(url)
        ? { officialUrl: url, profileUrl: url, sourceUrl: url, tags: [] }
        : { teacherHomeUrl: normalizeShiProfileUrl(url), profileUrl: normalizeShiProfileUrl(url), sourceUrl: url, tags: [] };
      const html = await readOptionalUrl(url, cacheNameFor(url, isSchoolOfficialUrl(url) ? "mse-official" : "mse", name), PROFILE_TIMEOUT_MS);
      if (!html) return [name, fallback];
      const parsed = await parseProfilePageAsync(html, url, fallback);
      return [name, parsed];
    }));
    for (const [name, detail] of results) details[name] = detail;
  }
  return details;
}

function deriveDirectionsFromSummary(details) {
  return Object.fromEntries(Object.entries(details).map(([name, detail]) => {
    const currentDirections = cleanDirectionItems(detail.directions);
    const summary = cleanSectionText(detail.researchSummary);
    const canDeriveFromSummary = Boolean(
      summary &&
      summary.length <= 80 &&
      !DIRECTION_NARRATIVE_RE.test(summary) &&
      !/。/.test(summary) &&
      (
        /(?:^|\n)\s*(?:\[\d+\]|\(\d+\)|（\d+）|\d+[.、])/.test(summary) ||
        /[;；、，,]/.test(summary)
      )
    );
    const directions = currentDirections.length
      ? currentDirections
      : (canDeriveFromSummary ? splitDirectionText(detail.researchSummary) : []);
    return [name, { ...detail, directions }];
  }));
}

function sortNames(names) {
  return Array.from(names).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function getNamesNeedingManualReview(details, names) {
  return sortNames(Array.from(names).filter((name) => !hasDirectProfile(details[name] ?? {})));
}

function ensureTargetCoverage(details, names) {
  return Object.fromEntries(sortNames(names).map((name) => [name, details[name] ?? {}]));
}

function sanitizeDetail(detail) {
  const cleanSummary = getCleanResearchSummary(detail.researchSummary);
  return {
    ...detail,
    title: cleanTitle(detail.title),
    tags: cleanTags(detail.tags ?? []),
    directions: cleanDirectionItems(detail.directions ?? []),
    researchSummary: cleanSummary,
  };
}

function sanitizeDetails(details) {
  return Object.fromEntries(Object.entries(details).map(([name, detail]) => [name, sanitizeDetail(detail)]));
}

async function main() {
  const existing = await loadExistingDetails();
  const targetNames = getTargetNames(await fs.readFile(APP_SOURCE, "utf8"));
  const bmeFallbacksForMse = pickSharedTeacherFallbacks(existing.bme ?? {}, targetNames.mse);
  const bmeManualOverrides = pickNames(supervisorManualOverrides.bme ?? {}, targetNames.bme);
  const mseManualOverrides = pickNames(supervisorManualOverrides.mse ?? {}, targetNames.mse);

  const [
    bmeTeacherHtml,
    bmeShiTeachers,
    msePeopleHtml,
    msePages,
    mseShiTeachers,
    mseOfficialDetails,
    bmePhdHtml,
    msePhdHtml,
  ] = await Promise.all([
    readOptionalUrl(URLS.bmeTeachers, "bme-teachers.html"),
    getShiTeacherDetails(URLS.bmeShiTeachers, "bme"),
    readOptionalUrl(URLS.msePeople, "mse-people.html"),
    getMseDetailPages(),
    getShiTeacherDetails(URLS.mseShiTeachers, "mse"),
    getMseOfficialDetails(targetNames.mseProfiles),
    readOptionalUrl(URLS.bmePhd2026, "bme-phd-2026.html"),
    readOptionalUrl(URLS.msePhd2026, "mse-phd-2026.html"),
  ]);

  const bmeTeachers = bmeTeacherHtml ? parseBmeTeacherIndex(bmeTeacherHtml) : {};
  const shiTeachers = mergeDetails(bmeShiTeachers, mseShiTeachers);
  const msePeopleDetails = msePeopleHtml ? parseMseListLikePage(msePeopleHtml, URLS.msePeople) : {};
  const mseDetails = mergeDetails(
    ...msePages.map(({ html, baseUrl }) => parseMseListLikePage(html, baseUrl)),
  );
  const admissions = mergeDetails(
    existing.admissions ?? {},
    bmePhdHtml ? parsePhdAdmissions(bmePhdHtml, URLS.bmePhd2026, targetNames.all) : {},
    msePhdHtml ? parsePhdAdmissions(msePhdHtml, URLS.msePhd2026, targetNames.all) : {},
  );
  const baseBmeDetails = ensureTargetCoverage(
    pickNames(mergeDetails(existing.bme ?? {}, shiTeachers, bmeTeachers, admissions, bmeManualOverrides), targetNames.bme),
    targetNames.bme,
  );
  const baseMseDetails = pickNames(
    mergeDetails(existing.mse ?? {}, bmeFallbacksForMse, shiTeachers, msePeopleDetails, mseDetails, mseOfficialDetails, admissions, mseManualOverrides),
    targetNames.mse,
  );
  const shiSearchTeachers = await getShiSearchDetails(new Set([
    ...getNamesMissingShiProfile(baseBmeDetails, targetNames.bme),
    ...getNamesMissingShiProfile(baseMseDetails, targetNames.mse),
  ]));
  const bmeEnriched = sanitizeDetails(ensureTargetCoverage(deriveDirectionsFromSummary(await enrichProfiles(
    pickNames(mergeDetails(baseBmeDetails, shiSearchTeachers, bmeManualOverrides), targetNames.bme),
    "bme",
  )), targetNames.bme));
  const mseEnriched = sanitizeDetails(deriveDirectionsFromSummary(await enrichProfiles(
    pickNames(mergeDetails(baseMseDetails, shiSearchTeachers, mseManualOverrides), targetNames.mse),
    "mse",
  )));
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
  const manualReview = {
    bme: getNamesNeedingManualReview(bmeEnriched, targetNames.bme),
    mse: getNamesNeedingManualReview(mseEnriched, targetNames.mse),
  };
  console.log(
    `Generated ${Object.keys(bmeEnriched).length} BME, ${Object.keys(mseEnriched).length} MSE, ` +
    `${Object.keys(admissions).length} admission records -> ${path.relative(ROOT, OUTPUT)}`,
  );
  console.log(`Manual review pending: BME ${manualReview.bme.length}, MSE ${manualReview.mse.length}`);
  if (manualReview.bme.length) console.log(`BME manual review list: ${manualReview.bme.join("、")}`);
  if (manualReview.mse.length) console.log(`MSE manual review list: ${manualReview.mse.join("、")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
