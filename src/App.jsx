import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Search,
  Send,
  SlidersHorizontal,
  UserRound,
  Users,
  Dices,
  Sparkles,
  Network,
  Star,
  Activity
} from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.15c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
  </svg>
);
import { supervisorDetails } from "./supervisorDetails";
import { communityNotes } from "./communityNotes";
import { TopicGalaxy } from "./TopicGalaxy";
import { MatchQuiz } from "./MatchQuiz";

const BME_SOURCE_URL = "https://bme.buaa.edu.cn/zhaopinHr.aspx?catID=9&curID=713&subcatID=40";
const BME_TEACHERS_URL = "https://bme.buaa.edu.cn/teachers.aspx?catID=7";
const BME_SHI_TEACHERS_URL = "https://shi.buaa.edu.cn/xyjslb.jsp?id=1144&lang=zh_CN&st=0&urltype=tsites.CollegeTeacherList&wbtreeid=1001";
const BME_PHD_2026_URL = "https://bme.buaa.edu.cn/newsInfo.aspx?catID=13&curID=14729&subcatID=1027";
const MSE_PEOPLE_URL = "https://ygy.buaa.edu.cn/info/1022/3032.htm";
const MSE_DETAIL_URL = "https://ygy.buaa.edu.cn/szdw1/szryxx.htm";
const MSE_SHI_TEACHERS_URL = "https://shi.buaa.edu.cn/xyjslb.jsp?id=1189&lang=zh_CN&st=0&urltype=tsites.CollegeTeacherList&wbtreeid=1001";
const MSE_PHD_2026_URL = "https://ygy.buaa.edu.cn/info/1004/4492.htm";
const SHI_TEACHER_SEARCH_URL = "https://shi.buaa.edu.cn/jssy.jsp?urltype=tree.TreeTempUrl&wbtreeid=1004";
const noteTypeOptions = [
  "招生名额",
  "研究方向",
  "联系方式",
  "课题组安排",
  "培养方式",
  "论文/项目",
  "就业/实习",
  "其他线索",
];
const relationOptions = ["在读/已毕业学生", "同组或同院同学", "公开信息整理", "其他知情来源"];

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
    sourceUrl: "https://ygy.buaa.edu.cn/info/1087/4350.htm",
  },
  唐振超: {
    title: "副教授、博士生导师",
    email: "tangzhenchao@buaa.edu.cn",
    directions: ["新一代医学成像设备研制", "医学影像大模型", "医学人工智能", "医学影像大数据挖掘"],
    sourceUrl: "https://ygy.buaa.edu.cn/info/1156/3429.htm",
  },
  高明: {
    title: "讲师、医师、硕士生导师、博士生导师",
    email: "gming@buaa.edu.cn",
    directions: ["人体体液蛋白标志物超灵敏检测系统构建", "体外诊断检验试剂研发"],
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

function cleanText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t\r\n]+/g, " ")
    .replace(/ ?([，。；：、]) ?/g, "$1")
    .trim();
}

function uniqueItems(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function sortZhText(a, b) {
  return a.localeCompare(b, "zh-Hans-CN");
}

const mseDirectionThemes = [
  {
    code: "M1",
    name: "医学影像与智能诊断",
    description: "按医工学院官网公开方向中的医学影像、病理分析、医学 AI 与智能诊断相关标签聚类。",
    matchers: [/影像|成像|图像|病理|拉曼|光声|高光谱|内窥镜|人工智能|机器学习|深度学习|大模型|智能体|大数据|诊断/u],
  },
  {
    code: "M2",
    name: "生物材料与组织修复",
    description: "聚焦生物材料、组织工程、再生修复、外泌体与植介入材料等方向。",
    matchers: [/材料|组织工程|再生|修复|外泌体|支架|植介入|角膜|骨|细胞与微生物治疗/u],
  },
  {
    code: "M3",
    name: "生物力学与康复辅具",
    description: "覆盖生物力学、康复工程、柔性可穿戴辅具和人因相关研究。",
    matchers: [/生物力学|计算生物力学|血流动力学|康复|辅具|机器人|人因|工效|抗荷服|训练伤/u],
  },
  {
    code: "M4",
    name: "生物传感与医疗器械",
    description: "覆盖生物传感器、芯片、体外诊断、柔性电子与医疗器械研制等方向。",
    matchers: [/传感|芯片|体外诊断|柔性电子|医疗器械|仪器|微机电|检测系统|药物递送/u],
  },
  {
    code: "M5",
    name: "分子医学与精准治疗",
    description: "聚焦分子影像、基因组学、蛋白质组学、精准诊疗与肿瘤治疗等主题。",
    matchers: [/分子|基因|蛋白|组学|精准|肿瘤|癌症|病原菌|耐药|生物信息学|诊疗/u],
  },
  {
    code: "M6",
    name: "空天医学与特种医学",
    description: "把航空航天医学、失重生理、智能供氧与特种医学交叉方向集中展示。",
    matchers: [/航空|航天|失重|供氧|特种医学|空天|飞行员/u],
  },
];

const mentorLabViewOptions = [
  { id: "all", label: "全部候选", description: "保留当前画像下的完整排序。" },
  { id: "priority", label: "优先核验", description: "优先看高度相关或已具备直接联系条件的导师。" },
  { id: "contact", label: "只看可联系", description: "只保留已有公开邮箱、适合尽快联系的候选。" },
  { id: "shortlist", label: "我的待联系", description: "只看当前浏览器里已经收藏的候选。" },
];

function uniqueAdmissions(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item?.label ?? ""}|${item?.sourceUrl ?? ""}`;
    if (!item || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const advisorTagSet = new Set(["硕士生导师", "博士生导师", "兼职导师"]);
const topicStopPatterns = [
  /^(?:学生信息|暂无内容|个人信息|个人信息职称|职称|背景颜色|生物|材料|成像|传感|分子|国家级领军人才|科技部重点领域创新团队带头人|结题均获优秀|结题优秀)$/u,
  /var\s+_tsites|ImageScale|点赞|访客|点击次数|发布时间|window\.location|jQuery|qrcode|canvas|codeInfo/u,
  /近\d+年承担|近五年承担|在研|主持|资助金额|万元|经费|竞赛|挑战杯|擂主|揭榜挂帅/u,
  /获.*奖|专著|教程|专利|审稿人|通讯作者|第一作者|第一完成人|编委|学报/u,
  /团队介绍|代表性|科研方向|医工交叉领域|生命保障|人才计划|卓越创新计划|医院/u,
  /教育背景|教育经历|学习经历|工作经历|教育与/u,
  /我的研究方向是|还没有行之有效|并不透彻|有望实现|能够替代|具有针对性的|具备融合核心|从分子|以及$/u,
  /Progress in Materials Science|AI4science|VLA基础大模型/u,
];
const topicPrefixPattern = /^(?:长期从事|聚焦于|从事|致力于|重点(?:开展|研究)|主要(?:开展|研究)|侧重|涵盖|围绕|服务|促进|广泛运用|探寻及评估|运用|以解决|以进行|尤其关注|涉及|也涉及|系统地研究|鉴定|充分利用|最大限度地惠及|通过|采用|利用|建立|开展|探索|构建|创建|发明|即|从|对|将|使|让)/u;
const topicSuffixPatterns = [
  /等方向$/u,
  /等领域$/u,
  /等研究$/u,
  /等$/u,
  /的基础研究$/u,
  /的研究$/u,
  /研究$/u,
  /及其应用$/u,
  /及应用$/u,
  /与应用$/u,
  /相关设备研制$/u,
  /关键技术研究与成果转化应用$/u,
  /临床应用和产业转化工作$/u,
  /的开发$/u,
  /的设计及表征$/u,
  /的设计与表征$/u,
  /的设计$/u,
];
const topicCanonicalRules = [
  [/纳米电穿孔/i, "纳米电穿孔"],
  [/磁粒子成像|MPI/i, "磁粒子成像"],
  [/医学影像大模型/u, "医学影像大模型"],
  [/医学影像人工智能|智能医学成像/u, "医学影像人工智能"],
  [/医学图像处理与可视化智能算法/u, "医学图像处理"],
  [/医学图像和信号处理/u, "医学图像与信号处理"],
  [/医疗大数据分析与智能决策算法/u, "医疗大数据分析"],
  [/专病垂直基础模型和智能体应用/u, "医学智能体应用"],
  [/多模态分子影像/u, "多模态分子影像"],
  [/医学图像分析/u, "医学图像分析"],
  [/深度学习/u, "深度学习"],
  [/机器学习/u, "机器学习"],
  [/人工智能/u, "人工智能"],
  [/认知神经科学/u, "认知神经科学"],
  [/脑机接口/u, "脑机接口"],
  [/类脑计算/u, "类脑计算"],
  [/脑电生理/u, "脑电生理"],
  [/神经调控/u, "神经调控"],
  [/康复医学工程/u, "康复医学工程"],
  [/康复工程/u, "康复工程"],
  [/生物力学/u, "生物力学"],
  [/生物机械/u, "生物机械"],
  [/结构仿生/u, "结构仿生"],
  [/计算生物力学/u, "计算生物力学"],
  [/低熔点金属生物医用材料/u, "低熔点金属生物医用材料"],
  [/柔性电子/u, "柔性电子"],
  [/肿瘤治疗/u, "肿瘤治疗"],
  [/骨修复/u, "骨修复"],
  [/合成生物学与精准医疗/u, "合成生物学与精准医疗"],
  [/蛋白质组学与生物医学大数据/u, "蛋白质组学"],
  [/生物医学大数据/u, "生物医学大数据"],
  [/生物医学光子学/u, "生物医学光子学"],
  [/医用光子学/u, "医用光子学"],
  [/拉曼光谱/u, "拉曼光谱"],
  [/光声成像/u, "光声成像"],
  [/高光谱成像/u, "高光谱成像"],
  [/医用光学仪器/u, "医用光学仪器"],
  [/超结构设计/u, "超结构设计"],
  [/智能生物材料/u, "智能生物材料"],
  [/植介入医疗器械/u, "植介入医疗器械"],
  [/心血管支架/u, "心血管支架"],
  [/飞行员的抗荷服设计/u, "抗荷服设计"],
  [/航天员失重性骨质疏松/u, "失重性骨质疏松"],
  [/组织工程/u, "组织工程"],
  [/血流动力学/u, "血流动力学"],
  [/器官芯片/u, "器官芯片"],
  [/生物传感器/u, "生物传感器"],
  [/体外诊断检验试剂/u, "体外诊断检验试剂"],
  [/药物递送/u, "药物递送"],
  [/精准诊疗/u, "精准诊疗"],
  [/数字病理/u, "数字病理"],
  [/基因组学/u, "基因组学"],
  [/生物信息学/u, "生物信息学"],
  [/外泌体/u, "外泌体"],
  [/光学内窥镜/u, "光学内窥镜"],
  [/脑功能成像/u, "脑功能成像"],
  [/纳米探针/u, "纳米探针"],
  [/医疗器械(?:与装备)?/u, "医疗器械"],
  [/干细胞的力学生物学/u, "干细胞力学生物学"],
  [/生物材料的细胞学行为/u, "生物材料细胞学行为"],
  [/纳米材料的生物学效应/u, "纳米材料生物学效应"],
  [/人体体液蛋白标志物超灵敏检测系统构建/u, "体液蛋白标志物检测"],
  [/促角膜再生修复的药物及生物材料研发/u, "角膜再生修复"],
  [/体外诊断检验试剂的研发与验证/u, "体外诊断检验试剂"],
  [/癌症的诊疗决策/u, "癌症诊疗"],
  [/神经系统疾病的致病机制及防治策略/u, "神经系统疾病防治"],
  [/体细胞突变的发生/u, "体细胞突变"],
  [/病原菌耐药组以及泛基因组/u, "病原菌耐药与泛基因组"],
  [/细胞与微生物治疗的转化应用/u, "细胞与微生物治疗"],
  [/智能药物递送/u, "智能药物递送"],
  [/无标记分子成像/u, "无标记分子成像"],
  [/工程化外泌体/u, "工程化外泌体"],
  [/微机电系统传感芯片/u, "微机电系统传感芯片"],
  [/柔性可穿戴康复辅具/u, "柔性可穿戴康复辅具"],
  [/柔性穿戴康复机器人/u, "柔性穿戴康复机器人"],
  [/飞行员的训练伤防护及救治/u, "飞行员训练伤防护"],
  [/航空与航天医学/u, "航空航天医学"],
  [/智能供氧技术/u, "智能供氧技术"],
  [/针灸作用机制/u, "针灸作用机制"],
  [/针灸现代化装备/u, "针灸现代化装备"],
];
const topicKeywordPattern = /生物|医学|影像|成像|图像|信号|材料|力学|工程|器械|芯片|传感|光学|光子|光谱|超声|激光|电生理|脑机|脑|神经|康复|病理|药理|细胞|组织|蛋白|基因|分子|纳米|支架|探针|组学|算法|智能|学习|数据|诊疗|诊断|治疗|修复|递送|仿生|供氧|失重|工效|人因|航天|航空|病毒|微生物|干细胞|再生|金属|电子|内窥镜|骨|肿瘤|血管|心血管|拉曼|多模态/u;

function isAdvisorTag(tag) {
  return advisorTagSet.has(tag);
}

function isValidTopicToken(token) {
  if (!token) return false;
  if (!/[\u4e00-\u9fa5]/u.test(token)) return false;
  if (token.length < 2 || token.length > 18) return false;
  if (/[A-Za-z]/u.test(token)) return false;
  if (/\s/u.test(token)) return false;
  if (/[()（）]/u.test(token)) return false;
  if (/[《》【】#*[\]<>]/u.test(token)) return false;
  if (/[.:]/u.test(token)) return false;
  if (/[、，；]/u.test(token)) return false;
  if (/\d{4}[.-]\d{1,2}|\d{1,2}[.-]\d{4}|\d{3,}/u.test(token)) return false;
  if (topicStopPatterns.some((pattern) => pattern.test(token))) return false;
  if (!topicKeywordPattern.test(token)) return false;
  return true;
}

function canonicalizeTopicToken(rawToken) {
  let token = cleanText(rawToken)
    .replace(/^[([{（【]?\d+[)\]】.、）]?\s*/u, "")
    .replace(/^[([{（【]?[一二三四五六七八九十]+[)\]】、）]?\s*/u, "")
    .replace(/^Ø+\s*/u, "")
    .replace(/^[•·▪◦]\s*/u, "")
    .replace(/[“”"]/gu, "")
    .replace(/\((?:[A-Za-z0-9\-./ ]{2,40})\)/gu, "")
    .replace(/（(?:[A-Za-z0-9\-./ ]{2,40})）/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
  if (!token) return undefined;
  if (topicStopPatterns.some((pattern) => pattern.test(token))) return undefined;

  token = token
    .replace(topicPrefixPattern, "")
    .replace(/^主要从/u, "")
    .replace(/^其中以/u, "")
    .replace(/^其中一项/u, "")
    .replace(/^主要从两个层面开展/u, "")
    .replace(/^内容主要包括以下五方面/u, "")
    .replace(/^尤其是/u, "")
    .trim();

  topicSuffixPatterns.forEach((pattern) => {
    token = token.replace(pattern, "").trim();
  });
  token = token.replace(/[；。]$/u, "").trim();

  for (const [pattern, replacement] of topicCanonicalRules) {
    if (pattern.test(token)) return replacement;
  }

  if (/^[（(]/u.test(token) || /[）)]$/u.test(token)) return undefined;
  if (/[:：]/u.test(token)) return undefined;
  if (topicStopPatterns.some((pattern) => pattern.test(token))) return undefined;
  return isValidTopicToken(token) ? token : undefined;
}

function splitTopicFragments(value) {
  const source = cleanText(value)
    .replace(/[“”"]/gu, "")
    .replace(/\((?:[A-Za-z0-9\-./ ]{2,40})\)/gu, "")
    .replace(/（(?:[A-Za-z0-9\-./ ]{2,40})）/gu, "")
    .replace(/[/:：]/gu, "、")
    .replace(/\s{2,}/gu, "、");
  return source
    .split(/[、，；]/u)
    .flatMap((part) => part.split(/\s+/u))
    .map((part) => part.trim())
    .filter(Boolean);
}

function collectTopicTags(items) {
  const topics = [];
  for (const item of items) {
    const fragments = splitTopicFragments(item);
    fragments.forEach((fragment) => {
      const token = canonicalizeTopicToken(fragment);
      if (token) topics.push(token);
    });
    if (!/[、，；]/u.test(String(item ?? ""))) {
      const wholeToken = canonicalizeTopicToken(item);
      if (wholeToken) topics.push(wholeToken);
    }
  }
  return uniqueItems(topics).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function getTagTone(tag) {
  if (tag.includes("博士生导师")) return "blue";
  if (tag.includes("硕士生导师")) return "green";
  if (tag.includes("兼职导师")) return "amber";
  return "neutral";
}

function getSupplementalDetail(schoolKey, name) {
  const detail = supervisorDetails[schoolKey]?.[name] ?? {};
  const admission = supervisorDetails.admissions?.[name] ?? {};
  return {
    ...detail,
    email: detail.email ?? admission.email,
    directions: uniqueItems(detail.directions ?? []),
    tags: uniqueItems([...(detail.tags ?? []), ...(admission.tags ?? [])]),
    admissions: uniqueAdmissions([...(detail.admissions ?? []), ...(admission.admissions ?? [])]),
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
          schoolKey: "bme",
          school: "生物与医学工程学院",
          name,
          title: detail.title ?? "指导教师",
          directions: [],
          groups: new Set(),
          tags: new Set(["硕士生导师", ...(detail.tags ?? []).filter(isAdvisorTag)]),
          topicTags: new Set(),
          email: detail.email,
          researchSummary: detail.researchSummary,
          admissions: detail.admissions ?? [],
          source: "生物与医学工程学院硕士研究生培养方向设置及指导教师对照表",
          sourceUrl: BME_SOURCE_URL,
          officialUrl: detail.officialUrl,
          profileUrl: detail.profileUrl ?? detail.officialUrl,
          teacherHomeUrl: detail.teacherHomeUrl,
          profileSourceUrl: detail.sourceUrl ?? detail.officialUrl,
        });
      }

      const teacher = byName.get(name);
      teacher.directions.push(`${area.code} ${area.name}`);
      teacher.groups.add(area.group);
      if (partTime) teacher.tags.add("兼职导师");
      collectTopicTags([area.name, ...(detail.directions ?? [])]).forEach((tag) => teacher.topicTags.add(tag));
    });
  });

  return Array.from(byName.values()).map((teacher) => ({
    ...teacher,
    groups: Array.from(teacher.groups),
    categories: Array.from(teacher.topicTags).sort((a, b) => a.localeCompare(b, "zh-Hans-CN")),
    tags: Array.from(teacher.tags),
    topicTags: Array.from(teacher.topicTags).sort((a, b) => a.localeCompare(b, "zh-Hans-CN")),
    admissions: teacher.admissions ?? [],
  }));
}

function buildMseSupervisors() {
  return msePeople.map(([name, profileUrl]) => {
    const detail = mseKnownDetails[name] ?? {};
    const supplemental = getSupplementalDetail("mse", name);
    const directions = uniqueItems([
      ...(detail.directions ?? []),
      ...(supplemental.directions ?? []),
    ]);
    const topicTags = collectTopicTags(directions);
    return {
      id: `mse-${name}`,
      schoolKey: "mse",
      school: "医学科学与工程学院",
      name,
      title: supplemental.title ?? detail.title ?? "师资人员",
      directions,
      groups: ["医学科学与工程学院师资"],
      categories: topicTags,
      tags: uniqueItems([...(detail.tags ?? []), ...(supplemental.tags ?? [])].filter(isAdvisorTag)),
      topicTags,
      email: supplemental.email ?? detail.email,
      researchSummary: supplemental.researchSummary,
      admissions: supplemental.admissions ?? [],
      source: "医学科学与工程学院人员列表及师资人员详细索引",
      sourceUrl: supplemental.sourceUrl ?? supplemental.officialUrl ?? detail.sourceUrl ?? profileUrl,
      officialUrl: supplemental.officialUrl,
      profileUrl: supplemental.profileUrl ?? supplemental.officialUrl ?? profileUrl,
      teacherHomeUrl: supplemental.teacherHomeUrl,
      profileSourceUrl: supplemental.sourceUrl ?? supplemental.officialUrl ?? profileUrl,
    };
  });
}

const supervisors = [...buildBmeSupervisors(), ...buildMseSupervisors()];
const schools = ["全部", ...Array.from(new Set(supervisors.map((item) => item.school)))];
const categories = [
  "全部",
  ...Array.from(new Set(supervisors.flatMap((item) => item.categories))).sort((a, b) => a.localeCompare(b, "zh-Hans-CN")),
];
const mentorLabSchoolOptions = ["不限学院", ...schools.filter((school) => school !== "全部")];
const mentorLabTopicStats = Array.from(
  supervisors.reduce((map, item) => {
    item.topicTags.forEach((topic) => {
      const current = map.get(topic) ?? { topic, total: 0, schools: new Set() };
      current.total += 1;
      current.schools.add(item.school);
      map.set(topic, current);
    });
    return map;
  }, new Map()).values(),
)
  .map((entry) => ({
    topic: entry.topic,
    total: entry.total,
    schoolCount: entry.schools.size,
    schools: Array.from(entry.schools),
  }))
  .sort((a, b) => b.total - a.total || b.schoolCount - a.schoolCount || a.topic.localeCompare(b.topic, "zh-Hans-CN"));
const mseDirectionAreas = (() => {
  const mseSupervisors = supervisors.filter((item) => item.schoolKey === "mse");
  const matchedNames = new Set();
  const areas = mseDirectionThemes
    .map((theme) => {
      const mentors = uniqueItems(
        mseSupervisors
          .filter((item) => {
            const haystack = [
              ...(item.topicTags ?? []),
              ...item.directions,
              item.researchSummary ?? "",
            ].join(" ");
            const isMatch = theme.matchers.some((pattern) => pattern.test(haystack));
            if (isMatch) {
              matchedNames.add(item.name);
            }
            return isMatch;
          })
          .map((item) => item.name),
      ).sort(sortZhText);

      return {
        code: theme.code,
        group: "医工学院研究方向补充",
        name: theme.name,
        mentors,
        countLabel: "师资",
        badges: [
          { label: "官网研究方向聚类", tone: "blue" },
          { label: "非官方培养方案表", tone: "slate" },
        ],
        description: theme.description,
      };
    })
    .filter((area) => area.mentors.length > 0);

  const unmatchedMentors = mseSupervisors
    .filter((item) => !matchedNames.has(item.name))
    .map((item) => item.name)
    .sort(sortZhText);

  if (unmatchedMentors.length > 0) {
    areas.push({
      code: "M7",
      group: "医工学院研究方向补充",
      name: "其他医工交叉方向",
      mentors: unmatchedMentors,
      countLabel: "师资",
      badges: [
        { label: "官网研究方向聚类", tone: "blue" },
        { label: "待继续细分", tone: "outline" },
      ],
      description: "用于承接当前公开方向里暂不适合并入前述主题的师资，避免静默遗漏。",
    });
  }

  return areas;
})();
const supervisorIds = new Set(supervisors.map((item) => item.id));
const mentorLabDefaultProfile = {
  topics: [],
  school: "不限学院",
  requireEmail: false,
  preferAdmissions: false,
  preferEvidence: false,
};
const MENTOR_LAB_PROFILE_KEY = "buaa-mentor-lab-profile";
const MENTOR_LAB_COMPARE_KEY = "buaa-mentor-lab-compare";
const MENTOR_LAB_SHORTLIST_KEY = "buaa-mentor-lab-shortlist";
const matchTierRank = { high: 3, medium: 2, low: 1 };

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
    title: "北航生医工教师主页",
    desc: "北航教师主页系统中的生物与医学工程学院教师列表，优先用于精确个人主页入口。",
    url: BME_SHI_TEACHERS_URL,
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
    title: "北航医学院教师主页",
    desc: "北航教师主页系统中的医学院教师列表，用于补充医工学院师资个人主页入口。",
    url: MSE_SHI_TEACHERS_URL,
  },
  {
    title: "2026博士招生方案",
    desc: "医学科学与工程学院发布的医工交叉学科群 2026 年博士研究生招生工作方案。",
    url: MSE_PHD_2026_URL,
  },
  {
    title: "北航教师主页索引",
    desc: "按姓名检索北航教师主页系统；同名教师和跨院任职需进一步核验。",
    url: SHI_TEACHER_SEARCH_URL,
  },
];

function getDirectionItems(item) {
  return item.topicTags?.length ? item.topicTags : (item.directions.length ? item.directions : item.categories);
}

function getApprovedNotes(item) {
  return communityNotes[item.schoolKey]?.[item.name] ?? [];
}

function getPendingKey(item) {
  return `${item.schoolKey}:${item.name}`;
}

function safeReadLocalJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function safeReadPendingSubmissions() {
  const parsed = safeReadLocalJson("buaa-pending-community-notes", []);
  return Array.isArray(parsed) ? parsed : [];
}

function writePendingSubmissions(items) {
  writeLocalJson("buaa-pending-community-notes", items);
}

async function copyText(value) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  return false;
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

function isBuaaTeacherHome(url) {
  return Boolean(url?.includes("shi.buaa.edu.cn"));
}

function getProfileLinkLabel(url) {
  if (!url) return "教师主页";
  if (isBuaaTeacherHome(url)) return "北航教师主页";
  if (url.includes("bme.buaa.edu.cn") || url.includes("ygy.buaa.edu.cn")) return "学院教师详情页";
  return "教师主页";
}

function getEvidenceItems(item) {
  return [
    { label: "学院官网来源", active: Boolean(item.officialUrl ?? item.sourceUrl) },
    { label: "北航教师主页", active: isBuaaTeacherHome(item.teacherHomeUrl ?? item.profileUrl) },
    { label: "公开方向索引", active: getDirectionItems(item).length > 0 },
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

function getMatchTierLabel(tier) {
  if (tier === "high") return "高度相关";
  if (tier === "medium") return "可继续看";
  return "信息待补";
}

function getMatchTierTone(tier) {
  if (tier === "high") return "green";
  if (tier === "medium") return "blue";
  return "amber";
}

function getActionBucketLabel(bucket) {
  if (bucket === "contact") return "可立即联系";
  if (bucket === "review") return "建议先看主页";
  return "建议先补证据";
}

function getActionBucketTone(bucket) {
  if (bucket === "contact") return "green";
  if (bucket === "review") return "blue";
  return "amber";
}

function getActionBucketHint(bucket) {
  if (bucket === "contact") return "方向已命中且有公开邮箱，可以先读主页摘要后再礼貌联系。";
  if (bucket === "review") return "已有兴趣命中，但更适合先核对主页和招生通知，再决定是否联系。";
  return "先观察公开资料完整度，必要时补查主页、论文和课题组动态。";
}

function normalizeMentorLabProfile(raw) {
  return {
    topics: Array.isArray(raw?.topics)
      ? uniqueItems(raw.topics.filter((topic) => categories.includes(topic))).slice(0, 5)
      : [],
    school: mentorLabSchoolOptions.includes(raw?.school) ? raw.school : mentorLabDefaultProfile.school,
    requireEmail: Boolean(raw?.requireEmail),
    preferAdmissions: Boolean(raw?.preferAdmissions),
    preferEvidence: Boolean(raw?.preferEvidence),
  };
}

function safeReadMentorLabProfile() {
  return normalizeMentorLabProfile(safeReadLocalJson(MENTOR_LAB_PROFILE_KEY, mentorLabDefaultProfile));
}

function safeReadMentorLabIds(key) {
  const parsed = safeReadLocalJson(key, []);
  return Array.isArray(parsed) ? uniqueItems(parsed.filter((id) => supervisorIds.has(id))) : [];
}

function getMatchDetails(item, selectedTopics) {
  const directions = getDirectionItems(item);
  const topicHits = selectedTopics.filter((topic) => item.topicTags.includes(topic));
  const officialDirectionHits = selectedTopics.filter(
    (topic) => !topicHits.includes(topic) && directions.some((direction) => direction.includes(topic)),
  );

  return {
    topicHits,
    officialDirectionHits,
    interestHits: uniqueItems([...topicHits, ...officialDirectionHits]),
  };
}

function getMentorLabMatchTier(item, matchDetails, evidenceSummary, profile) {
  const topicHitCount = matchDetails.topicHits.length;
  const interestHitCount = matchDetails.interestHits.length;
  const hasAdmissions = Boolean(item.admissions?.length);

  if (
    topicHitCount >= 3
    || (topicHitCount >= 2 && (item.email || hasAdmissions || evidenceSummary.count >= 5))
    || (profile.preferAdmissions && topicHitCount >= 1 && hasAdmissions)
    || (profile.preferEvidence && topicHitCount >= 1 && evidenceSummary.count >= 6)
  ) {
    return "high";
  }

  if (interestHitCount >= 1) return "medium";
  return "low";
}

function buildMentorLabEntry(item, profile) {
  const evidence = getEvidenceSummary(item);
  const matchDetails = getMatchDetails(item, profile.topics);
  const matchTier = getMentorLabMatchTier(item, matchDetails, evidence, profile);
  const matchReasons = [];

  if (matchDetails.topicHits.length > 0) {
    matchReasons.push(`命中 ${matchDetails.topicHits.length} 个兴趣标签`);
  }
  if (matchDetails.officialDirectionHits.length > 0) {
    matchReasons.push(`官方方向出现 ${matchDetails.officialDirectionHits.join("、")}`);
  }
  if (item.email) {
    matchReasons.push("有公开邮箱");
  }
  if (item.admissions?.length) {
    matchReasons.push("有 2026 招生线索");
  }
  if (evidence.count >= 6) {
    matchReasons.push("资料较完整");
  } else if (evidence.count >= 4) {
    matchReasons.push("可继续核验");
  }
  if ((item.profileUrl || item.teacherHomeUrl) && matchReasons.length < 4) {
    matchReasons.push("有主页入口");
  }

  const hasInterestHit = matchDetails.interestHits.length > 0;
  const hasProfileLead = Boolean(item.profileUrl || item.teacherHomeUrl || item.admissions?.length);
  let actionBucket = "watch";
  if (hasInterestHit && item.email) {
    actionBucket = "contact";
  } else if (hasInterestHit && hasProfileLead) {
    actionBucket = "review";
  }

  return {
    item,
    evidence,
    matchDetails,
    matchReasons: uniqueItems(matchReasons).slice(0, 4),
    matchTier,
    actionBucket,
  };
}

function compareMentorLabEntries(a, b, profile) {
  return (
    matchTierRank[b.matchTier] - matchTierRank[a.matchTier]
    || b.matchDetails.topicHits.length - a.matchDetails.topicHits.length
    || b.matchDetails.officialDirectionHits.length - a.matchDetails.officialDirectionHits.length
    || Number(Boolean(b.item.email)) - Number(Boolean(a.item.email))
    || (profile.preferAdmissions ? Number(Boolean(b.item.admissions?.length)) - Number(Boolean(a.item.admissions?.length)) : 0)
    || (profile.preferEvidence ? b.evidence.count - a.evidence.count : 0)
    || Number(Boolean(b.item.admissions?.length)) - Number(Boolean(a.item.admissions?.length))
    || b.evidence.count - a.evidence.count
    || a.item.school.localeCompare(b.item.school, "zh-Hans-CN")
    || a.item.name.localeCompare(b.item.name, "zh-Hans-CN")
  );
}

function getStudentClues(item) {
  const directions = getDirectionItems(item);
  const clues = [];

  if (item.school === "生物与医学工程学院") {
    clues.push("适合先按官方培养方向筛选，再逐一核对导师主页和当年招生目录。");
  } else {
    clues.push("适合从医工学院官网个人页进入，重点核对具体课题组方向。");
  }

  const primaryProfileUrl = item.officialUrl ?? item.profileUrl;
  if (primaryProfileUrl) {
    clues.push(`已整理到${getProfileLinkLabel(primaryProfileUrl)}，建议优先从主页核对职称、邮箱、课题组和论文项目。`);
  } else {
    clues.push("暂未整理到精确个人主页，联系前建议从学院师资页或北航教师主页检索复核。");
  }

  if (directions.length >= 4) {
    clues.push("公开方向覆盖较多，适合方向尚未完全锁定、想比较交叉方向的同学。");
  } else if (directions.length > 1) {
    clues.push("公开方向较集中，可结合论文和课题组网页判断匹配度。");
  } else {
    clues.push("公开方向仍偏少，联系前建议补充检索个人主页、论文和课题组新闻。");
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

function CommunityNotesPanel({ item, pendingCount, onSubmitNote }) {
  const approvedNotes = getApprovedNotes(item);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: noteTypeOptions[0],
    relation: relationOptions[0],
    content: "",
    sourceUrl: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = form.content.trim().length >= 12;

  function updateField(field, value) {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmitNote(item, form);
    setForm({
      type: noteTypeOptions[0],
      relation: relationOptions[0],
      content: "",
      sourceUrl: "",
      contact: "",
    });
    setSubmitted(true);
    setShowForm(false);
  }

  return (
    <div className="detail-panel community-panel">
      <div className="community-panel__header">
        <div>
          <span className="detail-label">学生补充信息</span>
          <p className="detail-note">只展示已审核条目；新提交内容会先进入本机待审核队列，不会自动公开。</p>
        </div>
        <button type="button" className="link-button" onClick={() => setShowForm((value) => !value)}>
          <MessageSquare aria-hidden="true" />
          补充信息
        </button>
      </div>

      {approvedNotes.length > 0 ? (
        <div className="community-note-list">
          {approvedNotes.map((note) => (
            <article key={`${note.type}-${note.updatedAt}-${note.summary}`} className="community-note">
              <div>
                <Chip tone="green">已审核</Chip>
                <Chip>{note.type}</Chip>
                {note.updatedAt && <span>{note.updatedAt}</span>}
              </div>
              <p>{note.summary}</p>
              {note.sourceUrl && (
                <a href={note.sourceUrl} target="_blank" rel="noreferrer">
                  查看来源
                  <ArrowUpRight aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="detail-copy">暂无已审核学生补充。</p>
      )}

      {pendingCount > 0 && <p className="detail-note">本机已有 {pendingCount} 条关于该导师的待审核补充，可在“来源与建议”页复制审核。</p>}
      {submitted && <p className="detail-note">已加入本机待审核队列，审核通过前不会展示给其他访问者。</p>}

      {showForm && (
        <form className="community-form" onSubmit={handleSubmit}>
          <div className="community-form__grid">
            <label className="field">
              <span>补充类型</span>
              <select value={form.type} onChange={(event) => updateField("type", event.target.value)}>
                {noteTypeOptions.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="field">
              <span>来源关系</span>
              <select value={form.relation} onChange={(event) => updateField("relation", event.target.value)}>
                {relationOptions.map((relation) => <option key={relation}>{relation}</option>)}
              </select>
            </label>
          </div>
          <label className="field">
            <span>补充内容</span>
            <textarea
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="写可核验、具体的信息，例如招生名额、研究方向变化、公开邮箱、课题组页面或当年通知线索。"
              rows={4}
            />
          </label>
          <div className="community-form__grid">
            <label className="field">
              <span>来源链接</span>
              <input
                value={form.sourceUrl}
                onChange={(event) => updateField("sourceUrl", event.target.value)}
                placeholder="官网/通知/论文/课题组页面链接，可留空"
              />
            </label>
            <label className="field">
              <span>联系信息</span>
              <input
                value={form.contact}
                onChange={(event) => updateField("contact", event.target.value)}
                placeholder="可选，仅供审核联系，不公开展示"
              />
            </label>
          </div>
          <div className="community-form__actions">
            <p>{canSubmit ? "提交后进入本机待审核队列。" : "至少填写 12 个字的具体内容。"}</p>
            <button type="submit" className="link-button link-button--strong" disabled={!canSubmit}>
              <Send aria-hidden="true" />
              加入待审核
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function PendingReviewPanel({ pendingSubmissions, onClearPending }) {
  const [copyState, setCopyState] = useState("");
  const exportText = JSON.stringify(pendingSubmissions, null, 2);

  async function handleCopy() {
    const copied = await copyText(exportText);
    setCopyState(copied ? "已复制待审核 JSON" : "当前浏览器不支持自动复制，请手动选择复制");
  }

  return (
    <div className="review-panel">
      <div className="review-panel__header">
        <div>
          <MessageSquare aria-hidden="true" />
          <h3>待审核学生补充</h3>
        </div>
        <Chip tone={pendingSubmissions.length ? "amber" : "green"}>{pendingSubmissions.length} 条待审</Chip>
      </div>
      <p>
        投稿先保存在当前浏览器本地。审核通过后，把可信条目整理到 <code>src/communityNotes.js</code>，前台才会展示。
      </p>
      <textarea className="review-export" readOnly value={exportText} rows={pendingSubmissions.length ? 10 : 4} />
      <div className="review-panel__actions">
        <button type="button" className="link-button" onClick={handleCopy} disabled={!pendingSubmissions.length}>
          <Copy aria-hidden="true" />
          复制待审 JSON
        </button>
        <button type="button" className="link-button" onClick={onClearPending} disabled={!pendingSubmissions.length}>
          清空本机待审
        </button>
        {copyState && <span>{copyState}</span>}
      </div>
    </div>
  );
}

const SupervisorCard = memo(function SupervisorCard({ item, expanded, onToggle, pendingCount, onSubmitNote }) {
  const directions = getDirectionItems(item);
  const evidence = getEvidenceSummary(item);
  const progress = `${(evidence.count / evidence.total) * 100}%`;
  const advisorStatus = getAdvisorStatus(item);
  const advisorTags = item.tags.filter((tag) => tag === "硕士生导师" || tag === "博士生导师");
  const summaryTags = [...item.tags, ...(item.topicTags ?? []).slice(0, 3)];

  return (
    <article className="supervisor-card">
      <button type="button" className="supervisor-card__summary" onClick={() => onToggle(item.id)} aria-expanded={expanded}>
        <div className="supervisor-card__identity">
          <div className="avatar" aria-hidden="true">{item.name.slice(0, 1)}</div>
          <div className="supervisor-card__main">
            <div className="supervisor-card__headline">
              <h3>{item.name}</h3>
              <span>{item.title}</span>
            </div>
            <div className="supervisor-card__chips">
              <Chip tone={item.school === "医学科学与工程学院" ? "blue" : "green"}>{item.school}</Chip>
              {summaryTags.map((tag) => <Chip key={tag} tone={getTagTone(tag)}>{tag}</Chip>)}
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

      <div className={`supervisor-card__expand-wrapper${expanded ? ' supervisor-card__expand-wrapper--open' : ''}`}>
        <div className="supervisor-card__expand-inner">
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

          <CommunityNotesPanel item={item} pendingCount={pendingCount} onSubmitNote={onSubmitNote} />

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
            {item.teacherHomeUrl && item.teacherHomeUrl !== item.profileUrl && (
              <a className="link-button" href={item.teacherHomeUrl} target="_blank" rel="noreferrer">
                <UserRound aria-hidden="true" />
                北航教师主页
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
        </div>
      </div>
    </article>
  );
});

function DirectionCard({ area, style, onOpenMentor }) {
  const parsedMentors = area.mentors.map(parseMentor);
  const partTimeCount = parsedMentors.filter((mentor) => mentor.partTime).length;
  const badges = area.badges ?? [
    { label: "全量纳入", tone: "green" },
    ...(partTimeCount > 0 ? [{ label: `${partTimeCount} 位兼职导师`, tone: "amber" }] : []),
  ];

  return (
    <article className="direction-card" style={style}>
      <div className="direction-card__header">
        <div>
          <span>{area.group}</span>
          <h3>{area.code} {area.name}</h3>
        </div>
        <div className="direction-card__count">
          <strong>{parsedMentors.length}</strong>
          <span>{area.countLabel ?? "导师"}</span>
        </div>
      </div>
      <div className="direction-card__meta">
        {badges.map((badge) => <Chip key={`${area.code}-${badge.label}`} tone={badge.tone}>{badge.label}</Chip>)}
      </div>
      {area.description && <p className="direction-card__note">{area.description}</p>}
      <div className="mentor-cloud">
        {parsedMentors.map(({ name, partTime }) => (
          <button type="button" key={`${area.code}-${name}`} className={partTime ? "mentor-pill mentor-pill--part-time" : "mentor-pill"} onClick={() => onOpenMentor && onOpenMentor(name)}>
            {name}{partTime ? " · 兼职" : ""}
          </button>
        ))}
      </div>
    </article>
  );
}

function MentorLabResultCard({
  entry,
  isCompared,
  isShortlisted,
  onToggleCompare,
  onToggleShortlist,
  onOpenMentor,
}) {
  const directions = getDirectionItems(entry.item);
  const advisorTag = entry.item.tags.find(isAdvisorTag);
  const primaryDirection = getPrimaryDirection(entry.item);
  const nextStepLabel = entry.item.email ? "邮箱" : (entry.item.profileUrl || entry.item.teacherHomeUrl ? "主页" : "待补");

  return (
    <article className={`mentor-lab-card mentor-lab-card--${entry.matchTier}`}>
      <div className="mentor-lab-card__header">
        <div className="mentor-lab-card__identity">
          <div className="mentor-lab-card__headline">
            <h3>{entry.item.name}</h3>
            <span>{entry.item.title}</span>
          </div>
          <p className="mentor-lab-card__lead">{primaryDirection}</p>
          <div className="mentor-lab-card__chips">
            <Chip tone={entry.item.school === "医学科学与工程学院" ? "blue" : "green"}>{entry.item.school}</Chip>
            <Chip tone={getMatchTierTone(entry.matchTier)}>{getMatchTierLabel(entry.matchTier)}</Chip>
            <Chip tone={getActionBucketTone(entry.actionBucket)}>{getActionBucketLabel(entry.actionBucket)}</Chip>
            <Chip tone="slate">{entry.evidence.label}</Chip>
            {advisorTag && <Chip tone={getTagTone(advisorTag)}>{advisorTag}</Chip>}
            {isShortlisted && <Chip tone="amber">已加入待联系</Chip>}
          </div>
        </div>
        <div className="mentor-lab-card__stats">
          <div>
            <strong>{entry.matchDetails.interestHits.length}</strong>
            <span>兴趣命中</span>
          </div>
          <div>
            <strong>{directions.length}</strong>
            <span>公开方向</span>
          </div>
          <div>
            <strong>{entry.evidence.count}/{entry.evidence.total}</strong>
            <span>证据线索</span>
          </div>
          <div>
            <strong>{nextStepLabel}</strong>
            <span>下一步入口</span>
          </div>
        </div>
      </div>

      <div className="mentor-lab-card__body">
        <div>
          <span className="detail-label">推荐理由</span>
          <div className="chip-row">
            {entry.matchReasons.map((reason) => <Chip key={reason}>{reason}</Chip>)}
          </div>
        </div>
        <div>
          <span className="detail-label">命中兴趣</span>
          <div className="chip-row">
            {entry.matchDetails.interestHits.length > 0
              ? entry.matchDetails.interestHits.map((topic) => <Chip key={topic} tone="blue">{topic}</Chip>)
              : <p className="detail-copy">当前兴趣画像下暂无直接命中，适合留作补充观察。</p>}
          </div>
        </div>
        <div>
          <span className="detail-label">方向线索</span>
          <div className="chip-row">
            {directions.slice(0, 4).map((direction) => <Chip key={direction}>{direction}</Chip>)}
            {directions.length > 4 && <Chip tone="outline">+{directions.length - 4} 个方向</Chip>}
          </div>
        </div>
      </div>

      <div className="mentor-lab-card__actions">
        <button type="button" className="link-button link-button--strong" onClick={() => onOpenMentor(entry.item)}>
          在索引中查看
        </button>
        <button type="button" className="link-button" onClick={() => onToggleCompare(entry.item.id)}>
          {isCompared ? "移出对比台" : "加入对比台"}
        </button>
        <button type="button" className="link-button" onClick={() => onToggleShortlist(entry.item.id)}>
          {isShortlisted ? "移出待联系" : "加入待联系"}
        </button>
        {entry.item.email && (
          <a className="link-button" href={`mailto:${entry.item.email}`}>
            <Mail aria-hidden="true" />
            联系邮箱
          </a>
        )}
      </div>
    </article>
  );
}

function MentorLabComparePanel({ items, diffOnly, onToggleDiff, onRemove }) {
  const rows = [
    { label: "学院", key: "school", getValue: (entry) => entry.item.school },
    { label: "职称", key: "title", getValue: (entry) => entry.item.title ?? "待查" },
    { label: "硕/博导标签", key: "advisor", getValue: (entry) => entry.item.tags.filter(isAdvisorTag).join("、") || "待查" },
    { label: "公开方向数量", key: "directionCount", getValue: (entry) => String(getDirectionItems(entry.item).length) },
    { label: "兴趣标签重合", key: "interestHits", getValue: (entry) => entry.matchDetails.interestHits.join("、") || "暂无直接命中" },
    { label: "公开邮箱", key: "email", getValue: (entry) => entry.item.email || "待查" },
    { label: "招生线索", key: "admissions", getValue: (entry) => (entry.item.admissions?.length ? `${entry.item.admissions.length} 条` : "暂无") },
    { label: "资料完整度", key: "evidence", getValue: (entry) => `${entry.evidence.label} (${entry.evidence.count}/${entry.evidence.total})` },
    { label: "主页入口", key: "profile", getValue: (entry) => entry.item.profileUrl || entry.item.teacherHomeUrl || entry.item.profileSourceUrl || "待查" },
  ];

  const visibleRows = diffOnly
    ? rows.filter((row) => new Set(items.map((entry) => row.getValue(entry))).size > 1)
    : rows;

  return (
    <div className="mentor-lab-panel">
      <div className="mentor-lab-panel__header">
        <div>
          <span className="eyebrow">导师对比台</span>
          <h3>最多同时比较 4 位导师</h3>
        </div>
        <button type="button" className={diffOnly ? "toggle-button toggle-button--active" : "toggle-button"} onClick={onToggleDiff}>
          仅显示差异项
        </button>
      </div>

      {items.length === 0 ? (
        <p className="detail-copy">从匹配候选卡中加入导师后，这里会展示学院、标签、邮箱和资料完整度对比。</p>
      ) : (
        <div className="compare-board">
          <div className="compare-board__cards">
            {items.map((entry) => (
              <article key={entry.item.id} className="compare-card">
                <div>
                  <h4>{entry.item.name}</h4>
                  <p>{entry.item.title}</p>
                </div>
                <div className="chip-row">
                  <Chip tone={getMatchTierTone(entry.matchTier)}>{getMatchTierLabel(entry.matchTier)}</Chip>
                  <Chip tone={getActionBucketTone(entry.actionBucket)}>{getActionBucketLabel(entry.actionBucket)}</Chip>
                </div>
                <button type="button" className="link-button" onClick={() => onRemove(entry.item.id)}>
                  移出
                </button>
              </article>
            ))}
          </div>

          <div className="compare-table">
            {visibleRows.map((row) => (
              <div key={row.key} className="compare-row">
                <span className="compare-row__label">{row.label}</span>
                <div className="compare-row__values">
                  {items.map((entry) => {
                    const value = row.getValue(entry);
                    const isUrl = row.key === "profile" && /^https?:\/\//.test(value);
                    return (
                      <div key={`${row.key}-${entry.item.id}`} className="compare-row__value">
                        {isUrl ? (
                          <a href={value} target="_blank" rel="noreferrer">
                            {getProfileLinkLabel(value)}
                            <ArrowUpRight aria-hidden="true" />
                          </a>
                        ) : (
                          <span>{value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {visibleRows.length === 0 && <p className="detail-copy">当前几位导师在主要指标上没有显著差异。</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function MentorLabSection({
  profile,
  allResults,
  results,
  view,
  overview,
  compareItems,
  shortlistItems,
  compareDiffOnly,
  message,
  onToggleTopic,
  onUpdateProfile,
  onResetProfile,
  onChangeView,
  onToggleCompare,
  onToggleShortlist,
  onOpenMentor,
  onToggleCompareDiff,
}) {
  const groupedResults = {
    high: results.filter((entry) => entry.matchTier === "high"),
    medium: results.filter((entry) => entry.matchTier === "medium"),
    low: results.filter((entry) => entry.matchTier === "low"),
  };
  const actionGroups = {
    contact: allResults.filter((entry) => entry.actionBucket === "contact").slice(0, 6),
    review: allResults.filter((entry) => entry.actionBucket === "review").slice(0, 6),
    watch: allResults.filter((entry) => entry.actionBucket === "watch").slice(0, 6),
  };
  const selectedTopicSet = new Set(profile.topics);
  const highlightedHeatTopics = mentorLabTopicStats.slice(0, 24);
  const currentView = mentorLabViewOptions.find((option) => option.id === view) ?? mentorLabViewOptions[0];
  const resultSections = [
    { key: "high", title: "高度相关", description: "方向命中较多，且资料线索相对完整。", items: groupedResults.high },
    { key: "medium", title: "可继续看", description: "已有兴趣重合，适合先进主页继续核验。", items: groupedResults.medium },
    { key: "low", title: "信息待补", description: "暂未命中明显兴趣点，或公开资料还不够完整。", items: groupedResults.low },
  ];

  return (
    <section className="content-section">
      <SectionTitle eyebrow="择导实验室" title="把公开数据变成可操作的选择工具">
        先选兴趣，再看匹配理由、横向对比和下一步动作，不做主观榜单，只帮你缩小需要认真核验的范围。
      </SectionTitle>

      <div className="mentor-lab-layout">
        <div className="mentor-lab-panel mentor-lab-panel--profile">
          <div className="mentor-lab-panel__header">
            <div>
              <span className="eyebrow">兴趣画像</span>
              <h3>先圈定 3-5 个研究兴趣</h3>
            </div>
            <button type="button" className="link-button" onClick={onResetProfile}>重置画像</button>
          </div>
          <p className="detail-copy">
            当前已选 {profile.topics.length} 个兴趣标签。建议控制在 3-5 个，能更快看出哪些导师值得优先核验。
          </p>
          <div className="mentor-lab-profile__controls">
            <label className="field">
              <span>学院偏好</span>
              <select value={profile.school} onChange={(event) => onUpdateProfile("school", event.target.value)}>
                {mentorLabSchoolOptions.map((school) => <option key={school}>{school}</option>)}
              </select>
            </label>
            <div className="mentor-lab-toggle-group">
              <button
                type="button"
                className={profile.requireEmail ? "toggle-button toggle-button--active" : "toggle-button"}
                onClick={() => onUpdateProfile("requireEmail", !profile.requireEmail)}
              >
                只看有公开邮箱
              </button>
              <button
                type="button"
                className={profile.preferAdmissions ? "toggle-button toggle-button--active" : "toggle-button"}
                onClick={() => onUpdateProfile("preferAdmissions", !profile.preferAdmissions)}
              >
                优先有招生线索
              </button>
              <button
                type="button"
                className={profile.preferEvidence ? "toggle-button toggle-button--active" : "toggle-button"}
                onClick={() => onUpdateProfile("preferEvidence", !profile.preferEvidence)}
              >
                优先资料完整
              </button>
            </div>
          </div>
          <div className="mentor-lab-selected">
            {profile.topics.length > 0
              ? profile.topics.map((topic) => (
                <button key={topic} type="button" className="topic-chip topic-chip--active" onClick={() => onToggleTopic(topic)}>
                  {topic}
                </button>
              ))
              : <p className="detail-copy">还没有选择兴趣标签，可以先从下方热区图里点几个方向开始。</p>}
          </div>
        </div>

        <div className="mentor-lab-panel">
          <div className="mentor-lab-panel__header">
            <div>
              <span className="eyebrow">方向热区图</span>
              <h3>从现有导师覆盖里反向探索</h3>
            </div>
          </div>
          <p className="detail-copy">颜色越深，代表覆盖导师越多；带“跨院”标记的方向适合拿来观察交叉机会。</p>
          <div className="topic-heatmap">
            {highlightedHeatTopics.map((entry) => (
              <button
                key={entry.topic}
                type="button"
                className={selectedTopicSet.has(entry.topic) ? "topic-heat topic-heat--active" : "topic-heat"}
                style={{ "--heat-strength": `${Math.min(0.9, 0.28 + entry.total / 28)}` }}
                onClick={() => onToggleTopic(entry.topic)}
              >
                <strong>{entry.topic}</strong>
                <span>{entry.total} 位导师</span>
                {entry.schoolCount > 1 && <em>跨院</em>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div className="notice notice--compact">
          <AlertTriangle aria-hidden="true" />
          <div>
            <p>实验室提示</p>
            <span>{message}</span>
          </div>
        </div>
      )}

      <div className="mentor-lab-overview">
        <div className="mentor-lab-overview__hero">
          <span className="eyebrow">结果总览</span>
          <h3>{currentView.label}</h3>
          <p>{currentView.description}</p>
          <p className="mentor-lab-overview__spotlight">{overview.topicSummary}</p>
          <div className="mentor-lab-viewbar">
            {mentorLabViewOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={view === option.id ? "toggle-button toggle-button--active" : "toggle-button"}
                onClick={() => onChangeView(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mentor-lab-kpis">
          <div className="mentor-lab-kpi">
            <strong>{overview.visibleCount}</strong>
            <span>当前可见</span>
          </div>
          <div className="mentor-lab-kpi">
            <strong>{overview.contactCount}</strong>
            <span>可立即联系</span>
          </div>
          <div className="mentor-lab-kpi">
            <strong>{overview.emailCount}</strong>
            <span>可见邮箱</span>
          </div>
          <div className="mentor-lab-kpi">
            <strong>{overview.shortlistCount}</strong>
            <span>待联系收藏</span>
          </div>
          <div className="mentor-lab-kpi">
            <strong>{overview.compareCount}</strong>
            <span>对比台</span>
          </div>
        </div>
      </div>

      <MentorLabComparePanel
        items={compareItems}
        diffOnly={compareDiffOnly}
        onToggleDiff={onToggleCompareDiff}
        onRemove={onToggleCompare}
      />

      <div className="mentor-lab-panel">
        <div className="mentor-lab-panel__header">
          <div>
            <span className="eyebrow">联系行动板</span>
            <h3>把候选人分成下一步动作</h3>
          </div>
        </div>
        {profile.topics.length === 0 ? (
          <p className="detail-copy">先完成兴趣画像，再看“可立即联系 / 建议先看主页 / 建议先补证据”三组动作会更准确。</p>
        ) : (
          <div className="action-board">
            {Object.entries(actionGroups).map(([bucket, items]) => (
              <div key={bucket} className="action-board__group">
                <div className="action-board__header">
                  <Chip tone={getActionBucketTone(bucket)}>{getActionBucketLabel(bucket)}</Chip>
                  <span>{items.length} 位优先显示</span>
                </div>
                <p>{getActionBucketHint(bucket)}</p>
                {items.length > 0 ? (
                  <div className="action-board__list">
                    {items.map((entry) => (
                      <button key={entry.item.id} type="button" className="action-board__item" onClick={() => onOpenMentor(entry.item)}>
                        <strong>{entry.item.name}</strong>
                        <span>{entry.matchReasons[0] ?? "查看导师详情"}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="detail-copy">当前画像下暂时没有落入这一组的导师。</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mentor-lab-panel">
        <div className="mentor-lab-panel__header">
          <div>
            <span className="eyebrow">待联系清单</span>
            <h3>本机收藏，方便下一次继续看</h3>
          </div>
        </div>
        {shortlistItems.length > 0 ? (
          <div className="mentor-lab-shortlist">
            {shortlistItems.map((entry) => (
              <button key={entry.item.id} type="button" className="shortlist-pill" onClick={() => onOpenMentor(entry.item)}>
                {entry.item.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="detail-copy">还没有加入待联系导师。可以在候选卡里先收藏，再回到原索引逐条核验。</p>
        )}
      </div>

        {profile.topics.length === 0 ? (
          <div className="mentor-lab-empty">
            <h3>先选择兴趣方向</h3>
            <p>从热区图点几个你真正想申请的方向词，再看“高度相关 / 可继续看 / 信息待补”三档结果会更有意义。</p>
          </div>
        ) : (
          <div className="mentor-lab-results">
            {resultSections.map((section) => (
            <div key={section.key} className="mentor-lab-result-group">
              <div className="mentor-lab-result-group__header">
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
                <Chip tone={getMatchTierTone(section.key)}>{section.items.length} 位</Chip>
              </div>
              {section.items.length > 0 ? (
                <div className="mentor-lab-card-list">
                  {section.items.map((entry) => (
                    <MentorLabResultCard
                      key={entry.item.id}
                      entry={entry}
                      isCompared={compareItems.some((compareEntry) => compareEntry.item.id === entry.item.id)}
                      isShortlisted={shortlistItems.some((shortlistEntry) => shortlistEntry.item.id === entry.item.id)}
                      onToggleCompare={onToggleCompare}
                      onToggleShortlist={onToggleShortlist}
                      onOpenMentor={onOpenMentor}
                    />
                  ))}
                </div>
              ) : (
                <p className="detail-copy">当前视图下，这一档暂时没有导师。</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const FeedbackSection = memo(() => {
  const containerRef = useCallback((elem) => {
    if (!elem) return;
    // Check if the script is already appended to prevent duplicate iframes in React StrictMode
    if (elem.childNodes.length > 0) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", "donaldjoker2025-arch/my-buaa-app");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "内测意见");
    script.setAttribute("theme", "github-light");
    
    elem.appendChild(script);
  }, []);

  return (
    <div className="content-section" style={{ animation: "fadeInUp 0.4s var(--transition-smooth) both" }}>
      <div className="notice" style={{ marginBottom: 20 }}>
        <MessageSquare size={20} />
        <div>
          <strong style={{ fontSize: "16px" }}>内测意见与反馈区</strong>
          <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.6, color: "var(--text-muted)" }}>
            所有的建议、Bug 反馈、导师信息的订正、或者是单纯的夸奖，都可以发在这里！提的意见<strong>所有人可见</strong>。<br/>
            （初次使用请点击下方授权 GitHub 登录，评论将自动以 Issue 形式记录在开源仓库中）
          </p>
          <div style={{ marginTop: 12 }}>
            <a 
              href="https://github.com/donaldjoker2025-arch/my-buaa-app/issues/new?labels=%E5%86%85%E6%B5%8B%E6%84%8F%E8%A7%81&title=%5B%E5%86%85%E6%B5%8B%E5%8F%8D%E9%A6%88%5D+" 
              target="_blank" 
              rel="noopener noreferrer"
              className="chip chip--blue"
              style={{ textDecoration: "none", fontSize: "13px", padding: "6px 14px" }}
            >
              <ExternalLink size={14} />
              如果下方未加载，也可以点我直接前往 GitHub 提意见
            </a>
          </div>
        </div>
      </div>
      <div className="filter-panel" style={{ minHeight: "400px", padding: "10px", display: "flex", flexDirection: "column" }}>
        <div ref={containerRef} style={{ flex: 1, width: "100%" }} />
      </div>
    </div>
  );
});

function useWeeklyVisits() {
  return useMemo(() => {
    const today = new Date();
    let dayOfWeek = today.getDay(); 
    let adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - adjustedDay + 1);
    const seed = startOfWeek.getFullYear() * 10000 + (startOfWeek.getMonth() + 1) * 100 + startOfWeek.getDate();
    
    const random = (s) => {
      let x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const data = [];
    
    let currentVisits = 120 + Math.floor(random(seed) * 50);
    let maxVisits = currentVisits;
    
    for (let i = 1; i <= adjustedDay; i++) {
      data.push({
        day: days[i - 1],
        visits: currentVisits
      });
      maxVisits = Math.max(maxVisits, currentVisits);
      currentVisits = Math.max(50, currentVisits + Math.floor((random(seed + i) - 0.4) * 80));
    }
    
    return { data, maxVisits };
  }, []);
}

const WeeklyVisitsChart = memo(() => {
  const { data, maxVisits } = useWeeklyVisits();
  
  // Create SVG points
  // Width: 200px, Height: 100px. Margin 10px.
  const chartWidth = 200;
  const chartHeight = 65; // Reduced slightly to make room for labels
  
  const points = data.map((d, index) => {
    const x = (index / 6) * chartWidth; // Fixed 7-day grid
    const y = chartHeight - (d.visits / (maxVisits * 1.2)) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  const daysLabels = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className="hero-visual chart-card" aria-label="本周访问量">
      <div className="hero-visual__top">
        <Activity aria-hidden="true" />
        <span>本周热度 (周一至今)</span>
      </div>
      <strong style={{ fontSize: "28px" }}>{data[data.length - 1].visits}</strong>
      <p style={{ margin: 0, opacity: 0.8 }}>今日访问量 (模拟)</p>
      
      <div style={{ flex: 1, marginTop: "12px", position: "relative" }}>
        <svg width="100%" height="100%" viewBox={`0 -5 ${chartWidth} ${chartHeight + 20}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <polyline 
            points={points} 
            fill="none" 
            stroke="url(#chartGradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="chart-polyline"
          />
          {data.map((d, index) => {
            const x = (index / 6) * chartWidth;
            const y = chartHeight - (d.visits / (maxVisits * 1.2)) * chartHeight;
            return (
              <circle key={index} cx={x} cy={y} r="4" fill="#fff" stroke="#4f6ef7" strokeWidth="2" className="chart-point" style={{ animationDelay: `${0.3 + index * 0.1}s` }} />
            );
          })}
          {/* Add x-axis labels */}
          {daysLabels.map((label, index) => {
            const x = (index / 6) * chartWidth;
            return (
              <text key={index} x={x} y={chartHeight + 15} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" style={{ animation: "fadeIn 0.5s 0.8s both" }}>
                {label}
              </text>
            );
          })}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#4f6ef7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
});

const HeroVisualStacked = memo(({ count }) => {
  const [activeCard, setActiveCard] = useState("stats");

  return (
    <div className={`hero-stacked-container ${activeCard === "chart" ? "flipped" : ""}`}>
      <div 
        className={`hero-stacked-card ${activeCard === "stats" ? "active" : "inactive"}`}
        onClick={() => activeCard === "chart" && setActiveCard("stats")}
      >
        <div className="hero-visual" aria-label="公开导师信息概览">
          <div className="hero-visual__top">
            <BarChart3 aria-hidden="true" />
            <span>公开来源记录</span>
          </div>
          <strong>{count}</strong>
          <p>两院导师信息</p>
          <div className="hero-bars" aria-hidden="true">
            <span style={{ height: "72%" }} />
            <span style={{ height: "48%" }} />
            <span style={{ height: "84%" }} />
            <span style={{ height: "58%" }} />
            <span style={{ height: "68%" }} />
          </div>
        </div>
      </div>

      <div 
        className={`hero-stacked-card chart-card-wrapper ${activeCard === "chart" ? "active" : "inactive"}`}
        onClick={() => activeCard === "stats" && setActiveCard("chart")}
      >
        <WeeklyVisitsChart />
      </div>
    </div>
  );
});

export default function App() {
  const [dbResults, setDbResults] = useState(supervisors);
  const [schoolFilter, setSchoolFilter] = useState("全部");
  const [catFilter, setCatFilter] = useState("全部");
  const [searchQ, setSearchQ] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("database");
  const [pendingSubmissions, setPendingSubmissions] = useState(() => safeReadPendingSubmissions());
  const [mentorLabProfile, setMentorLabProfile] = useState(() => safeReadMentorLabProfile());
  const [mentorCompareList, setMentorCompareList] = useState(() => safeReadMentorLabIds(MENTOR_LAB_COMPARE_KEY));
  const [mentorShortlist, setMentorShortlist] = useState(() => safeReadMentorLabIds(MENTOR_LAB_SHORTLIST_KEY));
  const [compareDiffOnly, setCompareDiffOnly] = useState(false);
  const [mentorLabView, setMentorLabView] = useState("all");
  const [mentorLabMessage, setMentorLabMessage] = useState("");

  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    writeLocalJson(MENTOR_LAB_PROFILE_KEY, mentorLabProfile);
  }, [mentorLabProfile]);

  useEffect(() => {
    writeLocalJson(MENTOR_LAB_COMPARE_KEY, mentorCompareList);
  }, [mentorCompareList]);

  useEffect(() => {
    writeLocalJson(MENTOR_LAB_SHORTLIST_KEY, mentorShortlist);
  }, [mentorShortlist]);

  useEffect(() => {
    const tabsEl = tabsRef.current;
    if (!tabsEl) return;
    const activeEl = tabsEl.querySelector('.tab--active');
    if (!activeEl) return;
    const tabsRect = tabsEl.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    setIndicatorStyle({
      left: activeRect.left - tabsRect.left + tabsEl.scrollLeft,
      width: activeRect.width,
    });
  }, [activeTab]);

  function handleSubmitNote(item, form) {
    const submission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: "pending",
      schoolKey: item.schoolKey,
      school: item.school,
      teacherName: item.name,
      teacherId: item.id,
      type: form.type,
      relation: form.relation,
      content: form.content.trim(),
      sourceUrl: form.sourceUrl.trim(),
      contactForReview: form.contact.trim(),
      submittedAt: new Date().toISOString(),
    };
    setPendingSubmissions((current) => {
      const next = [submission, ...current];
      writePendingSubmissions(next);
      return next;
    });
  }

  function handleClearPending() {
    setPendingSubmissions([]);
    writePendingSubmissions([]);
  }

  function handleMentorLabProfileChange(field, value) {
    setMentorLabProfile((current) => normalizeMentorLabProfile({ ...current, [field]: value }));
  }

  function handleToggleMentorTopic(topic) {
    setMentorLabMessage("");
    setMentorLabProfile((current) => {
      if (current.topics.includes(topic)) {
        return { ...current, topics: current.topics.filter((item) => item !== topic) };
      }
      if (current.topics.length >= 5) {
        setMentorLabMessage("兴趣画像建议最多保留 5 个标签，先删掉一个再继续添加会更清晰。");
        return current;
      }
      return { ...current, topics: [...current.topics, topic] };
    });
  }

  function handleResetMentorLabProfile() {
    setMentorLabMessage("");
    setMentorLabProfile(mentorLabDefaultProfile);
  }

  function handleToggleCompare(mentorId) {
    setMentorLabMessage("");
    setMentorCompareList((current) => {
      if (current.includes(mentorId)) {
        return current.filter((id) => id !== mentorId);
      }
      if (current.length >= 4) {
        setMentorLabMessage("对比台最多同时保留 4 位导师，先移出一位再继续添加。");
        return current;
      }
      return [...current, mentorId];
    });
  }

  function handleToggleShortlist(mentorId) {
    setMentorShortlist((current) => (current.includes(mentorId) ? current.filter((id) => id !== mentorId) : [...current, mentorId]));
  }

  function handleOpenMentorFromLab(item) {
    setActiveTab("database");
    setSchoolFilter(item.school);
    setCatFilter("全部");
    setSearchQ(item.name);
    setExpanded(item.id);
  }

  function handleOpenMentorByName(name) {
    const item = supervisors.find(m => m.name === name);
    if (item) {
      handleOpenMentorFromLab(item);
    }
  }

  const handleToggleExpand = useCallback((id) => {
    setExpanded((current) => current === id ? null : id);
  }, []);

  const [isRandomizing, setIsRandomizing] = useState(false);

  function handleRandomBlindBox() {
    if (isRandomizing) return;
    setIsRandomizing(true);
    let ticks = 0;
    const maxTicks = 15;
    const interval = setInterval(() => {
      const rIdx = Math.floor(Math.random() * supervisors.length);
      setSearchQ(supervisors[rIdx].name);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setIsRandomizing(false);
        handleOpenMentorFromLab(supervisors[rIdx]);
      }
    }, 60);
  }

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
          ...(item.topicTags ?? []),
          ...item.directions,
          ...item.groups,
          ...item.categories,
          ...item.tags,
          item.researchSummary ?? "",
          item.profileUrl ?? "",
          item.officialUrl ?? "",
          item.teacherHomeUrl ?? "",
          item.email ?? "",
          ...(item.admissions ?? []).map((entry) => entry.label),
        ].join(" ").toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => a.school.localeCompare(b.school, "zh-Hans-CN") || a.name.localeCompare(b.name, "zh-Hans-CN"));
  }, [catFilter, schoolFilter, searchQ]);

  const mentorLabResults = useMemo(() => {
    return supervisors
      .filter((item) => mentorLabProfile.school === "不限学院" || item.school === mentorLabProfile.school)
      .filter((item) => !mentorLabProfile.requireEmail || Boolean(item.email))
      .map((item) => buildMentorLabEntry(item, mentorLabProfile))
      .sort((a, b) => compareMentorLabEntries(a, b, mentorLabProfile));
  }, [mentorLabProfile]);

  const mentorLabVisibleResults = useMemo(() => {
    if (mentorLabView === "priority") {
      return mentorLabResults.filter((entry) => entry.matchTier === "high" || entry.actionBucket === "contact");
    }
    if (mentorLabView === "contact") {
      return mentorLabResults.filter((entry) => entry.actionBucket === "contact");
    }
    if (mentorLabView === "shortlist") {
      return mentorLabResults.filter((entry) => mentorShortlist.includes(entry.item.id));
    }
    return mentorLabResults;
  }, [mentorLabResults, mentorLabView, mentorShortlist]);

  const mentorCompareItems = useMemo(() => {
    return mentorCompareList
      .map((id) => supervisors.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => buildMentorLabEntry(item, mentorLabProfile));
  }, [mentorCompareList, mentorLabProfile]);

  const mentorShortlistItems = useMemo(() => {
    return mentorShortlist
      .map((id) => supervisors.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => buildMentorLabEntry(item, mentorLabProfile))
      .sort((a, b) => compareMentorLabEntries(a, b, mentorLabProfile));
  }, [mentorLabProfile, mentorShortlist]);

  const mentorLabOverview = useMemo(() => {
    const topicCounts = mentorLabVisibleResults.reduce((map, entry) => {
      entry.matchDetails.interestHits.forEach((topic) => {
        map.set(topic, (map.get(topic) ?? 0) + 1);
      });
      return map;
    }, new Map());
    const topTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1] || sortZhText(a[0], b[0]))
      .slice(0, 3)
      .map(([topic]) => topic);
    const topicSummary = mentorLabProfile.topics?.length
      ? (topTopics.length > 0
        ? `当前可见候选最常命中的兴趣：${topTopics.join(" / ")}`
        : "当前画像下还没有明显兴趣命中，建议放宽学院或邮箱限制继续观察。")
      : "先从热区图选择 3-5 个方向，结果会更有区分度。";

    return {
      visibleCount: mentorLabVisibleResults.length,
      totalCount: mentorLabResults.length,
      contactCount: mentorLabResults.filter((entry) => entry.actionBucket === "contact").length,
      emailCount: mentorLabVisibleResults.filter((entry) => Boolean(entry.item.email)).length,
      shortlistCount: mentorShortlistItems.length,
      compareCount: mentorCompareItems.length,
      topicSummary,
    };
  }, [mentorCompareItems, mentorLabProfile, mentorLabResults, mentorLabVisibleResults, mentorShortlistItems]);

  const tabs = [
    { id: "database", label: "导师索引", icon: Search },
    { id: "topic-galaxy", label: "星云图谱", icon: Network },
    { id: "match-quiz", label: "匹配测试", icon: Sparkles },
    { id: "feedback", label: "内测意见", icon: MessageSquare },
    { id: "mentor-lab", label: "择导实验室", icon: BarChart3 },
    { id: "directions", label: "培养方向", icon: GraduationCap },
    { id: "sources", label: "来源与建议", icon: LinkIcon },
  ];

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-top-row">
            <span className="eyebrow">BUAA Biomedical Mentor Index</span>
            <a 
              href="https://github.com/donaldjoker2025-arch/my-buaa-app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="github-star-pill"
            >
              <GithubIcon size={14} />
              <span>觉得有用？在 GitHub 给我点个 Star 吧！</span>
              <Star size={14} className="star-icon" />
            </a>
          </div>
          <h1>北航生医工/医工两院导师信息索引</h1>
          <p>
            面向考研和保研择导的公开信息工作台。保留官网可核验来源，补充方向覆盖、联系入口、资料线索和联系前核验清单，帮助先缩小范围，再去官网确认细节。
          </p>
        </div>
        <HeroVisualStacked count={supervisors.length} />
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

      <nav className="tabs" aria-label="页面导航" ref={tabsRef}>
        {indicatorStyle.width > 0 && (
          <span
            className="tabs__indicator"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        )}
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
              <div style={{display: "flex", gap: "12px", alignItems: "center"}}>
                <button className="link-button" onClick={handleRandomBlindBox} disabled={isRandomizing} style={{color: "var(--blue)", fontWeight: 600}}>
                  <Dices size={18} /> 缘分摇一摇
                </button>
                <p>当前筛选结果：{filtered.length} 条</p>
              </div>
            </div>
            <div className="filter-grid">
              <label className="field field--search">
                <span>关键词</span>
                <div className="input-with-icon">
                  <Search aria-hidden="true" />
                  <input
                    placeholder="搜索姓名、学院、规范方向词、邮箱或关键词"
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
                onToggle={handleToggleExpand}
                pendingCount={pendingSubmissions.filter((entry) => getPendingKey(item) === `${entry.schoolKey}:${entry.teacherName}`).length}
                onSubmitNote={handleSubmitNote}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === "mentor-lab" && (
        <MentorLabSection
          profile={mentorLabProfile}
          allResults={mentorLabResults}
          results={mentorLabVisibleResults}
          view={mentorLabView}
          overview={mentorLabOverview}
          compareItems={mentorCompareItems}
          shortlistItems={mentorShortlistItems}
          compareDiffOnly={compareDiffOnly}
          message={mentorLabMessage}
          onToggleTopic={handleToggleMentorTopic}
          onUpdateProfile={handleMentorLabProfileChange}
          onResetProfile={handleResetMentorLabProfile}
          onChangeView={setMentorLabView}
          onToggleCompare={handleToggleCompare}
          onToggleShortlist={handleToggleShortlist}
          onOpenMentor={handleOpenMentorFromLab}
          onToggleCompareDiff={() => setCompareDiffOnly((value) => !value)}
        />
      )}

      {activeTab === "directions" && (
        <section className="content-section">
          <SectionTitle eyebrow="培养方向" title="按官方方向与公开研究方向查看导师池">
            生医工学院继续保留官方培养方向表；医工学院补充为基于官网研究方向的聚类展示，方便把两院导师一起纳入反向筛选。
          </SectionTitle>

          <div className="direction-section">
            <div className="direction-section__intro">
              <div>
                <span className="eyebrow">生医工学院</span>
                <h3>官方培养方向表</h3>
                <p>已恢复并保留生物力学、生物医学材料、细胞与组织工程等官方方向，方便按专业兴趣反向查找导师。</p>
              </div>
              <Chip tone="green">官方培养方向</Chip>
            </div>
            <div className="direction-grid">
              {bmeDirections.map((area, index) => <DirectionCard key={`${area.group}-${area.code}`} area={area} style={{ animationDelay: `${index * 0.06}s` }} onOpenMentor={handleOpenMentorByName} />)}
            </div>
          </div>

          <div className="direction-section">
            <div className="direction-section__intro">
              <div>
                <span className="eyebrow">医工学院补充</span>
                <h3>官网研究方向聚类</h3>
                <p>医工学院当前在本地没有与生医工方向表同格式的官方培养方向总表，因此这里按官网教师详情中的公开方向聚类展示，便于把 MSE 师资也纳入择导视野。</p>
              </div>
              <div className="direction-section__chips">
                <Chip tone="blue">官网研究方向聚类</Chip>
                <Chip tone="slate">非官方培养方向表</Chip>
              </div>
            </div>
            <div className="direction-grid">
              {mseDirectionAreas.map((area, index) => <DirectionCard key={`${area.group}-${area.code}`} area={area} style={{ animationDelay: `${index * 0.06}s` }} onOpenMentor={handleOpenMentorByName} />)}
            </div>
          </div>
        </section>
      )}

      {activeTab === "topic-galaxy" && (
        <TopicGalaxy supervisors={supervisors} onOpenMentor={handleOpenMentorFromLab} />
      )}

      {activeTab === "match-quiz" && (
        <MatchQuiz supervisors={supervisors} onOpenMentor={handleOpenMentorFromLab} />
      )}

      {activeTab === "feedback" && (
        <FeedbackSection />
      )}

      {activeTab === "sources" && (
        <section className="content-section">
          <SectionTitle eyebrow="来源与建议" title="把不确定信息留给官网复核">
            页面只做公开信息索引和联系准备提示，不替代当年招生目录、学院通知或导师本人确认。
          </SectionTitle>

          <PendingReviewPanel pendingSubmissions={pendingSubmissions} onClearPending={handleClearPending} />

          <div className="source-grid">
            {sourceCards.map((source, index) => (
              <a key={source.url} className="source-card" href={source.url} target="_blank" rel="noreferrer" style={{ animationDelay: `${index * 0.05}s` }}>
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
