// --- 1. 定義初始題庫 (6題) ---
const initialQuestions = [
    {
        title: "在清大大草坪寫作業時，你偏好的環境是？",
        options: [
            { text: "(A) 人多熱鬧，感覺有活力", axis: 'S', value: 1 },
            { text: "(B) 偏僻安靜，沒人打擾", axis: 'S', value: -1 }
        ]
    },
    {
        title: "當寫考古題時發現大錯特錯，你的第一反應？",
        options: [
            { text: "(A) 馬上把答案改掉，重寫一次", axis: 'E', value: 1 },
            { text: "(B) 盯著螢幕靜靜思考 5 分鐘找邏輯問題", axis: 'E', value: -1 }
        ]
    },
    {
        title: "期末專題的最後呈現，你最在意的是？",
        options: [
            { text: "(A) 整體美感與優雅的排版", axis: 'C', value: -1 },
            { text: "(B) 數據的精確度與複雜的邏輯推導", axis: 'C', value: 1 }
        ]
    },
    {
        title: "通識課分組討論時，你通常是？",
        options: [
            { text: "(A) 主動發言並帶領討論節奏", axis: 'E', value: 1 },
            { text: "(B) 聽大家說完再給出最後建議", axis: 'E', value: -1 }
        ]
    },
    {
        title: "假日早上的理想活動是？",
        options: [
            { text: "(A) 參加社團大聚會或去市集逛逛", axis: 'S', value: 1 },
            { text: "(B) 一個人去後山散步或是窩在宿舍看書", axis: 'S', value: -1 }
        ]
    },
    {
        title: "在玩桌遊時，你的風格更像是？",
        options: [
            { text: "(A) 步步為營，計算每一步的勝率", axis: 'C', value: 1 },
            { text: "(B) 隨心所欲，享受當下的直覺反應", axis: 'C', value: -1 }
        ]
    }
];

// --- 2. 定義備用題庫 ---
const backupQuestions = {
    E: {
        title: "看到校園路口發生小擦撞事故時，你的直覺反應是？",
        options: [
            { text: "(A) 衝過去幫忙，詢問是否要報警", axis: 'E', value: 1 },
            { text: "(B) 原地觀察局勢，確認有人處理再離開", axis: 'E', value: -1 }
        ]
    },
    S: {
        title: "如果你在學餐餐廳吃飯，看到系上朋友獨自坐在旁邊，你會？",
        options: [
            { text: "(A) 主動走過去打個招呼，甚至問問能不能併桌聊天", axis: 'S', value: 1 },
            { text: "(B) 假裝沒看到，低頭快速吃完，不想尷尬對到眼", axis: 'S', value: -1 }
        ]
    },
    C: {
        title: "準備一場長途旅行前，你通常會如何處理行李？",
        options: [
            { text: "(A) 提前幾天列好清單，精準分類收納每一件物品", axis: 'C', value: 1 },
            { text: "(B) 出發前一晚隨手抓幾件衣服進包包，缺什麼再去買", axis: 'C', value: -1 }
        ]
    }
};

// --- 3. 遊戲狀態控制 ---
let currentQ = 0;
let scores = { E: 0, S: 0, C: 0 }; 
let activeQuestions = []; 

function nextStep() {
    currentQ = 0;
    scores = { E: 0, S: 0, C: 0 }; 
    activeQuestions = [...initialQuestions]; 
    document.getElementById('start-screen').style.display = 'none';
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
    
    if (currentQ === activeQuestions.length) {
        checkAndAddBackupQuestions();
    }

    if (currentQ < activeQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function checkAndAddBackupQuestions() {
    if (scores.E === 0) activeQuestions.push(backupQuestions.E);
    if (scores.S === 0) activeQuestions.push(backupQuestions.S);
    if (scores.C === 0) activeQuestions.push(backupQuestions.C);
}

// --- 4. 結果判定邏輯 ---
const birdResults = {
    "1_1_1": { 
        name: "綠繡眼", 
        engName: "Japanese_White-eye",
        detail: "💡 性格：好奇冒險家\n💬 自白：「這裡有花蜜！那裡有蟲！生命就該浪費在各種有趣的小事上。」\n📍 清大棲地：大草坪、校友會館\n🐦 習性：體型極小，行動極快，喜歡在花叢間鑽來鑽去。"
    },
    "1_1_-1": { 
        name: "喜鵲", 
        engName: "Eurasian_Magpie",
        detail: "💡 性格：社交名媛\n💬 自白：「喜事、壞事、八卦事，有我們在的地方就有新聞！」\n📍 清大棲地：成功湖周邊、二教\n🐦 習性：群居性強，喜歡聚集在醒目位置，羽毛有明顯金屬光澤。"
    },
    "1_-1_1": { 
        name: "大鳳頭蒼鷹", 
        engName: "Crested_Goshawk",
        detail: "💡 性格：霸道領主\n💬 自白：「清大天空的監視器就是我，誰敢在下面鬼鬼祟祟？」\n📍 清大棲地：後山、成功湖畔高樹\n🐦 習性：視野極佳，性格兇悍，常出現在樹冠層監視全場。"
    },
    "1_-1_-1": { 
        name: "小白鷺", 
        engName: "Little_Egret",
        detail: "💡 性格：優雅自戀型\n💬 自白：「成功湖就是我的伸展台，這身純白羽毛可不能沾上一點泥巴。」\n📍 清大棲地：成功湖、奕園池塘\n🐦 習性：身形纖細，覓食動作優雅，繁殖期會有漂亮的飾羽。"
    },
    "-1_1_1": { 
        name: "樹鵲", 
        engName: "Grey_Treepie",
        detail: "💡 性格：腹黑智將\n💬 自白：「我看過你寫的邏輯設計，也知道你幾點會出現在成功湖。」\n📍 清大棲地：台積館、人社院林間\n🐦 習性：叫聲多變，會觀察人類行為尋找機會，帶點神祕感。"
    },
    "-1_1_-1": { 
        name: "白頭翁", 
        engName: "Light-vented_Bulbul",
        detail: "💡 性格：焦慮警報型\n💬 自白：「警報！有人靠近！雖然我不知道他是誰，但大家快跑！」\n📍 清大棲地：全校園灌木叢\n🐦 習性：一點動靜就發出噪聲，聲音頻率高且破碎。"
    },
    "-1_-1_1": { 
        name: "夜鷺", 
        engName: "Black-crowned_Night_Heron",
        detail: "💡 性格：邊緣獨行俠\n💬 自白：「白天是你們的，夜晚才是我的。別跟我搭話，我在等魚。」\n📍 清大棲地：成功湖畔、水溝旁\n🐦 習性：主要在黃昏活動，常獨自站在湖邊，眼睛是鮮豔的紅色。"
    },
    "-1_-1_-1": { 
        name: "黑冠麻鷺", 
        engName: "Malayan_Night_Heron",
        detail: "💡 性格：佛系發呆型\n💬 自白：「我是靜止的節點，只要我不尷尬，尷尬的就是看我的人。」\n📍 清大棲地：野外大草原、各系館草地\n🐦 習性：可以定格數小時。鑑定點在於其頸部的橫紋偽裝。"
    }
};

function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    
    const finalE = scores.E > 0 ? 1 : -1;
    const finalS = scores.S > 0 ? 1 : -1;
    const finalC = scores.C > 0 ? 1 : -1;
    
    const resultKey = `${finalE}_${finalS}_${finalC}`;
    const finalResult = birdResults[resultKey];
    
    document.getElementById('result-name-front').innerText = finalResult.name;
    document.getElementById('result-name-back').innerText = finalResult.name;
    document.getElementById('bird-detail-content').innerText = finalResult.detail;
    document.getElementById('bird-img').src = `images/${finalResult.name}.png`;
    
    const spectrogramLink = document.getElementById('spectrogram-link');
    const spectrogramPath = `images/${finalResult.engName}_spectrogram.png`;
    
    spectrogramLink.onclick = (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        openSpectrogram(spectrogramPath);
    };
}

// --- 5. 導覽列與 Modal 控制 ---
let previousScreen = 'start-screen'; 

function showAbout() {
    const screens = ['start-screen', 'quiz-screen', 'result-screen', 'about-screen'];
    for (let screen of screens) {
        let el = document.getElementById(screen);
        if (el && el.style.display !== 'none' && el.style.display !== '' && screen !== 'about-screen') {
            previousScreen = screen;
            el.style.display = 'none';
            break;
        }
    }
    
    if (document.getElementById('start-screen').style.display !== 'none' && previousScreen === 'start-screen') {
        document.getElementById('start-screen').style.display = 'none';
    }

    document.getElementById('about-screen').style.display = 'block';
}

function goBack() {
    document.getElementById('about-screen').style.display = 'none';
    document.getElementById(previousScreen).style.display = 'block';
}

function openSpectrogram(src) {
    const modal = document.getElementById('spectrogram-modal');
    const modalImg = document.getElementById('modal-img');
    modal.style.display = 'flex';
    modalImg.src = src;
}

function closeSpectrogram() {
    document.getElementById('spectrogram-modal').style.display = 'none';
}