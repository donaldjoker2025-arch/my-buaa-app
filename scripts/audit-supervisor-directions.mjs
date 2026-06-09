import { supervisorDetails } from "../src/supervisorDetails.js";

const forbiddenPatterns = [
  ["履历/教育背景", /教育背景|工作经历|个人简介|获得.*学位|本科|博士学位|^\d{4}年/],
  ["项目/基金/人才计划", /国家自然科学基金|国家重点研发|面上项目|青年项|科研项目|支持计划|入选|优秀青年|课题负责人/],
  ["论文/获奖/成果", /代表性|论文|专著|获授权|获奖|奖|被引/],
  ["联系方式/招生说明", /联系方式|电子邮箱|邮箱|招生信息|招生目录|名额/],
  ["索引/页面入口", /师资索引|教师索引|人员列表|个人页面|页面入口/],
  ["非方向话术", /立足学科交叉|课题组聚焦|围绕|主要从事|包括|主持|承担/],
  ["残句", /其他$|能够替代$|主$|，$|、$/],
];

function inspectDirection(direction) {
  const reasons = [];
  const text = String(direction ?? "").trim();
  if (text.length < 4) reasons.push("过短");
  if (text.length > 60) reasons.push("过长，可能是摘要句而非方向标签");
  if (!/[\u4e00-\u9fa5]/.test(text)) reasons.push("缺少中文内容");
  for (const [label, pattern] of forbiddenPatterns) {
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
          direction,
          reasons,
        });
      }
    }
  }
}

if (issues.length) {
  console.error(`Found ${issues.length} suspicious direction labels:\n`);
  for (const issue of issues) {
    console.error(`${issue.schoolKey}\t${issue.name}\t${issue.direction}\t${issue.reasons.join("、")}`);
  }
  process.exitCode = 1;
} else {
  console.log("Direction label audit passed: no suspicious labels found.");
}
