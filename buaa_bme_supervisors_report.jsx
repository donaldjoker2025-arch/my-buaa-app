import { useMemo, useState } from "react";

const BME_SOURCE_URL = "https://bme.buaa.edu.cn/zhaopinHr.aspx?catID=9&curID=713&subcatID=40";
const BME_TEACHERS_URL = "https://bme.buaa.edu.cn/teachers.aspx?catID=7";
const MSE_PEOPLE_URL = "https://ygy.buaa.edu.cn/info/1022/3032.htm";
const MSE_DETAIL_URL = "https://ygy.buaa.edu.cn/szdw1/szryxx.htm";

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

function buildBmeSupervisors() {
  const byName = new Map();

  bmeDirections.forEach((area) => {
    area.mentors.forEach((rawName) => {
      const { name, partTime } = parseMentor(rawName);
      if (!byName.has(name)) {
        byName.set(name, {
          id: `bme-${name}`,
          school: "生物与医学工程学院",
          name,
          title: "指导教师",
          directions: [],
          groups: new Set(),
          categories: new Set(),
          tags: new Set(),
          source: "生物与医学工程学院硕士研究生培养方向设置及指导教师对照表",
          sourceUrl: BME_SOURCE_URL,
          profileUrl: BME_TEACHERS_URL,
        });
      }

      const teacher = byName.get(name);
      teacher.directions.push(`${area.code} ${area.name}`);
      teacher.groups.add(area.group);
      teacher.categories.add(area.name);
      if (partTime) teacher.tags.add("兼职导师");
    });
  });

  return Array.from(byName.values()).map((teacher) => ({
    ...teacher,
    groups: Array.from(teacher.groups),
    categories: Array.from(teacher.categories),
    tags: Array.from(teacher.tags),
  }));
}

function buildMseSupervisors() {
  return msePeople.map(([name, profileUrl]) => {
    const detail = mseKnownDetails[name] ?? {};
    const directions = detail.directions ?? [];
    return {
      id: `mse-${name}`,
      school: "医学科学与工程学院",
      name,
      title: detail.title ?? "师资人员",
      directions,
      groups: ["医学科学与工程学院师资"],
      categories: directions.length ? directions : ["医工学院师资索引"],
      tags: detail.tags ?? [],
      email: detail.email,
      source: "医学科学与工程学院人员列表及师资人员详细索引",
      sourceUrl: detail.sourceUrl ?? profileUrl,
      profileUrl,
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
    title: "医工学院人员列表",
    desc: "医学科学与工程学院官网发布的按姓氏排列人员列表。",
    url: MSE_PEOPLE_URL,
  },
  {
    title: "医工学院师资详情索引",
    desc: "医学科学与工程学院师资人员详细分页索引。",
    url: MSE_DETAIL_URL,
  },
];

function chipStyle(tone = "neutral") {
  const tones = {
    neutral: { bg: "var(--color-background-tertiary)", text: "var(--color-text-secondary)" },
    blue: { bg: "#E7F1FF", text: "#1C5D99" },
    green: { bg: "#E1F5EE", text: "#0F6E56" },
    amber: { bg: "#FFF4DB", text: "#8A5A00" },
  };
  const color = tones[tone] ?? tones.neutral;
  return {
    fontSize: 12,
    padding: "3px 9px",
    borderRadius: "var(--border-radius-md)",
    background: color.bg,
    color: color.text,
    lineHeight: 1.4,
  };
}

function linkButtonStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 11px",
    borderRadius: "var(--border-radius-md)",
    border: "1px solid var(--color-border-secondary)",
    background: "var(--color-background-primary)",
    color: "var(--color-text-info)",
    textDecoration: "none",
    fontSize: 13,
  };
}

function SourceNotice() {
  return (
    <div style={{ marginBottom: 18, padding: "12px 14px", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-secondary)" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600 }}>数据说明</p>
      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
        本页优先展示官网可核验信息：生医工学院按官方硕士培养方向表汇总，医工学院按官网人员列表和师资详情索引汇总。未由公开页面直接确认的职称、评价、主观打分不再展示。
      </p>
    </div>
  );
}

export default function App() {
  const [schoolFilter, setSchoolFilter] = useState("全部");
  const [catFilter, setCatFilter] = useState("全部");
  const [searchQ, setSearchQ] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("database");

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
          item.email ?? "",
        ].join(" ").toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => a.school.localeCompare(b.school, "zh-Hans-CN") || a.name.localeCompare(b.name, "zh-Hans-CN"));
  }, [catFilter, schoolFilter, searchQ]);

  const tabStyle = (tab) => ({
    padding: "8px 16px",
    borderRadius: "var(--border-radius-md)",
    border: activeTab === tab ? "1px solid var(--color-border-primary)" : "1px solid transparent",
    background: activeTab === tab ? "var(--color-background-primary)" : "transparent",
    color: activeTab === tab ? "var(--color-text-primary)" : "var(--color-text-secondary)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: activeTab === tab ? 600 : 400,
  });

  return (
    <div style={{ padding: "2rem 20px", maxWidth: 880, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 650, margin: "0 0 6px" }}>北航生医工/医工两院导师信息索引</h1>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1.4rem", lineHeight: 1.6 }}>
        生物与医学工程学院 · 医学科学与工程学院 · 共 {supervisors.length} 条公开来源导师/师资记录
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, borderBottom: "1px solid var(--color-border-tertiary)", paddingBottom: 12, flexWrap: "wrap" }}>
        <button type="button" style={tabStyle("database")} onClick={() => setActiveTab("database")}>导师索引</button>
        <button type="button" style={tabStyle("directions")} onClick={() => setActiveTab("directions")}>培养方向</button>
        <button type="button" style={tabStyle("sources")} onClick={() => setActiveTab("sources")}>来源与建议</button>
      </div>

      {activeTab === "database" && (
        <>
          <SourceNotice />

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(150px, 220px) minmax(170px, 260px)", gap: 8, marginBottom: 12 }}>
            <input
              placeholder="搜索姓名、学院、方向、关键词"
              value={searchQ}
              onChange={(event) => setSearchQ(event.target.value)}
              style={{ minWidth: 0 }}
            />
            <select value={schoolFilter} onChange={(event) => setSchoolFilter(event.target.value)}>
              {schools.map((school) => <option key={school}>{school}</option>)}
            </select>
            <select value={catFilter} onChange={(event) => setCatFilter(event.target.value)}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>

          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 12px" }}>当前筛选结果：{filtered.length} 条</p>

          {filtered.map((item) => (
            <div key={item.id} className="supervisor-card" style={{ marginBottom: 10, border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)" }}>
              <button
                type="button"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                style={{ width: "100%", padding: "13px 16px", border: 0, background: "transparent", textAlign: "left", cursor: "pointer", color: "inherit" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 7 }}>
                      <span style={{ fontWeight: 650, fontSize: 16 }}>{item.name}</span>
                      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{item.title}</span>
                      <span style={chipStyle(item.school === "医学科学与工程学院" ? "blue" : "green")}>{item.school}</span>
                      {item.tags.map((tag) => <span key={tag} style={chipStyle(tag === "兼职导师" ? "amber" : "neutral")}>{tag}</span>)}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(item.directions.length ? item.directions : item.categories).slice(0, 5).map((direction) => (
                        <span key={direction} style={chipStyle()}>{direction}</span>
                      ))}
                      {(item.directions.length ? item.directions : item.categories).length > 5 && (
                        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", padding: "3px 0" }}>+{(item.directions.length ? item.directions : item.categories).length - 5}</span>
                      )}
                    </div>
                  </div>
                  <span style={{ flexShrink: 0, color: "var(--color-text-tertiary)", fontSize: 18, lineHeight: 1 }}>{expanded === item.id ? "−" : "+"}</span>
                </div>
              </button>

              {expanded === item.id && (
                <div style={{ padding: "13px 16px 16px", background: "var(--color-background-secondary)", borderTop: "1px solid var(--color-border-tertiary)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    <div style={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px" }}>
                      <p style={{ margin: "0 0 5px", fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 600 }}>来源</p>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{item.source}</p>
                    </div>
                    <div style={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px" }}>
                      <p style={{ margin: "0 0 5px", fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 600 }}>覆盖类别</p>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{item.groups.join("、")}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 600 }}>公开方向/索引分类</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(item.directions.length ? item.directions : item.categories).map((direction) => (
                        <span key={direction} style={chipStyle()}>{direction}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {item.email && (
                      <a href={`mailto:${item.email}`} style={{ ...linkButtonStyle(), color: "var(--color-text-primary)" }}>
                        邮箱：{item.email}
                      </a>
                    )}
                    <a href={item.profileUrl} target="_blank" rel="noreferrer" style={linkButtonStyle()}>
                      官网/个人页
                    </a>
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" style={linkButtonStyle()}>
                      数据来源
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {activeTab === "directions" && (
        <div>
          <SourceNotice />
          {bmeDirections.map((area) => (
            <div key={`${area.group}-${area.code}`} style={{ marginBottom: 12, padding: "14px 16px", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-primary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 650 }}>{area.code} {area.name}</p>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", flexShrink: 0 }}>{area.group} · {area.mentors.length} 人</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {area.mentors.map((rawName) => {
                  const { name, partTime } = parseMentor(rawName);
                  return <span key={rawName} style={chipStyle(partTime ? "amber" : "neutral")}>{name}{partTime ? " · 兼职" : ""}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "sources" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10, marginBottom: 20 }}>
            {sourceCards.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" style={{ display: "block", padding: "13px 15px", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-primary)", textDecoration: "none", color: "inherit" }}>
                <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 650 }}>{source.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{source.desc}</p>
              </a>
            ))}
          </div>

          {[
            {
              title: "联系导师前",
              lines: [
                "先用官网主页核对导师当前学院、职称、研究方向和联系方式，再阅读近两三篇代表性论文或课题组新闻。",
                "简历中写清专业背景、课程/项目经历、科研或工程技能、希望申请的培养方向，不绑定任何特定奖项模板。",
              ],
            },
            {
              title: "套磁邮件",
              lines: [
                "主题建议使用：推免/考研咨询-姓名-本科院校-意向方向。",
                "正文保持简短：自我介绍、为何关注该方向、已有能力与可投入时间、附件简历；避免群发痕迹。",
              ],
            },
            {
              title: "信息核验",
              lines: [
                "同名教师、跨学院任职、兼职导师和页面迁移都可能导致旧资料出错，最终以学院官网、北航教师个人主页和当年招生通知为准。",
                "本页面不对导师作主观排名，也不展示无法公开核验的毕业风险、就业薪资或学生评价。",
              ],
            },
          ].map((block) => (
            <div key={block.title} style={{ marginBottom: 12, padding: "14px 16px", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-primary)" }}>
              <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 650 }}>{block.title}</p>
              {block.lines.map((line) => (
                <p key={line} style={{ margin: "0 0 5px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
