// --- 0. 模式選擇與過場控制 ---
let currentMode = ''; 

function selectMode(mode) {
    currentMode = mode;
    const transitionLayer = document.getElementById('black-transition');
    transitionLayer.style.opacity = '1';
    transitionLayer.style.pointerEvents = 'auto';

    setTimeout(() => {
        const titleEl = document.getElementById('start-title');
        const descEl = document.getElementById('start-desc');

        if (mode === 'nthu') {
            document.documentElement.style.setProperty('--bg-url', `url('images/wallpaper.png')`);
            titleEl.innerText = "清大外來種測驗";
            descEl.innerText = "測測看你是清大校園裡的哪種外來強勢物種？";
        } else if (mode === 'taiwan') {
            document.documentElement.style.setProperty('--bg-url', `url('images/台灣版全紅黑色調.png')`);
            titleEl.innerText = "台灣外來種測驗";
            descEl.innerText = "生存法則！測出你是台灣生態系中的哪種入侵者？";
        }

        hideAllScreens();
        document.getElementById('start-screen').style.display = 'block';

        transitionLayer.style.opacity = '0';
        setTimeout(() => { transitionLayer.style.pointerEvents = 'none'; }, 1000);
    }, 1000);
}

function resetToMode() {
    const transitionLayer = document.getElementById('black-transition');
    transitionLayer.style.opacity = '1';
    transitionLayer.style.pointerEvents = 'auto';

    setTimeout(() => {
        document.documentElement.style.setProperty('--bg-url', `url('images/Home_wallpaper.png')`);
        hideAllScreens();
        document.getElementById('mode-selection-screen').style.display = 'block';
        
        transitionLayer.style.opacity = '0';
        setTimeout(() => { transitionLayer.style.pointerEvents = 'none'; }, 1000);
    }, 1000);
}

function hideAllScreens() {
    const screens = ['mode-selection-screen', 'start-screen', 'quiz-screen', 'result-screen', 'about-screen', 'species-grid-screen', 'species-detail-screen'];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
}

// --- 1. 定義清大題庫 (6題) ---
const nthuQuestions = [
    { title: "在清大總圖找位子時，你更傾向於？", options: [ { text: "(A) 挑選視野好、人流多的開闊區，感覺比較有活力", axis: 'E', value: 1 }, { text: "(B) 找個牆角或隱蔽的單人位，低調不被打擾", axis: 'E', value: -1 } ] },
    { title: "聽說成功湖畔出現了一個「隱藏版景點」，你會？", options: [ { text: "(A) 充滿好奇，立刻查地圖或衝去現場看看到底是什麼", axis: 'S', value: 1 }, { text: "(B) 覺得沒差，等哪天路過再說，或者根本沒興趣", axis: 'S', value: -1 } ] },
    { title: "當你需要規劃一趟社團旅遊或小旅行時，你通常？", options: [ { text: "(A) 嚴格精算預算、接駁時間與每個景點的停留長度", axis: 'C', value: 1 }, { text: "(B) 大概抓個方向就出發，享受當下的驚喜感與彈性", axis: 'C', value: -1 } ] },
    { title: "在學校餐廳吃飯時，遇到不熟但認識的人，你的反應是？", options: [ { text: "(A) 大方打個招呼甚至併桌聊天，展現親和力", axis: 'E', value: 1 }, { text: "(B) 默默低頭滑手機或加快吃飯速度，避免尷尬對視", axis: 'E', value: -1 } ] },
    { title: "面對新的選修課或課外活動，你選擇的原因通常是？", options: [ { text: "(A) 題目很有趣、沒接觸過，想多學點不一樣的內容", axis: 'S', value: 1 }, { text: "(B) 老師很涼、聽說好過，或是原本就很熟悉的領域", axis: 'S', value: -1 } ] },
    { title: "當你的專題或作業遇到 Bug（錯誤）時，你的處理風格？", options: [ { text: "(A) 冷靜分析邏輯，調閱所有數據找出問題點", axis: 'C', value: 1 }, { text: "(B) 憑直覺亂改一通，或是先擺著等靈感出現", axis: 'C', value: -1 } ] }
];

// --- 2. 定義台灣題庫 (6題) ---
const taiwanQuestions = [
    { title: "當你進入一個全新的陌生環境，你的第一步是？", options: [ { text: "(A) 大方展現自己的實力，迅速佔領最佳資源", axis: 'E', value: 1 }, { text: "(B) 先躲在暗處觀察局勢，確認安全再行動", axis: 'E', value: -1 } ] },
    { title: "發現眼前有一種從沒見過的奇特食物，你會？", options: [ { text: "(A) 毫不猶豫先嚐一口，說不定是大補帖", axis: 'S', value: 1 }, { text: "(B) 觀察有沒有其他人吃過，保守為上", axis: 'S', value: -1 } ] },
    { title: "面對比你強大的競爭對手，你會如何應對？", options: [ { text: "(A) 仔細計算雙方弱點，擬定精密的作戰計畫", axis: 'C', value: 1 }, { text: "(B) 憑直覺和氣勢跟他拼了，或者直接隨機應變", axis: 'C', value: -1 } ] },
    { title: "如果要在一個團隊中生存，你傾向扮演什麼角色？", options: [ { text: "(A) 帶頭衝鋒的領袖，讓所有人都聽我的", axis: 'E', value: 1 }, { text: "(B) 默默做事的邊緣人，只要不被針對就好", axis: 'E', value: -1 } ] },
    { title: "你的領地附近突然出現了一條未知的小徑，你會？", options: [ { text: "(A) 每天擴張一點點，總有一天把那裡也變成我的", axis: 'S', value: 1 }, { text: "(B) 守好現在擁有的資源就好，外面風險太高", axis: 'S', value: -1 } ] },
    { title: "遭遇突發危機（例如棲地被破壞）時，你的反應是？", options: [ { text: "(A) 迅速盤點可用資源，有條理地轉移陣地", axis: 'C', value: 1 }, { text: "(B) 兵來將擋水來土掩，跟著本能逃生再說", axis: 'C', value: -1 } ] }
];

// --- 3. 備用題庫 ---
const nthuBackupQuestions = {
    E: { title: "看到校園路口發生小擦撞事故時，你的直覺反應是？", options: [ { text: "(A) 衝過去幫忙，詢問是否要報警", axis: 'E', value: 1 }, { text: "(B) 原地觀察局勢，確認有人處理再離開", axis: 'E', value: -1 } ] },
    S: { title: "如果你在學餐吃飯，看到系上朋友獨自坐在旁邊，你會？", options: [ { text: "(A) 主動走過去打個招呼，甚至問問能不能併桌", axis: 'S', value: 1 }, { text: "(B) 假裝沒看到，低頭快速吃完，不想尷尬對到眼", axis: 'S', value: -1 } ] },
    C: { title: "準備一場長途旅行前，你通常會如何處理行李？", options: [ { text: "(A) 提前幾天列好清單，精準分類收納每一件物品", axis: 'C', value: 1 }, { text: "(B) 出發前一晚隨手抓幾件衣服進包包，缺什麼再去買", axis: 'C', value: -1 } ] }
};

const taiwanBackupQuestions = {
    E: { title: "你的領地邊緣出現了其他未知物種的氣味，你會怎麼做？", options: [ { text: "(A) 循著氣味主動出擊，把潛在的威脅趕走", axis: 'E', value: 1 }, { text: "(B) 隱藏自己的行蹤，避免無謂的正面衝突", axis: 'E', value: -1 } ] },
    S: { title: "經過一場大雨，遠處傳來了未知的水聲，你會？", options: [ { text: "(A) 冒險前去一探究竟，說不定有新的資源", axis: 'S', value: 1 }, { text: "(B) 留在原本安全的棲地，不願冒未知風險", axis: 'S', value: -1 } ] },
    C: { title: "為了度過即將到來的嚴冬，你的生存策略是？", options: [ { text: "(A) 提前囤積食物，尋找最保暖的掩蔽處", axis: 'C', value: 1 }, { text: "(B) 減少活動量，順其自然憑本能撐過去", axis: 'C', value: -1 } ] }
};

// --- 4. 遊戲狀態控制 ---
let currentQ = 0;
let scores = { E: 0, S: 0, C: 0 }; 
let activeQuestions = []; 
let finalResultName = ''; // 紀錄測驗結果名稱，供跳轉圖鑑使用

function nextStep() {
    currentQ = 0;
    scores = { E: 0, S: 0, C: 0 }; 
    activeQuestions = currentMode === 'nthu' ? [...nthuQuestions] : [...taiwanQuestions];
    hideAllScreens();
    document.getElementById('quiz-screen').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const q = activeQuestions[currentQ];
    const container = document.getElementById('options-container');
    const questionNumber = currentQ + 1;
    document.getElementById('question-text').innerText = `Q${questionNumber}：${q.title}`;
    const progressPercent = (currentQ / activeQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = progressPercent + '%';
    container.innerHTML = ""; 

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt.text;
        btn.classList.add('option-btn'); 
        btn.onclick = () => handleAnswer(opt.axis, opt.value);
        container.appendChild(btn);
    });
}

function handleAnswer(axis, value) {
    scores[axis] += value; 
    currentQ++;
    if (currentQ === activeQuestions.length) checkAndAddBackupQuestions();
    if (currentQ < activeQuestions.length) showQuestion();
    else showResult();
}

function checkAndAddBackupQuestions() {
    const backups = currentMode === 'nthu' ? nthuBackupQuestions : taiwanBackupQuestions;
    if (scores.E === 0) activeQuestions.push(backups.E);
    if (scores.S === 0) activeQuestions.push(backups.S);
    if (scores.C === 0) activeQuestions.push(backups.C);
}

// --- 5. 清大結果資料庫 ---
const nthuResults = {
    "1_1_1": { 
        name: "家八哥", 
        detail: "💡 性格：喧賓奪主型\n📌 核心特徵：嗓門極大、膽大包天、強勢排外。\n🔎 偵查線索：喜歡在醒目的地方大聲喧嘩，讓原本的主人（本土八哥）尷尬到無處容身。\n💬 自白：「這棵樹挺漂亮的，但現在是我的了。至於原本住這的那位？誰在乎他去哪了。」" 
    },
    "1_1_-1": { 
        name: "狗", 
        detail: "💡 性格：街頭霸王型\n📌 核心特徵：成群結隊、領域意識極強、精力過剩。\n🔎 偵查線索：在特定區域有著絕對的影響力，對入侵者（不論生物或機車）有著謎樣的執著。\n💬 自白：「我只是在巡視我的街道。你要路過可以，但你跑得有我快嗎？」" 
    },
    "1_-1_1": { 
        name: "紅火蟻", 
        detail: "💡 性格：火爆傭兵型\n📌 核心特徵：極度護短、集體主義、無差別攻擊。\n🔎 偵查線索：只要觸碰到他的底線（蟻丘），他會立刻糾集所有戰友，給你最痛的教訓。\n💬 自白：「單挑？我們沒這種習慣。踏進我的地盤，你就準備好迎接一萬次刺痛的怒火。」" 
    },
    "1_-1_-1": { 
        name: "喜鵲", 
        detail: "💡 性格：成功上位型\n📌 核心特徵：高智商、適應力極強、形象經營大師。\n🔎 偵查線索：從外地來卻混得比本土種還好，甚至被視為吉祥的象徵，是外來種中的模範生。\n💬 自白：「外來種又怎樣？只要懂社交、會看臉色，清華大學的成功湖畔一樣是我的伸展台。」" 
    },
    "-1_1_1": { 
        name: "貓", 
        detail: "💡 性格：頂級刺客型\n📌 核心特徵：萌點滿滿、身手矯捷、精準捕殺。\n🔎 偵查線索：靠著可愛的外表獲得人類資源，轉身卻是野生動物最恐懼的噩夢。\n💬 自白：「看著我的眼睛，你真的捨得怪我嗎？我只是在練習如何優雅地終結生命。」" 
    },
    "-1_1_-1": { 
        name: "小花蔓澤蘭", 
        detail: "💡 性格：恐怖情人型\n📌 核心特徵：強烈的佔有慾、擴張速度極快、窒息式關懷。\n🔎 偵查線索：表面上綠意盎然，實際上被他盯上的目標都會因為「密不透風的愛」而枯萎。\n💬 自白：「我只是想緊緊抱住你，直到你再也無法呼吸為止。我的愛，難道對你來說太沉重了嗎？」" 
    },
    "-1_-1_1": { 
        name: "美國螯蝦", 
        detail: "💡 性格：鋼鐵直男型\n📌 核心特徵：武裝到牙齒、生存力點滿、防禦心重。\n🔎 偵查線索：全身帶刺，就算在最髒的水溝也能活得自我，誰敢靠近就先送你一對大螯。\n💬 自白：「別跟我談感情，我的殼很硬。只要能活下去，待在水溝裡我也能當國王。」" 
    },
    "-1_-1_-1": { 
        name: "福壽螺", 
        detail: "💡 性格：吞噬怪獸型\n📌 核心特徵：胃口極好、繁殖力驚人、無視規矩。\n🔎 偵查線索：所到之處只剩下斷垣殘壁（跟被啃光的秧苗），還會留下讓人無法忽視的粉紅色足跡。\n💬 自白：「世界在我的眼裡只有兩件事：能不能吃，以及能不能生。剛才那是你的午餐嗎？不好意思，現在變我的了。」" 
    }
};

// --- 6. 台灣結果資料庫 ---
const taiwanResults = {
    "1_1_1": { 
        name: "綠鬣蜥", 
        detail: "💡 性格：強勢開拓者\n📌 核心特徵：擴張性極強、無視障礙、破壞式成長。\n🔎 偵查線索：喜歡在高處監視，體型增長速度驚人，對現有系統（生態系）具有強大的物理破壞力。\n💬 自白：「規矩是留給弱者的。只要我站得夠高、長得夠快，這整片田野都是我的私人領地。」" 
    },
    "1_1_-1": { 
        name: "斑腿樹蛙", 
        detail: "💡 性格：聲音入侵者\n📌 核心特徵：高頻通訊、社交混淆、身分偽裝。\n🔎 偵查線索：叫聲極大且具有排他性，長相與本土種極為相似，擅長在群眾中偷換概念並取得優勢。\n💬 自白：「聽起來很熟悉對吧？但我比原本的那位更響亮、更強壯。當你意識到我是誰時，這裡已經滿山滿谷都是我了。」" 
    },
    "1_-1_1": { 
        name: "海蟾蜍", 
        detail: "💡 性格：有毒防衛者\n📌 核心特徵：負能量防護、消極對抗、致命吸引力。\n🔎 偵查線索：體型巨大且帶有致命毒腺，屬於「你不犯我，我也讓你不敢靠近」的難纏角色。\n💬 自白：「靠近我之前最好先想清楚，我有的是讓你後悔的手段。這叫『必要的社交距離』。」" 
    },
    "1_-1_-1": { 
        name: "巴西龜", 
        detail: "💡 性格：堅毅生存者\n📌 核心特徵：極高適應力、隨遇而安、長期主義者。\n🔎 偵查線索：只要有水跟陽光就能活，表面看似安靜溫和，實際上正默默擠掉所有本土競爭者的空間。\n💬 自白：「我不需要爭第一，我只需要活得比你久。當你消失的時候，這片池塘就是我的了。」" 
    },
    "-1_1_1": { 
        name: "網紋蟒", 
        detail: "💡 性格：冷血戰略家\n📌 核心特徵：極度沉穩、精準打擊、存在感極強。\n🔎 偵查線索：平時隱藏在暗處，一旦現身就是無法忽視的巨大威脅，擁有掌控全局的絕對力量。\n💬 自白：「耐心是我的本錢。我不在乎等待，因為當我決定出手時，勝負就已經在那一刻結束了。」" 
    },
    "-1_1_-1": { 
        name: "高冠變色龍", 
        detail: "💡 性格：幻影觀察家\n📌 核心特徵：極度隱蔽、環境適應、精準鎖定。\n🔎 偵查線索：擅長偽裝成環境的一部分，在任何系統中都能保持低調，直到目標進入他絕對的攻擊範圍。\n💬 自白：「如果你看得見我，代表我正打算讓你走入歷史。別擔心，這過程會安靜到讓你完全沒感覺。」" 
    },
    "-1_-1_1": { 
        name: "琵琶鼠魚", 
        detail: "💡 性格：鋼鐵清道夫\n📌 核心特徵：極限防禦、生命力頑強、低調掠奪。\n🔎 偵查線索：擁有如鎧甲般的皮膚，專門在底層活動，看似在清理環境，實則在掠奪所有人的生存根基。\n💬 自白：「嫌我醜？沒關係，反正你也弄不死我。在最髒、最混濁的地方，我才是真正的王。」" 
    },
    "-1_-1_-1": { 
        name: "埃及聖䴉", 
        detail: "💡 性格：冷酷殖民者\n📌 核心特徵：集團行動、強勢驅逐、死神鐮刀。\n🔎 偵查線索：特徵是黑頭與長彎喙，常以成千上萬的族群規模佔據濕地，讓本土鳥類無路可退。\n💬 自白：「看著我們成群結隊降臨，你就該知道，這片濕地換人做主了。原住民？抱歉，我們只看實力。」" 
    }
};

function showResult() {
    hideAllScreens();
    document.getElementById('result-screen').style.display = 'block';
    
    const finalE = scores.E > 0 ? 1 : -1;
    const finalS = scores.S > 0 ? 1 : -1;
    const finalC = scores.C > 0 ? 1 : -1;
    const resultKey = `${finalE}_${finalS}_${finalC}`;
    
    const currentResults = currentMode === 'nthu' ? nthuResults : taiwanResults;
    const finalResult = currentResults[resultKey];
    
    // 紀錄最終測出的物種名稱，傳遞給圖鑑使用
    finalResultName = finalResult.name;
    
    document.getElementById('result-name-front').innerText = finalResult.name;
    document.getElementById('result-name-back').innerText = finalResult.name;
    document.getElementById('bird-detail-content').innerText = finalResult.detail;
    
    // 🌟 關鍵修改：將測驗結果卡片的圖片路徑，改為「物種名_art.png」
    document.getElementById('bird-img').src = `images/${finalResult.name}_art.png`;
}

// --- 7. 返回控制與關於我們 ---
let previousScreen = 'mode-selection-screen'; 

function showAbout() {
    const screens = ['mode-selection-screen', 'start-screen', 'quiz-screen', 'result-screen', 'species-grid-screen', 'species-detail-screen'];
    for (let screen of screens) {
        let el = document.getElementById(screen);
        if (el && el.style.display === 'block') {
            previousScreen = screen;
            el.style.display = 'none';
            break;
        }
    }
    document.getElementById('about-screen').style.display = 'block';
}

function goBack() {
    document.getElementById('about-screen').style.display = 'none';
    document.getElementById(previousScreen).style.display = 'block';
}

// ================= 8. 圖鑑系統與詳細資訊庫 =================
const speciesDetailsDB = {
    // --- 清大物種 ---
    "狗": {
        scientific: "Canis lupus familiaris",
        appearance: "體型差異極大、四肢強壯、吻部突出、牙齒銳利、毛色多樣",
        diet: "雜食偏肉食",
        global: "全球（人類飼養後棄養、繁殖失控）",
        local: "全校、餐廳周圍",
        prevention: "不棄養、絕育管理、不餵食",
        story: "待補"
    },
    "貓": {
        scientific: "Felis catus",
        appearance: "體型中小、身體柔軟靈活、眼睛大且具有夜視能力、毛色多變（虎斑、黑白、橘色等）、具有可伸縮利爪與敏銳鬍鬚",
        diet: "肉食（捕食鳥類、鼠類）",
        global: "全球（人類飼養後棄養、繁殖失控）",
        local: "宿舍區、人社院",
        prevention: "不棄養、絕育管理、不餵食",
        story: "待補"
    },
    "家八哥": {
        scientific: "Acridotheres tristis",
        appearance: "體長約23–26公分、羽毛為深褐色至黑色且翅膀有白色斑塊、嘴喙與眼周裸露皮膚呈鮮黃色",
        diet: "雜食（昆蟲、果實、垃圾）",
        global: "由南亞散播至全球 (人為引入做寵物或觀賞鳥、適應力強快速繁殖)",
        local: "全校園樹冠",
        prevention: "移除巢穴、減少食物來源",
        story: "待補"
    },
    "紅火蟻": {
        scientific: "Solenopsis invicta",
        appearance: "體長約2–6毫米、不同工蟻大小差異大、紅褐色、築成鬆散隆起的蟻丘",
        diet: "雜食（昆蟲、植物汁液）",
        global: "原產於南美洲，2003年隨土壤、貨櫃運輸入境",
        local: "草坪蟻丘",
        prevention: "毒餌防治",
        story: "待補"
    },
    "喜鵲": {
        scientific: "Pica serica",
        appearance: "體長約45–50公分、羽毛黑白分明、翅膀與尾羽帶有藍綠金屬光澤、尾羽特別長占體長一半以上",
        diet: "雜食（昆蟲、小動物、果實）",
        global: "東亞 (人為引入臺灣作觀賞用途)",
        local: "成功湖周邊",
        prevention: "控制族群、減少餵食",
        story: "待補"
    },
    "小花蔓澤蘭": {
        scientific: "Mikania micrantha",
        appearance: "快速生長的攀爬藤本植物、葉片呈三角形或心形，邊緣有鋸齒、開白色小花可覆蓋整片植被形成「綠色毯子」",
        diet: "光合作用",
        global: "原產中南美洲 (隨貿易或植物引入、生長快速、缺乏天敵)",
        local: "後山邊坡",
        prevention: "連根拔除、開花前清除",
        story: "待補"
    },
    "美國螯蝦": {
        scientific: "Procambarus clarkii",
        appearance: "體長可達10–15公分、全身紅色或暗紅色、具有明顯大螯、外殼堅硬",
        diet: "雜食（植物、水生動物）",
        global: "原產北美洲，因食用引進，隨後被放生或逃逸",
        local: "昆明湖、水溝",
        prevention: "捕撈移除、禁止放生",
        story: "待補"
    },
    "福壽螺": {
        scientific: "Pomacea canaliculata",
        appearance: "殼呈圓球形且顏色為黃褐色至深褐色、體型為5–10公分、最明顯特徵為產下鮮豔粉紅色卵塊附著在水生植物葉片上",
        diet: "雜食（特別愛吃水稻）",
        global: "原產於南美洲，1970年代引進作為食用螺類，養殖失敗後被棄置或逃逸擴散至亞洲",
        local: "相思湖、水溝",
        prevention: "清除卵塊、生物或農藥防治、避免放生",
        story: "待補"
    },
    
    // --- 台灣物種 ---
    "綠鬣蜥": {
        scientific: "Iguana iguana",
        appearance: "體長約1~2公尺，下顎具有圓形鼓膜下鱗，繁殖期時體色會變鮮豔，呈橘紅色",
        diet: "草食性",
        global: "中南美洲 (人為引入台灣作為寵物飼養，不當野放嚴重危害農作物)",
        local: "中南部尤其嚴重",
        prevention: "壓制生育、獵人團，飼養須登記",
        story: "待補"
    },
    "斑腿樹蛙": {
        scientific: "Polypedates megacephalus",
        appearance: "背腹扁平，呈淺褐色，皮膚光滑，趾端吸盤發達，大腿內側有網狀花紋，多具有X字型花紋",
        diet: "雜食性 (蝌蚪以水生植物為主，成蛙以昆蟲為主)",
        global: "中國東部、印度北部，香港為主 (被引入台灣與日本)",
        local: "台灣除了台東以外都有",
        prevention: "清除作業、誘捕",
        story: "待補"
    },
    "海蟾蜍": {
        scientific: "Rhinella marina",
        appearance: "體長10~15公分，皮膚乾燥，眼後有大腮腺會分泌蟾毒素，瞳孔橫向且虹膜呈金色",
        diet: "雜食性 (能直接吞下的都吃)",
        global: "原產於中南美洲 (被引入澳洲及其他國家用於對抗害蟲)",
        local: "南投草屯最為嚴重",
        prevention: "大規模捕捉與清除，飼養須登記，不得任意繁殖及棄養",
        story: "待補"
    },
    "巴西龜": {
        scientific: "Trachemys scripta elegans",
        appearance: "背甲約20~30公分、雌性一般較大，其頭部兩側有鮮明的紅色條紋，隨年齡增加而變深",
        diet: "雜食 (魚蝦、藻類)",
        global: "源於北美密西西比河及格蘭德河流域，後隨寵物貿易被引入全球",
        local: "台灣許多地區已屬歸化種的淡水龜",
        prevention: "完全移除已不可能",
        story: "待補"
    },
    "網紋蟒": {
        scientific: "Malayopython reticulatus",
        appearance: "為現存最長的蛇，可達9公尺，身上的網狀紋參雜黃斑塊，可融入落葉堆景色，夜行性",
        diet: "為頂級掠食者 (爬蟲類、鳥類、哺乳類)",
        global: "南亞、東南亞地區的熱帶雨林與耕地",
        local: "南部地區 (近年在高雄地區多次現蹤)",
        prevention: "飼養須登記，任意放生將依法罰鍰",
        story: "待補"
    },
    "高冠變色龍": {
        scientific: "Chamaeleo calyptratus",
        appearance: "頭上有隨年紀增大的頭冠，呈綠色，雄性有黃或藍色條紋與斑塊",
        diet: "食蟲動物",
        global: "阿拉伯半島地帶",
        local: "高雄旗津",
        prevention: "大規模捕捉與清除",
        story: "待補"
    },
    "琵琶鼠魚": {
        scientific: "Pterygoplichthys pardalis",
        appearance: "體長可達45公分以上，具硬質骨板包覆全身，體呈黑色具許多鵝黃色亮紋",
        diet: "生活在溪流底部，以沉積的有機物為食",
        global: "原產於南美洲亞馬遜河流域 (被引入台灣、中國作為水族清潔之用)",
        local: "全台溪流、河川中下游",
        prevention: "大規模捕捉與清除",
        story: "待補"
    },
    "埃及聖䴉": {
        scientific: "Threskiornis aethiopicus",
        appearance: "體高約 65 至 89 公分，全身羽色為白色，但頭、頸、腳為黑色且無羽毛覆蓋，擁有極具辨識度、長而下彎的黑色喙部。",
        diet: "雜食性，以魚類、兩棲類、甲殼類、昆蟲，甚至是其他鳥類的蛋與雛鳥為食。",
        global: "原產於非洲及中東地區（1984 年因動物園引進作為觀賞鳥後逃逸）。",
        local: "全台西部濕地、河口、農田 (嚴重壓縮本土鷺科生存空間)",
        prevention: "採取「生殖控制」移除鳥蛋與巢穴，並由政府組織專業團隊進行成鳥的精準獵捕。",
        story: "因其在台灣幾乎無天敵且繁殖速度驚人，常以成千上萬的族群規模佔據棲地，被鳥友戲稱為「死神鐮刀」。"
    }
};

let currentGridMode = '';

// 打開圖鑑選單 (會觸發黑幕動畫)
function openSpeciesGrid(mode) {
    currentGridMode = mode;
    const transitionLayer = document.getElementById('black-transition');
    transitionLayer.style.opacity = '1';
    transitionLayer.style.pointerEvents = 'auto';

    setTimeout(() => {
        // 切換背景與標題
        if (mode === 'nthu') {
            document.documentElement.style.setProperty('--bg-url', `url('images/wallpaper.png')`);
            document.getElementById('grid-title').innerText = "清大外來種圖鑑";
        } else {
            document.documentElement.style.setProperty('--bg-url', `url('images/台灣版全紅黑色調.png')`);
            document.getElementById('grid-title').innerText = "台灣外來種圖鑑";
        }

        hideAllScreens();
        document.getElementById('species-grid-screen').style.display = 'block';

        // 動態生成 8 個方塊
        const gridContainer = document.getElementById('species-grid');
        gridContainer.innerHTML = ''; 
        
        const speciesList = mode === 'nthu' ? Object.values(nthuResults) : Object.values(taiwanResults);
        
        speciesList.forEach(sp => {
            const btn = document.createElement('div');
            btn.className = 'grid-item';
            btn.innerText = sp.name;
            btn.onclick = () => showSpeciesDetail(sp.name, mode);
            gridContainer.appendChild(btn);
        });

        transitionLayer.style.opacity = '0';
        setTimeout(() => { transitionLayer.style.pointerEvents = 'none'; }, 1000);
    }, 1000);
}

// 顯示特定物種的詳細資料
function showSpeciesDetail(speciesName, mode) {
    // 現在名稱完全沒有重複了，直接抓取資料！
    const data = speciesDetailsDB[speciesName] || {
        scientific: "待補", appearance: "待補", diet: "待補", global: "待補", local: "待補", prevention: "待補", story: "待補"
    };

    document.getElementById('detail-title').innerText = speciesName;
    
    // --- 新增：將圖片動態套用到最上方的區塊 ---
    document.getElementById('detail-img').src = `images/${speciesName}.png`;
    
    document.getElementById('detail-scientific').innerText = data.scientific;
    document.getElementById('detail-appearance').innerText = data.appearance;
    document.getElementById('detail-diet').innerText = data.diet;
    document.getElementById('detail-global').innerText = data.global;
    
    // 根據模式切換地點標籤
    const locationLabel = mode === 'nthu' ? "清大出沒地點：" : "台灣出沒地點：";
    document.getElementById('detail-location-label').innerText = locationLabel;
    document.getElementById('detail-local').innerText = data.local;
    
    document.getElementById('detail-prevention').innerText = data.prevention;
    document.getElementById('detail-story').innerText = data.story;

    hideAllScreens();
    document.getElementById('species-detail-screen').style.display = 'block';
}

// 從詳細畫面返回圖鑑網格
function goBackToGrid() {
    hideAllScreens();
    document.getElementById('species-grid-screen').style.display = 'block';
}

// 從測驗結果畫面直接跳到該物種的圖鑑詳細資料
function goToDetailFromResult() {
    showSpeciesDetail(finalResultName, currentMode);
}