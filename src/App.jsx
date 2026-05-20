import { useState, useMemo } from "react";

const supervisors = [
  // ============ 生物与医学工程学院 (10系) ============
  {
    id: 1,
    school: "生物与医学工程学院",
    name: "常凌乾",
    title: "教授",
    isMasterSupervisor: true,
    email: "lingqianchang@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/chang/zh_CN/index.htm",
    directions: ["微流控芯片", "生物传感器", "纳米电穿孔", "基因递送", "单细胞分析"],
    category: "生物传感/微流控",
    highlight: "国家高层次青年人才；2025年Nature，2026年Cell（北航首篇）；创办两家市值过亿公司；在研经费千余万",
    pubLevel: "Nature/Cell/Nano Letters级别",
    jobMarket: 5,
    academicLevel: 5,
    prolongRisk: "中",
    notes: "⚠️ 研究涉及细胞操作（基因编辑/递送），偏工程器件端，若不排斥可考虑；课题组产业转化极强，适合想去医疗器械/诊断行业的同学",
    tags: ["国家青年人才", "成果转化", "产业化强"]
  },
  {
    id: 2,
    school: "生物与医学工程学院",
    name: "汪待发",
    title: "副教授",
    isMasterSupervisor: true,
    email: "wangdaifa@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/wangdaifa/zh_CN/index.htm",
    directions: ["近红外脑功能成像(fNIRS)", "脑机接口", "神经调控", "脑功能评价"],
    category: "神经工程/BCI",
    highlight: "创办慧创医疗，研发世界首个获医疗器械注册证的100+通道fNIRS装置；已在300医院等400余家单位落地应用；主持国家重大科学仪器研制项目、国重研发计划",
    pubLevel: "SCI 40余篇（支撑多家医院发表120余篇）",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "强烈推荐！脑机接口方向风口，成果高度产业化；老师创业经历丰富，对学生就业理解深刻；技术落地能力强，适合想去BCI/医疗器械公司的同学",
    tags: ["产业化强", "BCI风口", "成果转化", "创业背景"]
  },
  {
    id: 3,
    school: "生物与医学工程学院",
    name: "刘晓冬",
    title: "教授",
    isMasterSupervisor: true,
    email: "liuxd@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/liuxiaodong/zh_CN/index.htm",
    directions: ["神经信息学", "视觉神经科学", "脑功能成像", "神经计算"],
    category: "神经工程/BCI",
    highlight: "美国Case Western Reserve大学博士；Johns Hopkins大学生医工系博士后；清华大学教授（2010-2018）转入北航；生医高精尖中心PI；国际顶级神经工程学家",
    pubLevel: "顶级期刊（Nature Neuroscience级别）",
    jobMarket: 3,
    academicLevel: 5,
    prolongRisk: "中",
    notes: "学术领军人物，适合有志读博/走学术路线的同学；就业前景相对偏学术；研究较基础，落地周期长",
    tags: ["学术顶尖", "JHU博士后", "高精尖中心"]
  },
  {
    id: 4,
    school: "生物与医学工程学院",
    name: "宫赫",
    title: "教授",
    isMasterSupervisor: true,
    email: "gonghe1@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/gonghe1/zh_CN/index.htm",
    directions: ["生物光学", "医学光子学", "光学相干断层成像(OCT)"],
    category: "光学成像",
    highlight: "从事生物医学光学研究；光学相干断层成像方向",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "光学成像方向，在眼科医疗器械、手术导航等有较好就业前景；建议进一步查阅其课题组具体项目",
    tags: ["医学光学", "OCT"]
  },
  {
    id: 5,
    school: "生物与医学工程学院",
    name: "裴葆青",
    title: "教授",
    isMasterSupervisor: true,
    email: "peizuoqing@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/peizuoqing/zh_CN/index.htm",
    directions: ["超声医学工程", "声学医学传感器", "医学超声成像"],
    category: "医学影像/成像",
    highlight: "超声医学工程领域；声学传感器研发；主持国自然等基金",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "超声成像是医疗器械大赛道，迈瑞/GE/飞利浦等公司需求旺盛；适合医疗器械方向就业",
    tags: ["超声成像", "医疗器械"]
  },
  {
    id: 6,
    school: "生物与医学工程学院",
    name: "牛海军",
    title: "教授",
    isMasterSupervisor: true,
    email: "niuhaijun@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/niuhaijun/zh_CN/index.htm",
    directions: ["近红外光谱", "血氧检测", "无创检测技术", "可穿戴传感器"],
    category: "生物传感/微流控",
    highlight: "近红外光谱无创检测；血糖/血氧无创检测技术研发；主持多项国自然基金",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "无创检测/可穿戴是健康管理的重要方向，适合去穿戴设备公司、IVD/POCT公司等",
    tags: ["无创检测", "可穿戴"]
  },
  {
    id: 7,
    school: "生物与医学工程学院",
    name: "牛旭锋",
    title: "教授",
    isMasterSupervisor: true,
    email: "niuxufeng@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/niuxufeng/zh_CN/index.htm",
    directions: ["医学信号处理", "心电/脑电信号分析", "可穿戴医疗设备"],
    category: "医学信号处理",
    highlight: "医学信号处理与可穿戴设备研究；生理信号分析",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "医学信号处理方向就业广，华为、小米、苹果穿戴团队及各医疗AI公司均有需求",
    tags: ["信号处理", "可穿戴"]
  },
  {
    id: 8,
    school: "生物与医学工程学院",
    name: "刘红",
    title: "教授",
    isMasterSupervisor: true,
    email: "liuhong@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/liuhong/zh_CN/index.htm",
    directions: ["生物力学(血流动力学)", "心血管仿真", "流固耦合"],
    category: "其他（接近排除方向）",
    highlight: "血流动力学、心血管力学仿真；但属于生物力学分支",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "⚠️ 属于生物力学（血流动力学）分支，用户已排除生物力学方向，请根据个人情况决定是否考虑",
    tags: ["血流动力学", "⚠️近排除方向"]
  },
  {
    id: 9,
    school: "生物与医学工程学院",
    name: "王璞",
    title: "教授",
    isMasterSupervisor: true,
    email: "puwang101@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/puwang101/zh_CN/index.htm",
    directions: ["生物传感器", "纳米传感器", "体外诊断(IVD)"],
    category: "生物传感/微流控",
    highlight: "生物传感器研究；体外诊断技术研发",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "IVD（体外诊断）是最大医疗器械细分市场，就业前景佳；迈瑞、罗氏、雅培等公司均有需求",
    tags: ["IVD", "体外诊断", "传感器"]
  },
  {
    id: 10,
    school: "生物与医学工程学院",
    name: "张冀聪",
    title: "教授",
    isMasterSupervisor: true,
    email: "zhangjicong@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/zhangjicong/zh_CN/index.htm",
    directions: ["脑电信号处理", "BCI脑机接口", "认知神经科学", "医学AI"],
    category: "神经工程/BCI",
    highlight: "脑机接口与脑电信号处理；认知神经工程；主持国自然等项目",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "中",
    notes: "BCI方向热门，适合去BCI公司（强脑科技、脑陆科技、诺亦腾等）或健康监测公司",
    tags: ["BCI", "脑电", "认知神经"]
  },
  {
    id: 11,
    school: "生物与医学工程学院",
    name: "蒲放",
    title: "教授",
    isMasterSupervisor: true,
    email: "pufang@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/pufang/zh_CN/index.htm",
    directions: ["生物医学光学", "荧光成像", "分子影像"],
    category: "光学成像",
    highlight: "生物医学光学与分子影像研究",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "分子影像方向学术前景好，就业偏向科研或大型医院/医疗器械",
    tags: ["分子影像", "荧光成像"]
  },
  {
    id: 12,
    school: "生物与医学工程学院",
    name: "荣龙",
    title: "教授",
    isMasterSupervisor: true,
    email: "ronglong@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/ronglong/zh_CN/index.htm",
    directions: ["细胞内吞/外泌体", "分子细胞生物学", "蛋白质功能"],
    category: "其他（接近排除方向）",
    highlight: "分子细胞生物学方向，偏基础研究",
    pubLevel: "SCI期刊",
    jobMarket: 2,
    academicLevel: 4,
    prolongRisk: "中",
    notes: "⚠️ 偏向细胞工程/细胞生物学基础研究，与用户排除方向重合度高；就业偏学术/生物tech",
    tags: ["⚠️近排除方向", "细胞生物学"]
  },
  {
    id: 13,
    school: "生物与医学工程学院",
    name: "孙联文",
    title: "教授",
    isMasterSupervisor: true,
    email: "sunlianwen@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/sunlianwen/zh_CN/index.htm",
    directions: ["超声成像", "医学超声换能器", "超声引导介入"],
    category: "医学影像/成像",
    highlight: "超声换能器研发与超声成像技术；超声引导精准治疗",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "超声医疗器械方向强，国内迈瑞、开立、联影均是超声大厂，需求旺盛",
    tags: ["超声", "医疗器械", "换能器"]
  },
  {
    id: 14,
    school: "生物与医学工程学院",
    name: "周前祥",
    title: "教授",
    isMasterSupervisor: true,
    email: "zhouqianxiang@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/zhouqianxiang/zh_CN/index.htm",
    directions: ["航天医学工程", "人因工程", "人机交互", "环境生理学"],
    category: "医疗器械/智能医疗",
    highlight: "航天医学工程领域知名学者；人机交互与人因工程；北航特色方向",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "航天医学特色方向，适合去航天单位（航天员中心等）或人因工程相关企业；就业方向相对窄",
    tags: ["航天医学", "人因工程", "北航特色"]
  },
  {
    id: 15,
    school: "生物与医学工程学院",
    name: "许燕",
    title: "教授",
    isMasterSupervisor: true,
    email: "xuyan@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/xuyan/zh_CN/index.htm",
    directions: ["磁共振成像(MRI)", "医学图像处理", "功能磁共振"],
    category: "医学影像/成像",
    highlight: "MRI技术与医学图像处理；功能磁共振成像",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "MRI是医疗器械重点方向，联影医疗、西门子、GE等均有大量需求；图像处理与AI结合空间大",
    tags: ["MRI", "医学图像处理"]
  },
  {
    id: 16,
    school: "生物与医学工程学院",
    name: "岳蜀华",
    title: "教授",
    isMasterSupervisor: true,
    email: "yueshuhua@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/yueshuhua/zh_CN/index.htm",
    directions: ["医学图像分析", "计算机辅助诊断(CAD)", "医学AI"],
    category: "医学影像/成像",
    highlight: "计算机辅助诊断与医学图像分析；AI辅助诊断系统",
    pubLevel: "SCI期刊",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "医疗AI/CAD赛道目前最热，推想科技、数坤科技、深睿医疗等均大量招募；北航硕士在此方向有强竞争力",
    tags: ["医疗AI", "CAD", "就业前景极佳"]
  },
  {
    id: 17,
    school: "生物与医学工程学院",
    name: "丁立",
    title: "教授",
    isMasterSupervisor: true,
    email: "dingli@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/dingli/zh_CN/index.htm",
    directions: ["生物光子学", "激光医疗", "光动力治疗"],
    category: "光学成像",
    highlight: "激光与生物光子学；光动力治疗技术",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "光动力治疗方向偏学术，就业可去医疗设备公司或激光医疗相关企业",
    tags: ["激光医疗", "光子学"]
  },
  {
    id: 18,
    school: "生物与医学工程学院",
    name: "郑丽沙",
    title: "教授",
    isMasterSupervisor: true,
    email: "zhenglisha@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/zhenglisha/zh_CN/index.htm",
    directions: ["康复工程", "运动功能评价", "外骨骼机器人"],
    category: "医疗器械/智能医疗",
    highlight: "康复工程与外骨骼机器人；运动功能评估系统",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "康复机器人/外骨骼是医疗器械新兴方向，傅利叶智能、大艾机器人等需求旺盛",
    tags: ["外骨骼", "康复机器人", "医疗器械"]
  },
  {
    id: 19,
    school: "生物与医学工程学院",
    name: "刘涛",
    title: "教授",
    isMasterSupervisor: true,
    email: "TaoLiu@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/TaoLiu/zh_CN/index.htm",
    directions: ["生物医学信号处理", "肌电信号分析", "假肢控制"],
    category: "医学信号处理",
    highlight: "肌电信号处理与假肢控制；运动意图解码",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "肌电/假肢控制属于神经接口工程，方向与脑机接口类似，可去康复器械或BCI公司",
    tags: ["肌电信号", "假肢控制", "神经接口"]
  },
  {
    id: 20,
    school: "生物与医学工程学院",
    name: "李萍",
    title: "教授",
    isMasterSupervisor: true,
    email: "liping@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/liping/zh_CN/index.htm",
    directions: ["生物信息学", "基因组数据分析", "计算生物学"],
    category: "生物信息/基因组",
    highlight: "生物信息学与基因组分析；计算生物学方法",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "生物信息学就业广：华大基因、贝瑞基因、燃石医学等基因公司，以及各类生物技术企业均有需求",
    tags: ["生物信息学", "基因组学"]
  },
  {
    id: 21,
    school: "生物与医学工程学院",
    name: "刘肖",
    title: "教授",
    isMasterSupervisor: true,
    email: "liuxiao@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/liuxiao/zh_CN/index.htm",
    directions: ["医学图像重建", "CT/MRI图像重建算法", "计算成像"],
    category: "医学影像/成像",
    highlight: "医学图像重建算法研究；CT/MRI重建",
    pubLevel: "SCI期刊",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "CT/MRI图像重建算法是联影医疗、西门子等重度需求方向，高薪岗位多",
    tags: ["CT重建", "MRI重建", "算法"]
  },
  {
    id: 22,
    school: "生物与医学工程学院",
    name: "王丽珍",
    title: "教授",
    isMasterSupervisor: true,
    email: "wanglizhen@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/wanglizhen/zh_CN/index.htm",
    directions: ["生物医学纳米技术", "药物递送", "纳米探针"],
    category: "其他（接近排除方向）",
    highlight: "纳米技术用于药物递送与诊断；纳米探针合成",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "⚠️ 偏纳米材料/药物递送方向，与生物材料有交叉，请根据兴趣判断",
    tags: ["⚠️近排除方向", "纳米技术"]
  },
  {
    id: 23,
    school: "生物与医学工程学院",
    name: "李晓明",
    title: "教授",
    isMasterSupervisor: true,
    email: "lixiaoming@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/lixiaoming/zh_CN/index.htm",
    directions: ["生物医学信号处理", "医学大数据分析", "心脏信号处理"],
    category: "医学信号处理",
    highlight: "医学信号与大数据分析；心脏电生理信号",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "心脏信号处理方向对接医疗AI和心脏器械（心电图机、心脏监护仪等）就业",
    tags: ["医学信号", "心脏信号", "大数据"]
  },
  {
    id: 24,
    school: "生物与医学工程学院",
    name: "王晓飞",
    title: "教授",
    isMasterSupervisor: true,
    email: "xiaofei.wang@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/wangxiaofei/zh_CN/index.htm",
    directions: ["计算力学", "生物软物质力学", "血管力学"],
    category: "其他（接近排除方向）",
    highlight: "新南威尔士大学工程博士；主要从事软物质力学研究",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "⚠️ 属于生物力学/计算力学方向，与用户排除方向重合，慎重考虑",
    tags: ["⚠️近排除方向", "生物力学"]
  },

  // ============ 医学科学与工程学院 (医工) ============
  {
    id: 25,
    school: "医学科学与工程学院",
    name: "唐振超",
    title: "副教授",
    isMasterSupervisor: true,
    email: "tangzhenchao@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/tangzhenchao1/zh_CN/index.htm",
    directions: ["医学影像AI", "心血管精准诊疗", "影像组学", "AI辅助诊断"],
    category: "医学影像/AI",
    highlight: "中国科协第九届青年托举人才；心血管智慧诊疗北京市工程研究中心副主任（总投资3886万）；发表于Circulation-Cardiovascular Imaging、European Radiology等顶级临床期刊",
    pubLevel: "Circulation-Cardiovascular Imaging级别",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "强烈推荐！医疗AI+心血管的完美结合，就业出口极好（推想科技、数坤、腾讯医疗健康等均要此方向）；导师年轻、在北京工程研究中心担任要职，资源丰富",
    tags: ["医疗AI", "心血管", "青年托举", "就业极佳"]
  },
  {
    id: 26,
    school: "医学科学与工程学院",
    name: "牟玮",
    title: "教授",
    isMasterSupervisor: true,
    email: "weimu@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/muwei/zh_CN/index.htm",
    directions: ["医学影像AI", "深度学习", "模式识别", "图像分割"],
    category: "医学影像/AI",
    highlight: "国家自然科学基金优秀青年科学基金（海外）获得者；中科院自动化所博士，2023年晋升教授；研究产科超声、心血管影像AI，顶级期刊发表",
    pubLevel: "MICCAI/MedIA/IEEE TMI级别",
    jobMarket: 5,
    academicLevel: 5,
    prolongRisk: "中",
    notes: "医学影像AI方向的青年大牛，国家级优青（海外）支撑下课题组经费充足；适合想深耕AI+医疗的同学，老师在国内外影响力大，学生发展空间好",
    tags: ["国家优青", "医疗AI", "深度学习", "强推"]
  },
  {
    id: 27,
    school: "医学科学与工程学院",
    name: "王硕",
    title: "教授",
    isMasterSupervisor: true,
    email: "shuo_wang@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/wang_shuo/zh_CN/index.htm",
    directions: ["医学AI", "人体姿态估计", "医学图像分析", "手术机器人感知"],
    category: "医学影像/AI",
    highlight: "中科院自动化所博士；2025年晋升教授；主持国重研发计划、国自然等项目；AI for Medicine方向",
    pubLevel: "AAAI/MICCAI级别",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "年轻教授，活跃在医疗AI前沿，就业出口好；课题组规模适中，导师精力专注",
    tags: ["医疗AI", "计算机视觉", "就业极佳"]
  },
  {
    id: 28,
    school: "医学科学与工程学院",
    name: "王杨",
    title: "副教授",
    isMasterSupervisor: true,
    email: "wangyang2022@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/wangyang2022/zh_CN/index.htm",
    directions: ["微流控芯片", "MEMS生物传感器", "POCT体外诊断", "器官芯片"],
    category: "生物传感/微流控",
    highlight: "国家高层次青年人才；中科院空天院博士+英国格拉斯哥大学联培（Jonathan Cooper院士课题组）；主持国重研发计划子课题、国自然重点等",
    pubLevel: "Advanced Materials/Lab on Chip级别",
    jobMarket: 4,
    academicLevel: 5,
    prolongRisk: "中",
    notes: "微流控+POCT是体外诊断未来方向，适合去IVD公司（圣湘生物、华大基因、亚辉龙等）或初创公司；老师是国家高层次人才，资源丰富",
    tags: ["国家高层次人才", "微流控", "POCT", "IVD"]
  },
  {
    id: 29,
    school: "医学科学与工程学院",
    name: "刘建刚",
    title: "教授",
    isMasterSupervisor: true,
    email: "jgliu@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/jgliu/zh_CN/index.htm",
    directions: ["医学图像分析", "深度学习", "视网膜眼底影像AI", "眼科AI"],
    category: "医学影像/AI",
    highlight: "眼科AI与医学图像分析；从北京交通大学副教授转聘北航教授；主持国自然、北京市基金项目",
    pubLevel: "IEEE TMI/MedIA级别",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "眼科AI是医疗AI中商业化最好的子方向（Airdoc、鹰眼医疗、Zeiss均需要此方向人才）；就业前景极佳",
    tags: ["眼科AI", "医疗AI", "就业极佳"]
  },
  {
    id: 30,
    school: "医学科学与工程学院",
    name: "赵雁雨",
    title: "副教授",
    isMasterSupervisor: true,
    email: "yanyuzhao@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/yanyuz/zh_CN/index.htm",
    directions: ["光声成像", "超声成像", "生物光学", "医学光学成像"],
    category: "光学成像",
    highlight: "波士顿大学生医工博士（最佳博士论文）；加州理工学院博士后；光声成像领域青年学者；发表于多家顶级期刊",
    pubLevel: "Science Advances/Advanced Photonics级别",
    jobMarket: 4,
    academicLevel: 5,
    prolongRisk: "低",
    notes: "光声成像是新型医学成像热点，Caltech博后背景学术实力强；适合喜欢器件研发+医疗应用的同学",
    tags: ["光声成像", "加州理工博后", "青年学者"]
  },
  {
    id: 31,
    school: "医学科学与工程学院",
    name: "叶盛",
    title: "特聘研究员",
    isMasterSupervisor: true,
    email: "yesheng@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/yesheng/zh_CN/index.htm",
    directions: ["癌症转移分子机制", "病毒-宿主相互作用", "蛋白质从头设计", "药物研发"],
    category: "基础医学/分子机制",
    highlight: "癌症生物学与蛋白质设计领域；重大疾病分子机制研究；人工蛋白质库构建",
    pubLevel: "Nature系列/Cell子刊级别",
    jobMarket: 3,
    academicLevel: 5,
    prolongRisk: "高",
    notes: "纯基础研究，学术水平极高但就业偏向学术界；若有志读博或进生物制药公司研发部门可考虑；硕士阶段延毕风险相对高",
    tags: ["基础研究", "蛋白质设计", "学术精英"]
  },
  {
    id: 32,
    school: "医学科学与工程学院",
    name: "贺子龙",
    title: "副研究员",
    isMasterSupervisor: true,
    email: "hezilong@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/koheallen0828/zh_CN/index.htm",
    directions: ["宏基因组学", "微生物组学", "生物信息学", "肠道微生物与疾病"],
    category: "生物信息/基因组",
    highlight: "中科院北京基因组研究所博士；中科院微生物所博士后；微生物组与疾病关系研究；医工百人入选",
    pubLevel: "Gut Microbes/Nature Communications级别",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "微生物组学方向朝阳产业，华大基因、诺禾致源、微医等均有需求；生物信息学技能通用性强",
    tags: ["微生物组学", "生物信息学", "宏基因组"]
  },
  {
    id: 33,
    school: "医学科学与工程学院",
    name: "林绪波",
    title: "副教授",
    isMasterSupervisor: true,
    email: "linxbseu@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/linxubo/zh_CN/index.htm",
    directions: ["磁共振成像(MRI)", "磁粒子成像(MPI)", "生物电子器件", "传感器"],
    category: "医学影像/成像",
    highlight: "东南大学硕博连读；MRI/MPI两大成像方向；生物传感器研究；入选北航青拔",
    pubLevel: "IEEE TMI/Medical Physics级别",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "MRI是医疗器械大赛道，联影医疗、西门子等均高薪招募；MPI是新兴成像方向有潜力",
    tags: ["MRI", "MPI", "生物传感"]
  },
  {
    id: 34,
    school: "医学科学与工程学院",
    name: "刘卓",
    title: "副教授",
    isMasterSupervisor: true,
    email: "liuzhuo@buaa.edu.cn",
    homepage: "http://shi.buaa.edu.cn/liuzhuo/zh_CN/index.htm",
    directions: ["植入式生物电子器件", "心血管介入器件", "神经接口电极", "柔性电子"],
    category: "医疗器械/智能医疗",
    highlight: "北航生医工博士；计算机学院博士后转至医工学院；植入式/柔性电子器件研发；主持国自然",
    pubLevel: "Advanced Functional Materials/ACS Nano级别",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "植入式器械方向有很强产业应用场景（心脏起搏器、神经刺激器等），适合去医疗器械研发端",
    tags: ["植入式器件", "柔性电子", "心血管器械"]
  },
  {
    id: 35,
    school: "医学科学与工程学院",
    name: "郭江真",
    title: "副教授",
    isMasterSupervisor: true,
    email: "jzguo@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/jzguo/zh_CN/index.htm",
    directions: ["手术机器人", "医疗机器人", "机器人视觉感知", "微创手术"],
    category: "医疗器械/智能医疗",
    highlight: "北航机械工程博士；Johns Hopkins大学LCSR实验室联培；手术机器人与微创手术领域；主持国自然",
    pubLevel: "IJRR/IEEE T-RO/MedIA级别",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "强烈推荐！手术机器人是最热医疗器械方向，微创医疗机器人（术锐、精锋、键嘉等）均需大量人才，且薪资高；JHU背景课题组技术有竞争力",
    tags: ["手术机器人", "JHU联培", "就业极佳", "强推"]
  },
  {
    id: 36,
    school: "医学科学与工程学院",
    name: "陶春静",
    title: "教授",
    isMasterSupervisor: true,
    email: "chunjingtao@buaa.edu.cn",
    homepage: "http://shi.buaa.edu.cn/taochunjing/zh_CN/index.htm",
    directions: ["康复工程", "辅助技术", "智能假肢", "残障辅助技术"],
    category: "医疗器械/智能医疗",
    highlight: "国家康复辅具研究中心教授级高工转北航；中科院电工所博士；主持国自然多项；副院长",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "康复工程方向，国家残障辅助政策支持；适合去国家康复辅具研究中心、大艾机器人等单位",
    tags: ["康复工程", "辅助技术", "副院长"]
  },
  {
    id: 37,
    school: "医学科学与工程学院",
    name: "任韦燕",
    title: "副教授",
    isMasterSupervisor: true,
    email: "renweiyan@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/renweiyan/zh_CN/index.htm",
    directions: ["康复工程", "步态分析", "运动功能评估", "外骨骼控制"],
    category: "医疗器械/智能医疗",
    highlight: "北航生医工博士；伊利诺伊大学香槟分校访问（康复工程方向）；从事运动功能评估和外骨骼控制研究",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "康复工程方向，外骨骼机器人产业正在快速发展；适合有意去康复/助残行业的同学",
    tags: ["康复工程", "外骨骼"]
  },
  {
    id: 38,
    school: "医学科学与工程学院",
    name: "程健",
    title: "副研究员",
    isMasterSupervisor: true,
    email: "chenjian@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/jinping2/zh_CN/index.htm",
    directions: ["医学图像分析AI", "深度学习", "计算机视觉", "影像组学"],
    category: "医学影像/AI",
    highlight: "哈尔滨工业大学+中科院自动化所+法国INRIA联合培养博士；大数据精准医疗高精尖中心；医工百人",
    pubLevel: "IEEE TPAMI/TMI级别",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "AI for医学影像的重要方向，就业极佳；法国INRIA背景有助于接触前沿算法",
    tags: ["医疗AI", "深度学习", "高精尖中心"]
  },
  {
    id: 39,
    school: "医学科学与工程学院",
    name: "安羽",
    title: "副研究员",
    isMasterSupervisor: true,
    email: "yuan1989@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/anyu/zh_CN/index.htm",
    directions: ["医学影像AI", "医疗大数据", "精准医疗", "图神经网络"],
    category: "医学影像/AI",
    highlight: "北京交通大学计算机博士；大数据精准医疗高精尖创新中心；医工百人入选；主持国自然",
    pubLevel: "SCI期刊",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "医学大数据+AI，精准医疗方向，就业面宽；高精尖中心背景资源好",
    tags: ["医疗AI", "精准医疗", "大数据"]
  },
  {
    id: 40,
    school: "医学科学与工程学院",
    name: "钟江宏",
    title: "副教授",
    isMasterSupervisor: true,
    email: "jzhong@buaa.edu.cn",
    homepage: "http://shi.buaa.edu.cn/jzhong/zh_CN/index.htm",
    directions: ["免疫学", "AI辅助药物研发", "单细胞分析", "生物信息学"],
    category: "生物信息/基因组",
    highlight: "瑞典卡罗林斯卡医学院免疫学博士（2019年）；中科院自动化所+北京交通大学背景；大数据精准医疗中心",
    pubLevel: "Nature Medicine/Immunity级别",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "免疫学+AI+生物信息学的交叉方向，生物制药公司（阿斯利康、BMS、信达生物等）均有需求",
    tags: ["免疫学", "AI药物研发", "卡罗林斯卡"]
  },
  {
    id: 41,
    school: "医学科学与工程学院",
    name: "王迪",
    title: "助理教授",
    isMasterSupervisor: true,
    email: "wangdi09@126.com",
    homepage: "https://shi.buaa.edu.cn/wangdi/zh_CN/index.htm",
    directions: ["脑电图(EEG)", "癫痫与神经调控", "脑功能分析", "认知神经科学"],
    category: "神经工程/BCI",
    highlight: "国际抗癫痫联盟青年组委员；北京神经科学学会委员；主持国自然；联合培养来自癫痫诊疗临床方向",
    pubLevel: "IEEE TNSRE/Clinical Neurophysiology级别",
    jobMarket: 4,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "脑电/神经调控有强就业，尤其在BCI公司（脑陆科技、强脑科技等）和神经科医疗器械；导师年轻态度积极",
    tags: ["脑电", "癫痫", "神经调控", "BCI"]
  },
  {
    id: 42,
    school: "医学科学与工程学院",
    name: "史微",
    title: "副教授",
    isMasterSupervisor: true,
    email: "shiweilab@buaa.edu.cn",
    homepage: "http://shi.buaa.edu.cn/shiweilucy/zh_CN/index.htm",
    directions: ["神经环路", "情绪记忆编码", "癫痫神经调控", "细胞外基质"],
    category: "神经工程/BCI",
    highlight: "基础神经科学研究；情绪记忆神经环路机制；神经电生理与AI结合",
    pubLevel: "Neuron/eLife级别",
    jobMarket: 2,
    academicLevel: 4,
    prolongRisk: "高",
    notes: "偏基础神经科学，学术前景好但就业偏学术；硕士阶段延毕风险相对较高（基础科学出成果难）",
    tags: ["基础神经科学", "偏学术"]
  },
  {
    id: 43,
    school: "医学科学与工程学院",
    name: "周炳",
    title: "副教授",
    isMasterSupervisor: true,
    email: "bingzh@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/zhoubing/zh_CN/index.htm",
    directions: ["神经退行性疾病", "脑卒中", "线粒体与神经保护", "微流控神经模型"],
    category: "神经工程/BCI",
    highlight: "神经保护机制研究；线粒体/溶酶体功能；工程化微流控神经模型；多中心合作",
    pubLevel: "Journal of Neuroscience/Nature Communications级别",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "中",
    notes: "阿尔茨海默症/帕金森领域有制药公司需求，但偏基础；医工结合部分（微流控神经模型）较有产业应用前景",
    tags: ["神经退行性疾病", "脑卒中", "微流控"]
  },
  {
    id: 44,
    school: "医学科学与工程学院",
    name: "张泽宇",
    title: "副教授",
    isMasterSupervisor: true,
    email: "zhang_zeyu@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/zhangzeyubme/zh_CN/index.htm",
    directions: ["生物信息学", "生物医学数据挖掘", "疾病预测模型", "医学AI"],
    category: "生物信息/基因组",
    highlight: "西南大学计算机+西电生物信息双背景博士；主持国自然；医学数据+AI方向",
    pubLevel: "Bioinformatics/BMC Bioinformatics级别",
    jobMarket: 4,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "生物信息学技能通用性强，就业面广；医学AI应用方向适合去医疗健康数据公司",
    tags: ["生物信息学", "医学AI", "数据挖掘"]
  },
  {
    id: 45,
    school: "医学科学与工程学院",
    name: "胡贵平",
    title: "副教授",
    isMasterSupervisor: true,
    email: "hu_hgp@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/hgpbh2019/zh_CN/index.htm",
    directions: ["医学图像分析", "环境健康大数据", "AI辅助诊断", "深度学习"],
    category: "医学影像/AI",
    highlight: "北航青年拔尖人才计划；在Environmental S&T、Medical Image Analysis等期刊发表40篇；主持国自然面上、青年项目",
    pubLevel: "Medical Image Analysis/Environmental S&T级别",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "医学图像AI方向就业好；青年拔尖人才说明学校对其认可度高，经费稳定",
    tags: ["医疗AI", "北航拔尖", "图像分析"]
  },
  {
    id: 46,
    school: "医学科学与工程学院",
    name: "付博",
    title: "博士生导师（医工百人）",
    isMasterSupervisor: true,
    email: "fubo10@buaa.edu.cn",
    homepage: "http://shi.buaa.edu.cn/bofu/zh_CN/index.htm",
    directions: ["光纤传感", "超快激光", "医学光子学", "可穿戴光传感"],
    category: "光学成像",
    highlight: "清华大学精密仪器博士（杨昌喜导师）；芬兰阿尔托大学联培；大数据精准医疗高精尖中心；国自然面上、青年项目",
    pubLevel: "光学顶级期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "光纤传感在医疗监测（血压、呼吸等可穿戴）有应用，但就业偏专业化；适合光学背景同学",
    tags: ["光纤传感", "医学光子学", "清华博士"]
  },
  {
    id: 47,
    school: "医学科学与工程学院",
    name: "刘超",
    title: "副教授",
    isMasterSupervisor: true,
    email: "liuchaobuaa@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/proteomics/zh_CN/index.htm",
    directions: ["蛋白质组学", "计算生物学", "质谱数据分析", "生物大数据"],
    category: "生物信息/基因组",
    highlight: "中科院计算技术研究所博士；蛋白质组学计算分析；大数据精准医疗高精尖中心",
    pubLevel: "Journal of Proteome Research/Molecular & Cellular Proteomics级别",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "蛋白质组学方向适合去生物制药CRO公司、质谱仪器公司（沃特世、赛默飞等）",
    tags: ["蛋白质组学", "计算生物学", "质谱"]
  },
  {
    id: 48,
    school: "医学科学与工程学院",
    name: "张靖",
    title: "教授",
    isMasterSupervisor: true,
    email: "jz2716@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/jz2716/zh_CN/index.htm",
    directions: ["医学图像分析", "智能医学决策", "影像组学", "临床AI系统"],
    category: "医学影像/AI",
    highlight: "中科院自动化所控制科学博士；从北京交通大学转至北航；主持国自然、北京市基金项目；医学影像智能分析",
    pubLevel: "SCI期刊",
    jobMarket: 5,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "医疗AI就业极佳；经验丰富，课题组稳定",
    tags: ["医疗AI", "影像组学", "临床决策"]
  },
  {
    id: 49,
    school: "医学科学与工程学院",
    name: "关鑫宇",
    title: "副教授",
    isMasterSupervisor: true,
    email: "guanxinyu@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/guanxinyu/zh_CN/index.htm",
    directions: ["人机工效学", "生物医学器械设计", "可穿戴医疗设备", "人体运动分析"],
    category: "医疗器械/智能医疗",
    highlight: "清华机械工程博士；荷兰代尔夫特+英国邓迪联培；人机交互与医疗器械设计；主持国自然",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "人机工效学在可穿戴医疗设备设计中有应用；就业方向广但需要结合具体方向判断",
    tags: ["人机工效", "可穿戴设备", "清华博士"]
  },
  {
    id: 50,
    school: "医学科学与工程学院",
    name: "尹朋",
    title: "副教授",
    isMasterSupervisor: true,
    email: "PengYin@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/yinpeng/zh_CN/index.htm",
    directions: ["免疫工程", "肿瘤免疫治疗", "免疫细胞信号通路"],
    category: "基础医学/分子机制",
    highlight: "以第一或通讯作者在Nature Immunology（IF 30.5）发表；申报/授权专利10余项；成果转化3500万元；主持国重研发计划子课题",
    pubLevel: "Nature Immunology级别",
    jobMarket: 4,
    academicLevel: 5,
    prolongRisk: "高",
    notes: "Nature Immunology说明学术水平顶级；3500万转化说明有产业应用潜力；就业可去生物制药（PD-1/细胞治疗方向）；但硕士阶段延毕风险较高",
    tags: ["Nature Immunology", "免疫治疗", "成果转化强"]
  },
  {
    id: 51,
    school: "医学科学与工程学院",
    name: "刘子钰",
    title: "副教授",
    isMasterSupervisor: true,
    email: "liu_ziyu@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/liu_ziyu/zh_CN/index.htm",
    directions: ["微创外科介入器械", "智慧养老健康工程", "人机工效", "可穿戴诊断"],
    category: "医疗器械/智能医疗",
    highlight: "北航本科→麦吉尔/剑桥交流→伦敦大学学院(UCL)生物医学博士；微创手术器械与智慧养老健康工程；欧盟绿色技术联合研究中心成员",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "UCL博士+欧盟研究中心背景，国际视野强；微创手术器械方向商业化好，适合去外科器械公司",
    tags: ["UCL博士", "微创手术", "智慧养老", "欧盟"]
  },
  {
    id: 52,
    school: "医学科学与工程学院",
    name: "孙旭阳",
    title: "副教授",
    isMasterSupervisor: true,
    email: "sunxuy@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/sunxuyang/zh_CN/index.htm",
    directions: ["低温生物学", "器官保存技术", "低温冷冻技术", "组织工程支撑"],
    category: "医疗器械/智能医疗",
    highlight: "清华大学生医工博士；中科院理化技术研究所低温生物实验室博士后；器官保存与低温生物技术",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "低温生物学和器官保存是医学工程特色方向，适合去器官运输保存相关企业或医院中心",
    tags: ["低温生物学", "器官保存", "清华博士"]
  },
  {
    id: 53,
    school: "医学科学与工程学院",
    name: "李建超",
    title: "副教授",
    isMasterSupervisor: true,
    email: "lijianchao@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/lijianchao/zh_CN/index.htm",
    directions: ["心脏电生理", "血流动力学", "心肺康复", "心脏检测设备"],
    category: "医疗器械/智能医疗",
    highlight: "复旦大学+北航硕博背景；医疗器械企业与心血管专科医院工作经历；心脏电生理设备研发",
    pubLevel: "SCI期刊",
    jobMarket: 4,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "有工业背景，心脏电生理设备是成熟大赛道（强生、美敦力、微创医疗等），就业路径清晰",
    tags: ["心脏电生理", "医疗器械背景", "工业经验"]
  },
  {
    id: 54,
    school: "医学科学与工程学院",
    name: "杨超娟",
    title: "副教授",
    isMasterSupervisor: true,
    email: "chaojuany@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/chaojuany/zh_CN/index.htm",
    directions: ["神经生物学", "神经行为学", "神经退行性疾病模型"],
    category: "神经工程/BCI",
    highlight: "北京大学生物学（神经生物学）博士（张晨组）；北京大学博士后；准聘副教授",
    pubLevel: "Developmental Cell/PNAS级别",
    jobMarket: 2,
    academicLevel: 4,
    prolongRisk: "高",
    notes: "偏基础神经生物学，学术路线更适合，就业偏向学术或生物制药研发；硕士延毕风险高",
    tags: ["基础神经科学", "北大博士", "偏学术"]
  },
  {
    id: 55,
    school: "医学科学与工程学院",
    name: "王雪林",
    title: "助理教授",
    isMasterSupervisor: true,
    email: "wangxuelin@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/wangxuelin/zh_CN/index.htm",
    directions: ["低熔点液态金属", "柔性电子", "可穿戴医疗传感器", "热敏材料"],
    category: "医疗器械/智能医疗",
    highlight: "清华大学生医工博士（刘静导师）；斯坦福大学化学工程联培（鲍哲南院士导师）；液态金属柔性电子领域；主持国自然",
    pubLevel: "Advanced Materials/Science Advances级别",
    jobMarket: 4,
    academicLevel: 5,
    prolongRisk: "低",
    notes: "斯坦福+清华背景极强，柔性电子是穿戴医疗器械未来方向；适合想做前沿器件的同学，就业偏高端岗位",
    tags: ["斯坦福联培", "柔性电子", "液态金属", "顶级背景"]
  },
  {
    id: 56,
    school: "医学科学与工程学院",
    name: "马青川",
    title: "副教授",
    isMasterSupervisor: true,
    email: "maqingchuan@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/maqingchuan/zh_CN/index.htm",
    directions: ["软体机器人", "微纳机器人", "医学微型机器人", "智能材料驱动"],
    category: "医疗器械/智能医疗",
    highlight: "清华大学博士（德国亚琛联培）；日本东京大学博士后+特任助教；医疗微机器人方向",
    pubLevel: "Science Robotics/Advanced Materials级别",
    jobMarket: 4,
    academicLevel: 5,
    prolongRisk: "低",
    notes: "软体/微纳医疗机器人是前沿热点，未来内窥镜机器人、靶向药物输送等均有应用；清华+东大背景强",
    tags: ["微纳机器人", "软体机器人", "东京大学博后"]
  },
  {
    id: 57,
    school: "医学科学与工程学院",
    name: "郑钰山",
    title: "副教授",
    isMasterSupervisor: true,
    email: "yszheng@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/zhengyushan/zh_CN/index.htm",
    directions: ["生物力学仿真", "心血管支架力学", "力学-生物耦合"],
    category: "其他（接近排除方向）",
    highlight: "北航宇航学院博士；北航博士后；主持国自然青年项目",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "⚠️ 属于生物力学方向（心血管支架力学仿真），与用户排除方向重合，慎重考虑",
    tags: ["⚠️近排除方向", "生物力学"]
  },
  {
    id: 58,
    school: "医学科学与工程学院",
    name: "张大可",
    title: "副教授",
    isMasterSupervisor: true,
    email: "dakezhang@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/dakezhang/zh_CN/index.htm",
    directions: ["基因组学", "遗传学", "精准医学", "表观遗传"],
    category: "生物信息/基因组",
    highlight: "中科院北京基因组研究所遗传学博士；从事精准医学基因组研究多年；主持国自然",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 4,
    prolongRisk: "低",
    notes: "基因组学方向适合去基因检测公司（华大、诺禾致源、贝瑞等）或临床研究机构",
    tags: ["基因组学", "精准医学", "遗传学"]
  },
  {
    id: 59,
    school: "医学科学与工程学院",
    name: "陈珣",
    title: "助理教授",
    isMasterSupervisor: true,
    email: "chenxun2007@buaa.edu.cn",
    homepage: "https://shi.buaa.edu.cn/chenxun/zh_CN/index.htm",
    directions: ["生物医学材料与界面", "生物传感器", "细胞-材料相互作用"],
    category: "其他（接近排除方向）",
    highlight: "美国克莱姆森大学生物医学工程博士；天津大学硕士；北航博士后；从事生物界面传感研究",
    pubLevel: "SCI期刊",
    jobMarket: 3,
    academicLevel: 3,
    prolongRisk: "低",
    notes: "⚠️ 主要方向涉及生物材料界面，与用户排除的生物材料方向有重叠",
    tags: ["⚠️近排除方向", "生物界面"]
  },
];

const categories = [
  "全部",
  "医学影像/AI",
  "神经工程/BCI",
  "生物传感/微流控",
  "医疗器械/智能医疗",
  "生物信息/基因组",
  "光学成像",
  "医学信号处理",
  "基础医学/分子机制",
  "其他（接近排除方向）"
];

const schools = ["全部", "生物与医学工程学院", "医学科学与工程学院"];

const jobColors = {
  5: { bg: "#EAF3DE", text: "#3B6D11", label: "极佳 ★★★★★" },
  4: { bg: "#E1F5EE", text: "#0F6E56", label: "良好 ★★★★" },
  3: { bg: "#FAEEDA", text: "#854F0B", label: "一般 ★★★" },
  2: { bg: "#FAECE7", text: "#993C1D", label: "偏弱 ★★" },
  1: { bg: "#FCEBEB", text: "#A32D2D", label: "弱 ★" },
};

const prolongColors = {
  "低": { bg: "#EAF3DE", text: "#3B6D11" },
  "中": { bg: "#FAEEDA", text: "#854F0B" },
  "高": { bg: "#FCEBEB", text: "#A32D2D" },
};

function StarRating({ value }) {
  return (
    <span style={{ color: value >= 4 ? "#3B6D11" : value === 3 ? "#854F0B" : "#A32D2D", fontWeight: 500 }}>
      {"★".repeat(value)}{"☆".repeat(5 - value)}
    </span>
  );
}

export default function App() {
  const [schoolFilter, setSchoolFilter] = useState("全部");
  const [catFilter, setCatFilter] = useState("全部");
  const [searchQ, setSearchQ] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState("jobMarket");
  const [showExcluded, setShowExcluded] = useState(false);
  const [activeTab, setActiveTab] = useState("database");

  const filtered = useMemo(() => {
    let data = supervisors;
    if (!showExcluded) data = data.filter(d => !d.tags.includes("⚠️近排除方向"));
    if (schoolFilter !== "全部") data = data.filter(d => d.school === schoolFilter);
    if (catFilter !== "全部") data = data.filter(d => d.category === catFilter);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      data = data.filter(d =>
        d.name.includes(q) ||
        d.directions.some(dir => dir.includes(q)) ||
        d.category.includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.notes.includes(q)
      );
    }
    if (sortBy === "jobMarket") data = [...data].sort((a, b) => b.jobMarket - a.jobMarket);
    if (sortBy === "academic") data = [...data].sort((a, b) => b.academicLevel - a.academicLevel);
    if (sortBy === "prolong") {
      const order = { "低": 0, "中": 1, "高": 2 };
      data = [...data].sort((a, b) => order[a.prolongRisk] - order[b.prolongRisk]);
    }
    if (sortBy === "school") data = [...data].sort((a, b) => a.school.localeCompare(b.school));
    return data;
  }, [schoolFilter, catFilter, searchQ, sortBy, showExcluded]);

  const topRecs = supervisors.filter(d => d.tags.includes("强推") || d.tags.includes("就业极佳")).slice(0, 8);

  const tabStyle = (tab) => ({
    padding: "8px 18px",
    borderRadius: "var(--border-radius-md)",
    border: activeTab === tab ? "0.5px solid var(--color-border-primary)" : "0.5px solid transparent",
    background: activeTab === tab ? "var(--color-background-primary)" : "transparent",
    color: activeTab === tab ? "var(--color-text-primary)" : "var(--color-text-secondary)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: activeTab === tab ? 500 : 400,
  });

  return (
    <div style={{ padding: "2rem 20px", maxWidth: 760, margin: "0 auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>北航生医两院硕导数据库</h2>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        生物与医学工程学院 · 医学科学与工程学院 · 共 {supervisors.filter(d => !d.tags.includes("⚠️近排除方向")).length} 位参考导师（已筛除细胞工程/生物材料/生物力学方向）
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: 12 }}>
        <button style={tabStyle("database")} onClick={() => setActiveTab("database")}>导师数据库</button>
        <button style={tabStyle("recs")} onClick={() => setActiveTab("recs")}>重点推荐</button>
        <button style={tabStyle("guide")} onClick={() => setActiveTab("guide")}>保研建议</button>
      </div>

      {activeTab === "database" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <input
              placeholder="搜索导师姓名/方向/关键词…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              style={{ gridColumn: "1 / -1" }}
            />
            <select value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}>
              {schools.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>排序：</span>
            {[["jobMarket","就业前景"],["academic","学术水平"],["prolong","延毕风险低→高"],["school","按学院"]].map(([key, label]) => (
              <button key={key} style={{ padding: "4px 12px", fontSize: 13, borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: sortBy === key ? "var(--color-background-secondary)" : "transparent", cursor: "pointer", color: "var(--color-text-primary)" }}
                onClick={() => setSortBy(key)}>{label}</button>
            ))}
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              <input type="checkbox" checked={showExcluded} onChange={e => setShowExcluded(e.target.checked)} />
              显示接近排除方向
            </label>
          </div>

          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12 }}>共 {filtered.length} 位导师</p>

          {filtered.map(s => (
            <div key={s.id} style={{ marginBottom: 10, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
              <div
                style={{ padding: "12px 16px", cursor: "pointer", background: "var(--color-background-primary)", display: "flex", gap: 12, alignItems: "flex-start" }}
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{s.name}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.title}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>{s.school.replace("学院","").replace("生物与医学工程","生医工").replace("医学科学与工程","医工")}</span>
                    {s.tags.filter(t => ["强推","国家青年人才","国家高层次人才","国家优青","就业极佳"].includes(t)).map(t => (
                      <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: "#E1F5EE", color: "#0F6E56" }}>{t}</span>
                    ))}
                    {s.tags.includes("⚠️近排除方向") && (
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: "#FAECE7", color: "#993C1D" }}>⚠️近排除方向</span>
                    )}
                  </div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {s.directions.slice(0, 3).map(d => (
                      <span key={d} style={{ fontSize: 12, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-tertiary)", color: "var(--color-text-secondary)" }}>{d}</span>
                    ))}
                    {s.directions.length > 3 && <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>+{s.directions.length - 3}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>就业</div>
                  <StarRating value={s.jobMarket} />
                  <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: prolongColors[s.prolongRisk].bg, color: prolongColors[s.prolongRisk].text }}>延毕风险{s.prolongRisk}</span>
                  </div>
                </div>
              </div>

              {expanded === s.id && (
                <div style={{ padding: "12px 16px", background: "var(--color-background-secondary)", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px", border: "0.5px solid var(--color-border-tertiary)" }}>
                      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>就业前景</p>
                      <StarRating value={s.jobMarket} />
                      <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "4px 0 0" }}>{jobColors[s.jobMarket].label}</p>
                    </div>
                    <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px", border: "0.5px solid var(--color-border-tertiary)" }}>
                      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>学术水平</p>
                      <StarRating value={s.academicLevel} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>亮点背景</p>
                    <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.6 }}>{s.highlight}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>论文水平</p>
                    <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0 }}>{s.pubLevel}</p>
                  </div>
                  <div style={{ marginBottom: 12, background: "var(--color-background-primary)", padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>综合分析与就业建议</p>
                    <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.7 }}>{s.notes}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>全部研究方向</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {s.directions.map(d => (
                        <span key={d} style={{ fontSize: 12, padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-tertiary)", color: "var(--color-text-secondary)" }}>{d}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <a href={`mailto:${s.email}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", textDecoration: "none", color: "var(--color-text-primary)", fontSize: 13 }}>
                      <i className="ti ti-mail" style={{ fontSize: 16 }} aria-hidden="true"></i>
                      {s.email}
                    </a>
                    <a href={s.homepage} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", textDecoration: "none", color: "var(--color-text-info)", fontSize: 13 }}>
                      <i className="ti ti-external-link" style={{ fontSize: 16 }} aria-hidden="true"></i>
                      官网主页
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {activeTab === "recs" && (
        <div>
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)" }}>
            <p style={{ fontWeight: 500, margin: "0 0 8px", fontSize: 15 }}>选导师核心原则（以就业为目标）</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 4px", lineHeight: 1.7 }}>
              优先考虑：①有产业化成果（专利+转化经历）②研究方向对口高薪公司（医疗AI/手术机器人/医疗器械）③导师科研经费充足（国重/国自然面上）④课题组规模不过大（硕士生一般每年1-3人较佳）
            </p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.7 }}>
              回避风险：①纯基础研究/偏学术导师（延毕概率更高）②大老板（学生多、关注少）③经费紧张的年轻助理教授（无面上项目）
            </p>
          </div>

          <p style={{ fontWeight: 500, marginBottom: 12 }}>重点推荐导师（就业导向）</p>

          {[
            { tier: "A级：强烈推荐", desc: "就业前景极佳 + 学术实力强 + 成果转化/产业对接好", ids: [25, 26, 35, 2, 1] },
            { tier: "B级：推荐", desc: "就业前景良好，方向商业化好，导师稳定", ids: [29, 27, 48, 16, 21, 10, 28, 38] },
            { tier: "C级：可考虑", desc: "就业尚可，适合特定兴趣，或学术强但就业一般", ids: [30, 51, 55, 56, 34, 53] },
          ].map(({ tier, desc, ids }) => (
            <div key={tier} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{tier}</p>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>{desc}</p>
              {supervisors.filter(s => ids.includes(s.id)).sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id)).map(s => (
                <div key={s.id} style={{ marginBottom: 8, padding: "10px 14px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.title} · {s.school.replace("生物与医学工程学院","10系").replace("医学科学与工程学院","医工")}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>{s.directions.slice(0, 3).join(" / ")}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.6 }}>{s.notes.substring(0, 80)}…</p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div style={{ fontSize: 12, marginBottom: 4 }}><StarRating value={s.jobMarket} /></div>
                    <a href={`mailto:${s.email}`} style={{ fontSize: 11, color: "var(--color-text-info)", textDecoration: "none" }}>{s.email}</a>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === "guide" && (
        <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--color-text-primary)" }}>
          {[
            {
              title: "保研时间线（2026年8月）",
              content: `现在至7月：通过邮件联系意向导师，提前套磁；发送个人简历+成果介绍（冯如杯一等奖一作是非常有竞争力的材料，务必突出）\n8月末：北航推免系统开放，各院系夏令营/预推免启动，需在系统中填报志愿\n9月-10月：推免结果公布，与导师最终确认`
            },
            {
              title: "套磁邮件要点",
              content: `主题：简短明了，如"北航10系本科推免申请-[你的名字]-冯如杯一等奖"\n内容要点：①简介自己（专业年级、GPA、冯如杯荣誉）②对导师具体研究方向表达兴趣（要体现读过他的论文）③说明自己匹配的技能（编程/实验技能）④附上简历PDF\n注意：分批发送，不要群发；发送后2-3天无回复可礼貌跟进一次`
            },
            {
              title: "就业方向与薪资参考（北航生医工硕士）",
              content: `医疗AI公司（推想科技、数坤科技、深睿医疗等）：15-25K/月，期权\n医疗器械大厂（联影医疗、迈瑞医疗、西门子医疗）：12-20K/月\n科技公司医疗部门（腾讯医疗健康、阿里健康、华为医疗）：20-35K/月\n手术机器人（微创医疗机器人、精锋医疗、术锐）：18-30K/月\n基因检测（华大基因、诺禾致源）：10-15K/月\n总体而言：北航生医工硕士在北京就业竞争力强，医疗AI方向薪资最高`
            },
            {
              title: "延毕风险防范",
              content: `高延毕风险信号：①纯基础研究方向②导师课题组学生超过10人/年③导师明显不关注学生进展④毕业要求文章档次过高（顶刊要求）\n低延毕风险信号：①有产业化项目驱动②导师有工业经历③毕业要求明确（1-2篇SCI）④课题组规模适中\n建议：套磁时委婉询问毕业要求（"请问您对硕士生的毕业论文有什么要求？"）；也可在导师主页查看已毕业学生去向和发表情况`
            },
            {
              title: "两院区别",
              content: `生物与医学工程学院（10系）：北航传统优势院系，建院早，教师资历深，平台稳；多在学院路校区；研究方向更全面\n医学科学与工程学院（医工）：2019年依托医工交叉创新研究院设立，新兴院系，导师多为海内外优秀青年人才，学术冲劲强，资金充沛；北航沙河校区（部分）；交叉属性更强`
            }
          ].map(({ title, content }) => (
            <div key={title} style={{ marginBottom: 20, padding: "14px 16px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-primary)" }}>
              <p style={{ fontWeight: 500, marginBottom: 8, fontSize: 15 }}>{title}</p>
              {content.split("\n").map((line, i) => (
                <p key={i} style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 4px", lineHeight: 1.7 }}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
