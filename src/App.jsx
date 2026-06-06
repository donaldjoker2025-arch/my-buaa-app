import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  Link as LinkIcon,
  Mail,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { supervisorDetails } from "./supervisorDetails";

const BME_SOURCE_URL = "https://bme.buaa.edu.cn/zhaopinHr.aspx?catID=9&curID=713&subcatID=40";
const BME_TEACHERS_URL = "https://bme.buaa.edu.cn/teachers.aspx?catID=7";
const BME_PHD_2026_URL = "https://bme.buaa.edu.cn/newsInfo.aspx?catID=13&curID=14729&subcatID=1027";
const MSE_PEOPLE_URL = "https://ygy.buaa.edu.cn/info/1022/3032.htm";
const MSE_DETAIL_URL = "https://ygy.buaa.edu.cn/szdw1/szryxx.htm";
const MSE_PHD_2026_URL = "https://ygy.buaa.edu.cn/info/1004/4492.htm";

const bmeDirections = [
  {
    code: "01",
    group: "生物医学工程",
    name: "生物力学",
    mentors: [
      "樊瑜波", "邓小燕", "宫赫", "孙联文", "牛海军", "郑诚功", "林嘉盈", "蒲放", "张明★", "田伟★", "柳松杨★", "邱贵兴★",
      "丁立", "裴葆青", "易宗春", "孙艳", "李萍", "牛旭锋", "贾潇凌", "郑丽沙", "陈晓芳", "陈建安", "岳蜀华", "顾雪楠", "王丽婷★",
      "贡向辉", "宋崴", "刘美丽", "孙安强", "赵峰", "王丽珍", "张弛", "刘肖", "黄艳", "汲婧", "乔惠婷", "姚杰", "刘笑宇",
    ],
  },
  {
    code: "02",
    group: "生物医学工程",
    name: "生物医学材料",
    mentors: [
      "樊瑜波", "李晓光", "郑诚功", "林嘉盈", "王春仁★", "李晓明", "李萍", "刘海峰", "牛旭锋", "周钢", "陈建安", "顾雪楠", "岳蜀华", "王江雪",
    ],
  },
  {
    code: "03",
    group: "生物医学工程",
    name: "细胞与组织工程",
    mentors: [
      "樊瑜波", "邓小燕", "李晓光", "孙联文", "郑诚功", "林嘉盈", "王春仁★", "李晓明", "易宗春", "宋怡玲", "孙艳", "刘海峰", "李萍",
      "牛旭锋", "贾潇凌", "郑丽沙", "陈晓芳", "岳蜀华", "王丽珍", "顾雪楠", "贡向辉", "宋崴", "刘美丽", "孙安强", "刘肖", "黄艳", "汲婧",
    ],
  },
  {
    code: "04",
    group: "生物医学工程",
    name: "生物医学信息及仪器",
    mentors: [
      "俞梦孙★", "李德玉", "周前祥", "牛海军", "蒲放", "张冀聪", "高关心★", "王卫东★", "李淑宇", "刘涛", "岳蜀华", "许燕", "张政波★",
      "胡大伟", "乔惠婷", "王豫", "刘文勇", "汪待发", "李艳", "王玲", "张弛", "万涛",
    ],
  },
  {
    code: "05",
    group: "生物医学工程",
    name: "人体行为工程与康复工程",
    mentors: [
      "樊瑜波", "李晓光", "周前祥", "牛海军", "郑诚功", "蒲放", "张冀聪", "张明★", "王兴伟★", "黄官升★", "谌玉红★", "王春慧★", "兰陟★", "张秀峰★",
      "丁立", "裴葆青", "王豫", "刘文勇", "陶春静★", "王丽婷★", "柳忠起", "赵峰", "李艳", "韩龙柱", "姚杰",
    ],
  },
  {
    code: "06",
    group: "生物医学工程",
    name: "生物技术",
    mentors: ["荣龙", "刘红", "李晓光", "易宗春", "宋怡玲", "孙艳", "桑晨", "谢倍珍", "余青霓★", "刘美丽", "郑丽沙", "贡向辉", "胡大伟", "付玉明"],
  },
  {
    code: "07",
    group: "生物医学工程",
    name: "空间生命科学及生命保障技术",
    mentors: ["荣龙", "刘红", "孙联文", "蒲放", "郭双生★", "易宗春", "桑晨", "丁立", "孙艳", "宋怡玲", "谢倍珍", "余青霓★", "李英斌★", "胡大伟", "付玉明"],
  },
  {
    code: "08",
    group: "生物医学工程",
    name: "航空航天生物医学工程及人因工程",
    mentors: ["樊瑜波", "荣龙", "孙联文", "周前祥", "牛海军", "蒲放", "张冀聪", "王兴伟★", "黄官升★", "王春慧★", "易宗春", "裴葆青", "丁立", "刘涛", "王丽珍", "柳忠起", "韩龙柱", "刘笑宇"],
  },
  {
    code: "基础医学",
    group: "基础医学",
    name: "数字医学、病理学、生理学、药理学、医学细胞生物学等",
    mentors: [
      "樊瑜波", "李德玉", "郑诚功", "邓小燕", "李晓光", "李晓明", "邱贵兴★", "王辰★", "姚树坤★", "田伟★", "王建昌★", "柯杰★", "伍骥★", "张洪义★", "孟如松★",
      "李淑宇", "刘海峰", "易宗春", "李萍", "孙艳", "贾潇凌", "郑丽沙", "许燕", "孙安强", "岳蜀华", "牛旭锋", "桑晨", "张政波★", "郭伟★",
      "贡向辉", "王江雪", "刘肖", "张弛", "黄艳", "汲婧", "姚杰", "宋崴", "万涛",
    ],
  },
  {
    code: "特种医学",
    group: "特种医学",
    name: "航空与航天医学、运动医学、康复医学、空天生理学等",
    mentors: [
      "樊瑜波", "孙联文", "周前祥", "刘红", "牛海军", "蒲放", "王建昌★", "柯杰★", "伍骥★", "张洪义★", "孟如松★",
      "裴葆青", "桑晨", "丁立", "谢倍珍", "王丽珍", "郭伟★", "柳忠起", "韩龙柱", "刘笑宇", "付玉明",
    ],
  },
];

const msePeople = [
  ["安羽", "https://ygy.buaa.edu.cn/info/1156/3035.htm"],
  ["蔡荣", "https://ygy.buaa.edu.cn/info/1156/3074.htm"],
  ["曹芳芳", "https://ygy.buaa.edu.cn/info/1156/4358.htm"],
  ["常凌乾", "https://ygy.buaa.edu.cn/info/1087/4350.htm"],
  ["陈传宏", "https://ygy.buaa.edu.cn/info/1156/3081.htm"],
  ["陈军歌", "https://ygy.buaa.edu.cn/info/1156/3073.htm"],
  ["陈伟", "https://ygy.buaa.edu.cn/info/1156/3085.htm"],
  ["陈行", "https://ygy.buaa.edu.cn/info/1156/3088.htm"],
  ["陈珣", "https://ygy.buaa.edu.cn/info/1156/3403.htm"],
  ["陈增胜", "https://ygy.buaa.edu.cn/info/1156/3040.htm"],
  ["程健", "https://ygy.buaa.edu.cn/info/1156/2292.htm"],
  ["丁希丽", "https://ygy.buaa.edu.cn/info/1156/3078.htm"],
  ["董再再", "https://ygy.buaa.edu.cn/info/1156/3414.htm"],
  ["樊瑜波", "https://ygy.buaa.edu.cn/info/1087/2592.htm"],
  ["付博", "https://ygy.buaa.edu.cn/info/1156/3052.htm"],
  ["高明", "https://ygy.buaa.edu.cn/info/1156/3043.htm"],
  ["高元明", "https://ygy.buaa.edu.cn/info/1156/3076.htm"],
  ["关鑫宇", "https://ygy.buaa.edu.cn/info/1156/3083.htm"],
  ["郭江真", "https://ygy.buaa.edu.cn/info/1156/3087.htm"],
  ["韩数", "https://ygy.buaa.edu.cn/info/1156/3077.htm"],
  ["郝飞", "https://ygy.buaa.edu.cn/info/1156/3822.htm"],
  ["贺子龙", "https://ygy.buaa.edu.cn/info/1156/3054.htm"],
  ["洪维礼", "https://ygy.buaa.edu.cn/info/1156/3094.htm"],
  ["胡贵平", "https://ygy.buaa.edu.cn/info/1156/3044.htm"],
  ["胡靓", "https://ygy.buaa.edu.cn/info/1156/1552.htm"],
  ["胡中韬", "https://ygy.buaa.edu.cn/info/1156/4214.htm"],
  ["蒋景英", "https://ygy.buaa.edu.cn/info/1156/3036.htm"],
  ["李安然", "https://ygy.buaa.edu.cn/info/1156/2902.htm"],
  ["李呈", "https://ygy.buaa.edu.cn/info/1156/3079.htm"],
  ["李春燕", "https://ygy.buaa.edu.cn/info/1156/2383.htm"],
  ["李建超", "https://ygy.buaa.edu.cn/info/1156/3098.htm"],
  ["李介博", "https://ygy.buaa.edu.cn/info/1156/3092.htm"],
  ["李阳", "https://ygy.buaa.edu.cn/info/1087/4444.htm"],
  ["李长剑", "https://ygy.buaa.edu.cn/info/1156/3452.htm"],
  ["林绪波", "https://ygy.buaa.edu.cn/info/1156/1532.htm"],
  ["刘超", "https://ygy.buaa.edu.cn/info/1156/3084.htm"],
  ["刘慧", "https://ygy.buaa.edu.cn/info/1156/3095.htm"],
  ["刘建刚", "https://ygy.buaa.edu.cn/info/1156/3100.htm"],
  ["刘婍", "https://ygy.buaa.edu.cn/info/1156/3422.htm"],
  ["刘晓冬", "https://ygy.buaa.edu.cn/info/1156/1531.htm"],
  ["刘卓", "https://ygy.buaa.edu.cn/info/1156/3423.htm"],
  ["刘子钰", "https://ygy.buaa.edu.cn/info/1156/3047.htm"],
  ["马青川", "https://ygy.buaa.edu.cn/info/1156/3406.htm"],
  ["牟玮", "https://ygy.buaa.edu.cn/info/1156/3424.htm"],
  ["任韦燕", "https://ygy.buaa.edu.cn/info/1156/3453.htm"],
  ["石波璟", "https://ygy.buaa.edu.cn/info/1156/3086.htm"],
  ["史微", "https://ygy.buaa.edu.cn/info/1156/2912.htm"],
  ["孙旭阳", "https://ygy.buaa.edu.cn/info/1156/3049.htm"],
  ["田捷", "https://ygy.buaa.edu.cn/info/1087/4352.htm"],
  ["唐振超", "https://ygy.buaa.edu.cn/info/1156/3429.htm"],
  ["陶春静", "https://ygy.buaa.edu.cn/info/1156/3072.htm"],
  ["王超", "https://ygy.buaa.edu.cn/info/1156/3039.htm"],
  ["王迪", "https://ygy.buaa.edu.cn/info/1156/3075.htm"],
  ["王柯皓", "https://ygy.buaa.edu.cn/info/1156/3089.htm"],
  ["王硕", "https://ygy.buaa.edu.cn/info/1156/3232.htm"],
  ["王晓飞", "https://ygy.buaa.edu.cn/info/1156/3099.htm"],
  ["王雪林", "https://ygy.buaa.edu.cn/info/1156/3046.htm"],
  ["王杨", "https://ygy.buaa.edu.cn/info/1156/4013.htm"],
  ["杨超娟", "https://ygy.buaa.edu.cn/info/1156/3454.htm"],
  ["杨宏韬", "https://ygy.buaa.edu.cn/info/1156/3080.htm"],
  ["杨昀", "https://shi.buaa.edu.cn/yangyun731/zh_CN/index.htm"],
  ["姚艳", "https://ygy.buaa.edu.cn/info/1156/3425.htm"],
  ["叶盛", "https://ygy.buaa.edu.cn/info/1156/3051.htm"],
  ["尹朋", "https://ygy.buaa.edu.cn/info/1156/3426.htm"],
  ["于健", "https://ygy.buaa.edu.cn/info/1156/3096.htm"],
  ["余春红", "https://ygy.buaa.edu.cn/info/1156/3050.htm"],
  ["张大可", "https://ygy.buaa.edu.cn/info/1156/3038.htm"],
  ["张慧", "https://ygy.buaa.edu.cn/info/1156/3033.htm"],
  ["张靖", "https://ygy.buaa.edu.cn/info/1156/3101.htm"],
  ["张永彪", "https://ygy.buaa.edu.cn/info/1156/3053.htm"],
  ["张泽宇", "https://ygy.buaa.edu.cn/info/1156/4442.htm"],
  ["赵心彬", "https://ygy.buaa.edu.cn/info/1156/3428.htm"],
  ["赵雁雨", "https://ygy.buaa.edu.cn/info/1156/3405.htm"],
  ["郑钰山", "https://ygy.buaa.edu.cn/info/1156/3413.htm"],
  ["钟江宏", "https://ygy.buaa.edu.cn/info/1156/3034.htm"],
  ["周炳", "https://ygy.buaa.edu.cn/info/1156/3041.htm"],
];

const mseKnownDetails = {
  常凌乾: {
    title: "教授",
    email: "lingqianchang@buaa.edu.cn",
    directions: ["纳米电穿孔", "细胞生物芯片", "生物传感器", "药物递送技术"],
    tags: ["国家级人才"],
    sourceUrl: "https://ygy.buaa.edu.cn/info/1087/4350.htm",
  },
  唐振超: {
    title: "副教授、博士生导师",
    email: "tangzhenchao@buaa.edu.cn",
    directions: ["新一代医学成像设备研制", "医学影像大模型", "医学人工智能", "医学影像大数据挖掘"],
    tags: ["医学影像AI"],
    sourceUrl: "https://ygy.buaa.edu.cn/info/1156/3429.htm",
  },
  高明: {
    title: "讲师、医师、硕士生导师、博士生导师",
    email: "gming@buaa.edu.cn",
    directions: ["人体体液蛋白标志物超灵敏检测系统构建", "体外诊断检验试剂研发"],
    tags: ["体外诊断"],
    sourceUrl: "https://ygy.buaa.edu.cn/info/1156/3043.htm",
  },
};

function parseMentor(rawName) {
  const partTime = rawName.includes("★");
  return {
    name: rawName.replace("★", "").replace(/\s+/g, ""),
    partTime,
  };
}

function uniqueItems(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function getTagTone(tag) {
  if (tag.includes("博士生导师")) return "blue";
  if (tag.includes("硕士生导师")) return "green";
  if (tag.includes("兼职导师")) return "amber";
  if (tag.includes("国家级")) return "amber";
  return "neutral";
}

function getSupplementalDetail(schoolKey, name) {
  const detail = supervisorDetails[schoolKey]?.[name] ?? {};
  const admission = supervisorDetails.admissions?.[name] ?? {};
  return {
    ...detail,
    email: detail.email ?? admission.email,
    tags: uniqueItems([...(detail.tags ?? []), ...(admission.tags ?? [])]),
    admissions: [...(detail.admissions ?? []), ...(admission.admissions ?? [])],
  };
}

function buildBmeSupervisors() {
  const byName = new Map();

  bmeDirections.forEach((area) => {
    area.mentors.forEach((rawName) => {
      const { name, partTime } = parseMentor(rawName);
      const detail = getSupplementalDetail("bme", name);
      if (!byName.has(name)) {
        byName.set(name, {
          id: `bme-${name}`,
          school: "生物与医学工程学院",
          name,
          title: detail.title ?? "指导教师",
          directions: [],
          groups: new Set(),
          categories: new Set(),
          tags: new Set(["硕士生导师", ...(detail.tags ?? [])]),
          email: detail.email,
          researchSummary: detail.researchSummary,
          admissions: detail.admissions ?? [],
          source: "生物与医学工程学院硕士研究生培养方向设置及指导教师对照表",
          sourceUrl: BME_SOURCE_URL,
          profileUrl: detail.profileUrl,
          profileSourceUrl: detail.sourceUrl,
        });
      }

      const teacher = byName.get(name);
      teacher.directions.push(`${area.code} ${area.name}`);
      teacher.groups.add(area.group);
      teacher.categories.add(area.name);
      if (partTime) teacher.tags.add("兼职导师");
      (detail.tags ?? []).forEach((tag) => teacher.tags.add(tag));
    });
  });

  return Array.from(byName.values()).map((teacher) => ({
    ...teacher,
    groups: Array.from(teacher.groups),
    categories: Array.from(teacher.categories),
    tags: Array.from(teacher.tags),
    admissions: teacher.admissions ?? [],
  }));
}

function buildMseSupervisors() {
  return msePeople.map(([name, profileUrl]) => {
    const detail = mseKnownDetails[name] ?? {};
    const supplemental = getSupplementalDetail("mse", name);
    const directions = detail.directions ?? [];
    return {
      id: `mse-${name}`,
      school: "医学科学与工程学院",
      name,
      title: supplemental.title ?? detail.title ?? "师资人员",
      directions,
      groups: ["医学科学与工程学院师资"],
      categories: directions.length ? directions : ["医工学院师资索引"],
      tags: uniqueItems([...(detail.tags ?? []), ...(supplemental.tags ?? [])]),
      email: supplemental.email ?? detail.email,
      researchSummary: supplemental.researchSummary,
      admissions: supplemental.admissions ?? [],
      source: "医学科学与工程学院人员列表及师资人员详细索引",
      sourceUrl: supplemental.sourceUrl ?? detail.sourceUrl ?? profileUrl,
      profileUrl: supplemental.profileUrl ?? profileUrl,
      profileSourceUrl: supplemental.sourceUrl ?? profileUrl,
    };
  });
}

const supervisors = [...buildBmeSupervisors(), ...buildMseSupervisors()];
const schools = ["全部", ...Array.from(new Set(supervisors.map((item) => item.school)))];
const categories = [
  "全部",
  ...Array.from(new Set(supervisors.flatMap((item) => item.categories))).sort((a, b) => a.localeCompare(b, "zh-Hans-CN")),
];

const sourceCards = [
  {
    title: "生医工学院方向表",
    desc: "硕士培养方向及指导教师对照表，完整包含生物力学、生物医学材料、细胞与组织工程等方向。",
    url: BME_SOURCE_URL,
  },
  {
    title: "生医工学院师资页",
    desc: "用于进一步核对教师身份、主页和联系方式。",
    url: BME_TEACHERS_URL,
  },
  {
    title: "2026博士资格名单",
    desc: "医工交叉学科群 2026 年第一批具有博士生招生资格的导师名单。",
    url: BME_PHD_2026_URL,
  },
  {
    title: "医工学院人员列表",
    desc: "医学科学与工程学院官网发布的按姓氏排列人员列表。",
    url: MSE_PEOPLE_URL,
  },
  {
    title: "医工学院师资详情索引",
    desc: "医学科学与工程学院师资人员详细分页索引。",
    url: MSE_DETAIL_URL,
  },
  {
    title: "2026博士招生方案",
    desc: "医学科学与工程学院发布的医工交叉学科群 2026 年博士研究生招生工作方案。",
    url: MSE_PHD_2026_URL,
  },
];

function getDirectionItems(item) {
  return item.directions.length ? item.directions : item.categories;
}

function getPrimaryDirection(item) {
  const [first] = getDirectionItems(item);
  return first?.replace(/^\S+\s+/, "") ?? "待从官网进一步核验";
}

function getAdvisorStatus(item) {
  if (item.tags.includes("博士生导师")) return "博导";
  if (item.tags.includes("硕士生导师")) return "硕导";
  return "待查";
}

function hasAdvisorTag(item) {
  return item.tags.some((tag) => tag === "硕士生导师" || tag === "博士生导师");
}

function getProfileLinkLabel(url) {
  if (!url) return "教师主页";
  if (url.includes("shi.buaa.edu.cn")) return "北航教师主页";
  if (url.includes("bme.buaa.edu.cn") || url.includes("ygy.buaa.edu.cn")) return "学院教师详情页";
  return "教师主页";
}

function getEvidenceItems(item) {
  return [
    { label: "学院官网来源", active: Boolean(item.sourceUrl) },
    { label: "精确主页入口", active: Boolean(item.profileUrl) },
    { label: "公开方向索引", active: getDirectionItems(item).length > 0 && !getDirectionItems(item).includes("医工学院师资索引") },
    { label: "公开邮箱", active: Boolean(item.email) },
    { label: "导师资格标签", active: hasAdvisorTag(item) },
    { label: "科研/基金摘要", active: Boolean(item.researchSummary) },
    { label: "2026招生线索", active: Boolean(item.admissions?.length) },
  ];
}

function getEvidenceSummary(item) {
  const evidence = getEvidenceItems(item);
  const count = evidence.filter((entry) => entry.active).length;
  const label = count >= 6 ? "信息较完整" : count >= 4 ? "可重点核验" : "需补充核验";
  return { count, total: evidence.length, label, evidence };
}

function getStudentClues(item) {
  const directions = getDirectionItems(item);
  const clues = [];

  if (item.school === "生物与医学工程学院") {
    clues.push("适合先按官方培养方向筛选，再逐一核对导师主页和当年招生目录。");
  } else {
    clues.push("适合从医工学院师资索引进入个人页，重点核对具体课题组方向。");
  }

  if (item.profileUrl) {
    clues.push(`已整理到${getProfileLinkLabel(item.profileUrl)}，建议优先从主页核对职称、邮箱、课题组和论文项目。`);
  } else {
    clues.push("暂未整理到精确个人主页，联系前建议从学院师资页或北航教师主页检索复核。");
  }

  if (directions.length >= 4) {
    clues.push("公开方向覆盖较多，适合方向尚未完全锁定、想比较交叉方向的同学。");
  } else if (directions.length > 1) {
    clues.push("公开方向较集中，可结合论文和课题组网页判断匹配度。");
  } else {
    clues.push("页面仅有基础师资索引，联系前建议补充检索个人主页、论文和课题组新闻。");
  }

  if (item.email) {
    clues.push("已整理公开邮箱，可作为初次礼貌联系入口。");
  } else {
    clues.push("未整理到公开邮箱，建议先通过官网个人页或学院页面核验联系方式。");
  }

  if (hasAdvisorTag(item)) {
    clues.push(`导师资格标签：${item.tags.filter((tag) => tag === "硕士生导师" || tag === "博士生导师").join("、")}。`);
  } else {
    clues.push("暂未整理到硕导/博导公开标签，报考前需以当年招生目录和导师确认结果为准。");
  }

  if (item.researchSummary) {
    clues.push("主页中有科研方向、论文或基金项目线索，可据此继续检索近两三年论文和课题组新闻。");
  }

  if (item.admissions?.length) {
    clues.push("匹配到 2026 博士招生资格名单线索；招生名额和专业方向仍需以学院后续通知与导师确认为准。");
  }

  if (item.tags.includes("兼职导师")) {
    clues.push("标注为兼职导师，务必确认当年是否招生、培养地点和联合指导安排。");
  }

  return clues;
}

const verificationChecklist = [
  "当年是否在目标专业/方向招生",
  "硕士、博士、专硕或学硕名额",
  "是否有联合培养、临床或企业合作安排",
  "近两三年论文、项目和课题组新闻",
  "回复邮箱、面试材料和简历投递要求",
];

const adviceBlocks = [
  {
    icon: ClipboardCheck,
    title: "联系导师前",
    lines: [
      "先核对当前学院、职称、主页、联系方式和当年招生目录，再阅读近两三篇代表性论文或课题组新闻。",
      "简历中写清专业背景、课程/项目经历、科研或工程技能、希望申请的培养方向，不绑定任何特定奖项模板。",
    ],
  },
  {
    icon: Mail,
    title: "套磁邮件",
    lines: [
      "主题建议使用：推免/考研咨询-姓名-本科院校-意向方向。",
      "正文保持简短：自我介绍、为何关注该方向、已有能力与可投入时间、附件简历；避免群发痕迹。",
    ],
  },
  {
    icon: AlertTriangle,
    title: "信息核验",
    lines: [
      "同名教师、跨学院任职、兼职导师和页面迁移都可能导致旧资料失效，最终以学院官网、北航教师个人主页和当年招生通知为准。",
      "本页面不对导师作主观排名，也不展示无法公开核验的毕业风险、就业薪资或学生评价。",
    ],
  },
];

function Chip({ children, tone = "neutral" }) {
  return <span className={`chip chip--${tone}`}>{children}</span>;
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="section-title">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function SourceNotice() {
  return (
    <div className="notice">
      <CheckCircle2 aria-hidden="true" />
      <div>
        <p>数据说明</p>
        <span>
          本页优先展示官网可核验信息：生医工学院按官方硕士培养方向表汇总，医工学院按官网人员列表和师资详情索引汇总。未由公开页面直接确认的职称、评价、主观打分不再展示。
        </span>
      </div>
    </div>
  );
}

function SupervisorCard({ item, expanded, onToggle }) {
  const directions = getDirectionItems(item);
  const evidence = getEvidenceSummary(item);
  const progress = `${(evidence.count / evidence.total) * 100}%`;
  const advisorStatus = getAdvisorStatus(item);
  const advisorTags = item.tags.filter((tag) => tag === "硕士生导师" || tag === "博士生导师");

  return (
    <article className="supervisor-card">
      <button type="button" className="supervisor-card__summary" onClick={onToggle} aria-expanded={expanded}>
        <div className="supervisor-card__identity">
          <div className="avatar" aria-hidden="true">{item.name.slice(0, 1)}</div>
          <div className="supervisor-card__main">
            <div className="supervisor-card__headline">
              <h3>{item.name}</h3>
              <span>{item.title}</span>
            </div>
            <div className="supervisor-card__chips">
              <Chip tone={item.school === "医学科学与工程学院" ? "blue" : "green"}>{item.school}</Chip>
              {item.tags.map((tag) => <Chip key={tag} tone={getTagTone(tag)}>{tag}</Chip>)}
              <Chip tone="slate">{evidence.label}</Chip>
            </div>
          </div>
        </div>

        <div className="supervisor-card__metrics">
          <div>
            <strong>{directions.length}</strong>
            <span>公开方向</span>
          </div>
          <div>
            <strong>{item.email ? "有" : "待查"}</strong>
            <span>邮箱</span>
          </div>
          <div>
            <strong>{advisorStatus}</strong>
            <span>资格</span>
          </div>
          <ChevronDown className={expanded ? "chevron chevron--open" : "chevron"} aria-hidden="true" />
        </div>
      </button>

      <div className="direction-strip">
        {directions.slice(0, 5).map((direction) => <Chip key={direction}>{direction}</Chip>)}
        {directions.length > 5 && <Chip tone="outline">+{directions.length - 5} 个方向</Chip>}
      </div>

      {expanded && (
        <div className="supervisor-card__detail">
          <div className="detail-grid">
            <div className="detail-panel">
              <span className="detail-label">学生选择线索</span>
              <ul className="plain-list">
                {getStudentClues(item).map((clue) => <li key={clue}>{clue}</li>)}
              </ul>
            </div>
            <div className="detail-panel">
              <span className="detail-label">可核验资料</span>
              <div className="evidence-meter" aria-label={`可核验线索 ${evidence.count}/${evidence.total}`}>
                <div style={{ width: progress }} />
              </div>
              <div className="evidence-list">
                {evidence.evidence.map((entry) => (
                  <span key={entry.label} className={entry.active ? "evidence-item evidence-item--active" : "evidence-item"}>
                    <CheckCircle2 aria-hidden="true" />
                    {entry.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-panel">
            <span className="detail-label">公开方向/索引分类</span>
            <div className="chip-row">
              {directions.map((direction) => <Chip key={direction}>{direction}</Chip>)}
            </div>
          </div>

          {(advisorTags.length > 0 || item.researchSummary || item.admissions?.length) && (
            <div className="detail-grid">
              {advisorTags.length > 0 && (
                <div className="detail-panel">
                  <span className="detail-label">导师资格标签</span>
                  <div className="chip-row">
                    {advisorTags.map((tag) => <Chip key={tag} tone={getTagTone(tag)}>{tag}</Chip>)}
                  </div>
                  <p className="detail-note">标签来自教师主页、学院师资页或 2026 博士招生资格名单；报名前仍需按当年目录复核。</p>
                </div>
              )}
              {item.researchSummary && (
                <div className="detail-panel">
                  <span className="detail-label">主页科研/基金线索</span>
                  <p className="detail-copy">{item.researchSummary}</p>
                </div>
              )}
              {item.admissions?.length > 0 && (
                <div className="detail-panel">
                  <span className="detail-label">招生线索</span>
                  <ul className="link-list">
                    {item.admissions.map((entry, index) => (
                      <li key={`${entry.label}-${index}`}>
                        <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                          {entry.label}
                          <ArrowUpRight aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="detail-grid detail-grid--compact">
            <div className="fact-row">
              <Layers aria-hidden="true" />
              <div>
                <span>覆盖类别</span>
                <p>{item.groups.join("、")}</p>
              </div>
            </div>
            <div className="fact-row">
              <BookOpen aria-hidden="true" />
              <div>
                <span>主要线索</span>
                <p>{getPrimaryDirection(item)}</p>
              </div>
            </div>
          </div>

          <div className="action-row">
            {item.email && (
              <a className="link-button link-button--strong" href={`mailto:${item.email}`}>
                <Mail aria-hidden="true" />
                {item.email}
              </a>
            )}
            {item.profileUrl && (
              <a className="link-button" href={item.profileUrl} target="_blank" rel="noreferrer">
                <UserRound aria-hidden="true" />
                {getProfileLinkLabel(item.profileUrl)}
              </a>
            )}
            {!item.profileUrl && item.profileSourceUrl && (
              <a className="link-button" href={item.profileSourceUrl} target="_blank" rel="noreferrer">
                <UserRound aria-hidden="true" />
                师资详情页
              </a>
            )}
            <a className="link-button" href={item.sourceUrl} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              数据来源
            </a>
          </div>
        </div>
      )}
    </article>
  );
}

function DirectionCard({ area }) {
  const parsedMentors = area.mentors.map(parseMentor);
  const partTimeCount = parsedMentors.filter((mentor) => mentor.partTime).length;

  return (
    <article className="direction-card">
      <div className="direction-card__header">
        <div>
          <span>{area.group}</span>
          <h3>{area.code} {area.name}</h3>
        </div>
        <div className="direction-card__count">
          <strong>{area.mentors.length}</strong>
          <span>导师</span>
        </div>
      </div>
      <div className="direction-card__meta">
        <Chip tone="green">全量纳入</Chip>
        {partTimeCount > 0 && <Chip tone="amber">{partTimeCount} 位兼职导师</Chip>}
      </div>
      <div className="mentor-cloud">
        {parsedMentors.map(({ name, partTime }) => (
          <span key={`${area.code}-${name}`} className={partTime ? "mentor-pill mentor-pill--part-time" : "mentor-pill"}>
            {name}{partTime ? " · 兼职" : ""}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function App() {
  const [schoolFilter, setSchoolFilter] = useState("全部");
  const [catFilter, setCatFilter] = useState("全部");
  const [searchQ, setSearchQ] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("database");

  const stats = useMemo(() => {
    const emailCount = supervisors.filter((item) => item.email).length;
    const advisorTagCount = supervisors.filter((item) => hasAdvisorTag(item)).length;
    const admissionCount = supervisors.filter((item) => item.admissions?.length).length;
    return [
      { label: "导师/师资记录", value: supervisors.length, icon: Users },
      { label: "培养方向与索引", value: categories.length - 1, icon: Layers },
      { label: "公开邮箱记录", value: emailCount, icon: Mail },
      { label: "硕/博导标签", value: advisorTagCount, icon: ClipboardCheck },
      { label: "2026招生线索", value: admissionCount, icon: GraduationCap },
    ];
  }, []);

  const filtered = useMemo(() => {
    const query = searchQ.trim().toLowerCase();
    return supervisors
      .filter((item) => schoolFilter === "全部" || item.school === schoolFilter)
      .filter((item) => catFilter === "全部" || item.categories.includes(catFilter))
      .filter((item) => {
        if (!query) return true;
        const haystack = [
          item.name,
          item.school,
          item.title,
          ...item.directions,
          ...item.groups,
          ...item.categories,
          ...item.tags,
          item.researchSummary ?? "",
          item.profileUrl ?? "",
          item.email ?? "",
          ...(item.admissions ?? []).map((entry) => entry.label),
        ].join(" ").toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => a.school.localeCompare(b.school, "zh-Hans-CN") || a.name.localeCompare(b.name, "zh-Hans-CN"));
  }, [catFilter, schoolFilter, searchQ]);

  const tabs = [
    { id: "database", label: "导师索引", icon: Search },
    { id: "directions", label: "培养方向", icon: GraduationCap },
    { id: "sources", label: "来源与建议", icon: LinkIcon },
  ];

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">BUAA Biomedical Mentor Index</span>
          <h1>北航生医工/医工两院导师信息索引</h1>
          <p>
            面向考研和保研择导的公开信息工作台。保留官网可核验来源，补充方向覆盖、联系入口、资料线索和联系前核验清单，帮助先缩小范围，再去官网确认细节。
          </p>
        </div>
        <div className="hero-visual" aria-label="公开导师信息概览">
          <div className="hero-visual__top">
            <BarChart3 aria-hidden="true" />
            <span>公开来源记录</span>
          </div>
          <strong>{supervisors.length}</strong>
          <p>两院导师/师资索引</p>
          <div className="hero-bars" aria-hidden="true">
            <span style={{ height: "72%" }} />
            <span style={{ height: "48%" }} />
            <span style={{ height: "84%" }} />
            <span style={{ height: "58%" }} />
            <span style={{ height: "68%" }} />
          </div>
        </div>
      </section>

      <section className="stat-grid" aria-label="数据概览">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <Icon aria-hidden="true" />
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </section>

      <nav className="tabs" aria-label="页面导航">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? "tab tab--active" : "tab"}
            onClick={() => setActiveTab(id)}
          >
            <Icon aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "database" && (
        <section className="content-section">
          <SourceNotice />

          <div className="filter-panel">
            <div className="filter-panel__heading">
              <div>
                <Filter aria-hidden="true" />
                <span>快速筛选</span>
              </div>
              <p>当前筛选结果：{filtered.length} 条</p>
            </div>
            <div className="filter-grid">
              <label className="field field--search">
                <span>关键词</span>
                <div className="input-with-icon">
                  <Search aria-hidden="true" />
                  <input
                    placeholder="搜索姓名、学院、方向、邮箱或关键词"
                    value={searchQ}
                    onChange={(event) => setSearchQ(event.target.value)}
                  />
                </div>
              </label>
              <label className="field">
                <span>学院</span>
                <select value={schoolFilter} onChange={(event) => setSchoolFilter(event.target.value)}>
                  {schools.map((school) => <option key={school}>{school}</option>)}
                </select>
              </label>
              <label className="field">
                <span>方向/分类</span>
                <select value={catFilter} onChange={(event) => setCatFilter(event.target.value)}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="supervisor-list">
            {filtered.map((item) => (
              <SupervisorCard
                key={item.id}
                item={item}
                expanded={expanded === item.id}
                onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === "directions" && (
        <section className="content-section">
          <SectionTitle eyebrow="培养方向" title="按官方方向查看导师池">
            已恢复并保留生物力学、生物医学材料、细胞与组织工程等方向，方便按专业兴趣反向查找导师。
          </SectionTitle>
          <div className="direction-grid">
            {bmeDirections.map((area) => <DirectionCard key={`${area.group}-${area.code}`} area={area} />)}
          </div>
        </section>
      )}

      {activeTab === "sources" && (
        <section className="content-section">
          <SectionTitle eyebrow="来源与建议" title="把不确定信息留给官网复核">
            页面只做公开信息索引和联系准备提示，不替代当年招生目录、学院通知或导师本人确认。
          </SectionTitle>

          <div className="source-grid">
            {sourceCards.map((source) => (
              <a key={source.url} className="source-card" href={source.url} target="_blank" rel="noreferrer">
                <div>
                  <LinkIcon aria-hidden="true" />
                  <h3>{source.title}</h3>
                </div>
                <p>{source.desc}</p>
                <span>
                  打开来源
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>

          <div className="advice-layout">
            <div className="checklist-panel">
              <div className="checklist-panel__title">
                <SlidersHorizontal aria-hidden="true" />
                <h3>联系前建议补充核验</h3>
              </div>
              <ul className="checklist">
                {verificationChecklist.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="advice-cards">
              {adviceBlocks.map(({ icon: Icon, title, lines }) => (
                <article key={title} className="advice-card">
                  <Icon aria-hidden="true" />
                  <div>
                    <h3>{title}</h3>
                    {lines.map((line) => <p key={line}>{line}</p>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
