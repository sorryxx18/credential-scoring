const AUDIT_UNITS = {
    "第一大隊": {
        "中正中隊": ["中正中隊", "華山分隊", "泉州分隊", "古亭分隊", "城中分隊", "忠孝分隊"],
        "萬華中隊": ["萬華中隊", "雙園分隊", "龍山分隊"],
        "文山中隊": ["文山中隊", "萬芳分隊", "景美分隊", "木柵分隊", "寶橋分隊"]
    },
    "第二大隊": {
        "大安中隊": ["大安中隊", "金華分隊", "復興分隊", "安和分隊"],
        "信義中隊": ["信義中隊", "信義分隊", "莊敬分隊", "永吉分隊"],
        "南港中隊": ["南港中隊", "南港分隊", "舊莊分隊", "成德分隊"]
    },
    "第三大隊": {
        "中山中隊": ["中山中隊", "大直分隊", "圓山分隊", "松江分隊", "建國分隊"],
        "松山中隊": ["松山中隊", "中崙分隊", "八德分隊"],
        "內湖中隊": ["內湖中隊", "民權分隊", "內湖分隊", "大湖分隊", "東湖分隊"]
    },
    "第四大隊": {
        "大同中隊": ["大同中隊", "建成分隊", "延平分隊", "大同分隊"],
        "士林中隊": ["士林中隊", "山仔后分隊", "天母分隊", "福安分隊", "社子分隊", "劍潭分隊", "雙溪分隊", "後港分隊"],
        "北投中隊": ["北投中隊", "陽明山分隊", "光明分隊", "關渡分隊", "石牌分隊", "秀山分隊"]
    }
};

const CONFIG = [
    { id: "water", title: "水上救生", items: [{ name: "救生員", score: 0.35, hasDate: true }, { name: "救生教練", score: 0.56, hasDate: false }] },
    { id: "swift", title: "急流救援", items: [{ name: "急流救援訓練(40小時)", score: 0.56, hasDate: false }, { name: "急流救援訓練教官班(45小時)", score: 0.70, hasDate: false }] },
    { id: "dive", title: "潛水救援", items: [{ name: "救援潛水", score: 0.56, hasDate: false }, { name: "潛水教官", score: 0.70, hasDate: false }, { name: "公共安全潛水(82小時)", score: 0.70, hasDate: false }] },
    { id: "rescue", title: "消防救助", items: [{ name: "救助隊訓練(320小時)", score: 1.05, hasDate: false, required: true }] },
    { id: "instr", title: "救助師資", items: [{ name: "救助隊師資班(240小時)", score: 0.84, hasDate: false }] },
    { id: "fire", title: "火災搶救", items: [{ name: "火災搶救初級班", score: 0, hasDate: false, required: true, noScore: true }, { name: "火災搶救教官班", score: 0.84, hasDate: false }] },
    { id: "drive", title: "車輛駕駛", items: [{ name: "大貨(客)車駕照", score: 0.70, hasDate: false, required: true }, { name: "聯結車駕照", score: 1.05, hasDate: false }] }
];

const REQUIRED_GROUPS = [
    {
        key: "rescue",
        label: "救助隊訓練(320小時)",
        options: [
            { categoryId: "rescue", name: "救助隊訓練(320小時)" }
        ]
    },
    {
        key: "fire",
        label: "火災搶救初級班",
        options: [
            { categoryId: "fire", name: "火災搶救初級班" }
        ]
    },
    {
        key: "drive",
        label: "車輛駕駛必要證照（大貨(客)車或聯結車）",
        options: [
            { categoryId: "drive", name: "大貨(客)車駕照" },
            { categoryId: "drive", name: "聯結車駕照" }
        ]
    }
];
