import fs from "node:fs";
import path from "node:path";
import { supervisorDetails } from "../src/supervisorDetails.js";

const APP_SOURCE = path.join(process.cwd(), "src", "App.jsx");
const appSource = fs.readFileSync(APP_SOURCE, "utf8");

const ALLOWED_TAGS = new Set(["硕士生导师", "博士生导师", "兼职导师"]);
const PROFILE_NOISE_RE = /var\s+codeInfo|window\.location|jQuery\(|qrcode|二维码|扫描手机二维码|欢迎您的访问|您是第|开通时间|最后更新时间|登录\|\s*English\s*\|\s*手机版|_tsites_com_view_mode_type_|ImageScale|点击次数|发布时间|友情链接|Site Map|版权所有|Copyright/i;
const DIRECTION_NARRATIVE_RE = /我的研究方向|目前对于|有望|可以用来|最终将有望|领衔研制|完成了|长期从事|致力于|广泛运用|尤其关注|服务.*战略需求|研究并不透彻|欢迎/;

function cleanName(value) {
  return String(value ?? "").replace(/\s|\u00a0/g, "").replace(/★/g, "");
}

function sortNames(names) {
  return Array.from(names).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function getExpectedNames() {
  const bmeSection = appSource.match(/const bmeDirections = \[([\s\S]*?)\];\n\nconst msePeople =/s)?.[1] ?? "";
  const mseSection = appSource.match(/const msePeople = \[([\s\S]*?)\];\n\nconst mseKnownDetails =/s)?.[1] ?? "";

  const bme = new Set(
    [...bmeSection.matchAll(/mentors:\s*\[([\s\S]*?)\]/g)]
      .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => cleanName(item[1]))),
  );
  const mse = new Set([...mseSection.matchAll(/\["([^"]+)"/g)].map((match) => cleanName(match[1])));
  return { bme, mse };
}

function hasMeaningfulDetail(detail) {
  return Object.entries(detail ?? {}).some(([, value]) => {
    if (value === undefined || value === null || value === "") return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  });
}

function hasDirectProfile(detail) {
  return Boolean(detail?.teacherHomeUrl || detail?.profileUrl || detail?.officialUrl);
}

function inspectDirection(direction) {
  const reasons = [];
  const text = String(direction ?? "").trim();
  if (!text) return ["空方向"];
  if (text.length < 4) reasons.push("过短");
  if (text.length > 40) reasons.push("过长，可能是叙述句");
  if (!/[\u4e00-\u9fa5]/.test(text)) reasons.push("缺少中文内容");
  if (PROFILE_NOISE_RE.test(text)) reasons.push("页面脚本/页面噪音");
  if (DIRECTION_NARRATIVE_RE.test(text)) reasons.push("叙述句");
  if (/\[\d+\]|\(\d+\)|（\d+）/.test(text)) reasons.push("疑似未清洗的编号列表");
  if (/教育背景|工作经历|论文|期刊|编委|理事|委员会|获奖|项目|基金|联系方式|邮箱/.test(text)) reasons.push("非方向内容");
  if (/^[\u4e00-\u9fa5]{2,4}[，,][\u4e00-\u9fa5]{2,4}/.test(text)) reasons.push("疑似论文作者串");
  return reasons;
}

function inspectSummary(summary) {
  const reasons = [];
  const text = String(summary ?? "").trim();
  if (!text) return reasons;
  if (text.length < 8) reasons.push("过短");
  if (!/[\u4e00-\u9fa5]/.test(text)) reasons.push("缺少中文内容");
  if (PROFILE_NOISE_RE.test(text)) reasons.push("页面脚本/页面噪音");
  if (/教育背景|工作经历|论文|期刊|编委|理事|委员会|获奖|项目|基金|联系方式|邮箱/.test(text)) reasons.push("摘要被非研究内容污染");
  return reasons;
}

function inspectTag(tag) {
  const reasons = [];
  const text = String(tag ?? "").trim();
  if (!text) reasons.push("空标签");
  if (!ALLOWED_TAGS.has(text)) reasons.push("标签不是导师资格标签");
  if (text.length > 16) reasons.push("过长");
  if (PROFILE_NOISE_RE.test(text)) reasons.push("页面脚本/页面噪音");
  return reasons;
}

function buildCoverageReport(expectedNames, detailMap) {
  const rows = sortNames(expectedNames).map((name) => {
    const detail = detailMap[name] ?? {};
    return {
      name,
      hasDetail: hasMeaningfulDetail(detail),
      title: Boolean(detail.title),
      directions: Array.isArray(detail.directions) && detail.directions.length > 0,
      summary: Boolean(detail.researchSummary),
      tags: Array.isArray(detail.tags) && detail.tags.length > 0,
      email: Boolean(detail.email),
      teacherHomeUrl: Boolean(detail.teacherHomeUrl),
      profileUrl: Boolean(detail.profileUrl),
      admissions: Array.isArray(detail.admissions) && detail.admissions.length > 0,
    };
  });

  const collectMissing = (field) => rows.filter((row) => !row[field]).map((row) => row.name);

  return {
    total: rows.length,
    withDetail: rows.filter((row) => row.hasDetail).length,
    missingDetails: collectMissing("hasDetail"),
    missingTitle: collectMissing("title"),
    missingDirections: collectMissing("directions"),
    missingSummary: collectMissing("summary"),
    missingTags: collectMissing("tags"),
    missingEmail: collectMissing("email"),
    missingTeacherHomeUrl: collectMissing("teacherHomeUrl"),
    missingProfileUrl: collectMissing("profileUrl"),
    missingAdmissions: collectMissing("admissions"),
  };
}

function printCoverage(label, report) {
  console.log(
    `${label}: ${report.withDetail}/${report.total} 有详情，` +
    `缺 title ${report.missingTitle.length}，缺 directions ${report.missingDirections.length}，` +
    `缺 summary ${report.missingSummary.length}，缺 tags ${report.missingTags.length}，` +
    `缺 email ${report.missingEmail.length}，缺 teacherHomeUrl ${report.missingTeacherHomeUrl.length}，` +
    `缺 profileUrl ${report.missingProfileUrl.length}，缺 admissions ${report.missingAdmissions.length}`,
  );
  if (report.missingDetails.length) {
    console.log(`${label} 缺少有效详情对象: ${report.missingDetails.join("、")}`);
  }
}

const expectedNames = getExpectedNames();
const coverage = {
  bme: buildCoverageReport(expectedNames.bme, supervisorDetails.bme ?? {}),
  mse: buildCoverageReport(expectedNames.mse, supervisorDetails.mse ?? {}),
};

const suspiciousIssues = [];

for (const [schoolKey, names] of Object.entries(expectedNames)) {
  const detailMap = supervisorDetails[schoolKey] ?? {};
  for (const name of names) {
    const detail = detailMap[name] ?? {};
    if (!hasMeaningfulDetail(detail)) continue;

    for (const direction of detail.directions ?? []) {
      const reasons = inspectDirection(direction);
      if (reasons.length) {
        suspiciousIssues.push({
          schoolKey,
          name,
          field: "directions",
          value: direction,
          reasons,
        });
      }
    }

    const summaryReasons = inspectSummary(detail.researchSummary);
    if (summaryReasons.length) {
      suspiciousIssues.push({
        schoolKey,
        name,
        field: "researchSummary",
        value: detail.researchSummary,
        reasons: summaryReasons,
      });
    }

    for (const tag of detail.tags ?? []) {
      const reasons = inspectTag(tag);
      if (reasons.length) {
        suspiciousIssues.push({
          schoolKey,
          name,
          field: "tags",
          value: tag,
          reasons,
        });
      }
    }
  }
}

const manualReview = {
  bme: sortNames(Array.from(expectedNames.bme).filter((name) => !hasDirectProfile((supervisorDetails.bme ?? {})[name] ?? {}))),
  mse: sortNames(Array.from(expectedNames.mse).filter((name) => !hasDirectProfile((supervisorDetails.mse ?? {})[name] ?? {}))),
};

console.log("Coverage report:");
printCoverage("BME", coverage.bme);
printCoverage("MSE", coverage.mse);

console.log("\nManual review list:");
console.log(`BME: ${manualReview.bme.length} 条`);
if (manualReview.bme.length) console.log(manualReview.bme.join("、"));
console.log(`MSE: ${manualReview.mse.length} 条`);
if (manualReview.mse.length) console.log(manualReview.mse.join("、"));

if (suspiciousIssues.length) {
  console.error(`\nFound ${suspiciousIssues.length} suspicious supervisor detail fields:\n`);
  for (const issue of suspiciousIssues) {
    console.error(`${issue.schoolKey}\t${issue.name}\t${issue.field}\t${issue.value}\t${issue.reasons.join("、")}`);
  }
  process.exitCode = 1;
} else {
  console.log("\nSupervisor detail audit passed: no suspicious directions, summaries, or tags found.");
}
