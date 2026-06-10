const BME_2015_PHD_LIST_URL = "https://bme.buaa.edu.cn/English/studentInfo.aspx?catID=271&curID=1843&subcatID=823";
const BME_GUO_SHUANGSHENG_URL = "https://bme.buaa.edu.cn/English/teacherInfo.aspx?catID=7&curID=263&subcatID=145";

// Minimal, source-backed supplements for BME records that cannot be matched
// to a unique BUAA teacher-home page automatically.
export const supervisorManualOverrides = {
  bme: {
    林嘉盈: {
      sourceUrl: BME_2015_PHD_LIST_URL,
      email: "chiayinglin@buaa.edu.cn",
      tags: ["博士生导师"],
    },
    张明: {
      sourceUrl: BME_2015_PHD_LIST_URL,
      email: "yubofan@buaa.edu.cn",
      tags: ["博士生导师"],
    },
    田伟: {
      sourceUrl: BME_2015_PHD_LIST_URL,
      email: "yubofan@buaa.edu.cn",
      tags: ["博士生导师"],
    },
    俞梦孙: {
      sourceUrl: BME_2015_PHD_LIST_URL,
      email: "yumengsun@263.net",
      tags: ["博士生导师"],
    },
    邱贵兴: {
      sourceUrl: BME_2015_PHD_LIST_URL,
      email: "yubofan@buaa.edu.cn",
      tags: ["博士生导师"],
    },
    郭双生: {
      officialUrl: BME_GUO_SHUANGSHENG_URL,
      profileUrl: BME_GUO_SHUANGSHENG_URL,
      sourceUrl: BME_GUO_SHUANGSHENG_URL,
      title: "研究员",
      email: "guoshuangsheng@tom.com",
      tags: ["博士生导师"],
    },
  },
  mse: {},
};
