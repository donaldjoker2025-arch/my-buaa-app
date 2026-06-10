import { supervisorDetails } from "../src/supervisorDetails.js";

const directionForbiddenPatterns = [
  ["履历/教育背景", /教育背景|教育经历|学习经历|工作经历|个人简介|获得.*学位|本科|博士学位|^\d{4}年|至今/],
  ["项目/基金/人才计划", /国家自然科学基金|国家重点研发|面上项目|青年项|科研项目|基金|课题|项目负责人|支持计划|入选|优秀青年/],
  ["论文/获奖/成果", /代表性|论文|专著|获授权|获奖|奖励|奖|被引|发表|期刊|会议|SCI|ESI|IEEE/],
  ["联系方式/招生说明", /联系方式|电子邮箱|邮箱|招生信息|招生目录|名额/],
  ["索引/页面入口", /师资索引|教师索引|人员列表|个人页面|页面入口/],
  ["兼职/职务/荣誉", /社会兼职|学术兼职|同专业|开授课程|委员会|院士/],
  ["非方向话术", /立足学科交叉|课题组聚焦|围绕|主要从事|包括|主持|承担/],
  ["残句", /其他$|能够替代$|主$|，$|、$|^\./],
];

const summaryForbiddenPatterns = [
  ["履历/教育背景", /教育背景|教育经历|学习经历|工作经历|获得.*学位|本科|博士学位/],
  ["项目/基金/人才计划", /国家自然科学基金|国家重点研发|项目负责人|支持计划|优秀青年|入选.*人才/],
  ["论文/获奖/成果", /代表性论文|近五年代表性论著|获授权|获奖|奖励|高被引|发表|期刊|会议|SCI|ESI|IEEE/],
  ["兼职/职务/荣誉", /社会兼职|学术兼职|同专业|开授课程|委员会|院士/],
  ["联系方式", /联系方式|电子邮箱|邮箱/],
];

const tagForbiddenPatterns = [
  ["履历/教育背景", /教育背景|教育经历|学习经历|工作经历/],
  ["兼职/职务/荣誉", /社会兼职|学术兼职|同专业|开授课程|委员会|院士/],
  ["项目/论文/获奖", /国家自然科学基金|国家重点研发|论文|获奖|奖励|项目|基金/],
];

function inspectDirection(direction) {
  const reasons = [];
  const text = String(direction ?? "").trim();
  if (text.length < 4) reasons.push("过短");
  if (text.length > 60) reasons.push("过长，可能是摘要句而非方向标签");
  if (!/[\u4e00-\u9fa5]/.test(text)) reasons.push("缺少中文内容");
  for (const [label, pattern] of directionForbiddenPatterns) {
    if (pattern.test(text)) reasons.push(label);
  }
  return reasons;
}

function inspectSummary(summary) {
  const reasons = [];
  const text = String(summary ?? "").trim();
  if (!text) return reasons;
  if (text.length < 8) reasons.push("过短");
  if (!/[\u4e00-\u9fa5]/.test(text)) reasons.push("缺少中文内容");
  for (const [label, pattern] of summaryForbiddenPatterns) {
    if (pattern.test(text)) reasons.push(label);
  }
  return reasons;
}

function inspectTag(tag) {
  const reasons = [];
  const text = String(tag ?? "").trim();
  if (!text) reasons.push("空标签");
  if (text.length > 42) reasons.push("过长，可能是摘要句");
  for (const [label, pattern] of tagForbiddenPatterns) {
    if (pattern.test(text)) reasons.push(label);
  }
  return reasons;
}

const issues = [];

for (const [schoolKey, schoolDetails] of Object.entries({
  bme: supervisorDetails.bme ?? {},
  mse: supervisorDetails.mse ?? {},
})) {
  for (const [name, detail] of Object.entries(schoolDetails)) {
    for (const direction of detail.directions ?? []) {
      const reasons = inspectDirection(direction);
      if (reasons.length) {
        issues.push({
          schoolKey,
          name,
          field: "directions",
          direction,
          reasons,
        });
      }
    }
    const summaryReasons = inspectSummary(detail.researchSummary);
    if (summaryReasons.length) {
      issues.push({
        schoolKey,
        name,
        field: "researchSummary",
        direction: detail.researchSummary,
        reasons: summaryReasons,
      });
    }
    for (const tag of detail.tags ?? []) {
      const reasons = inspectTag(tag);
      if (reasons.length) {
        issues.push({
          schoolKey,
          name,
          field: "tags",
          direction: tag,
          reasons,
        });
      }
    }
  }
}

if (issues.length) {
  console.error(`Found ${issues.length} suspicious supervisor detail fields:\n`);
  for (const issue of issues) {
    console.error(`${issue.schoolKey}\t${issue.name}\t${issue.field}\t${issue.direction}\t${issue.reasons.join("、")}`);
  }
  process.exitCode = 1;
} else {
  console.log("Supervisor detail audit passed: no suspicious directions, summaries, or tags found.");
}
