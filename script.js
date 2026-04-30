// --- 1. パスワード保護 (簡易) ---
(function() {
    const password = prompt("パスワードを入力してください");
    if (password !== "sota123") { // パスワードはここで変更可能
        alert("アクセス拒否");
        document.body.innerHTML = '<div style="color:white; text-align:center; margin-top:100px;"><h1>Forbidden</h1><p>正しいパスワードが必要です。</p></div>';
        window.stop();
    }
})();

// --- 2. サイドバー開閉 ---
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');

menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// --- 3. タブ切り替え ---
function openTab(tabName) {
    const contents = document.getElementsByClassName('tab-content');
    for (let content of contents) {
        content.classList.remove('active');
    }
    document.getElementById(tabName).classList.add('active');

    const buttons = document.getElementsByClassName('tab-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
    // クリックされたボタンをactiveにする
    event.currentTarget.classList.add('active');
    
    sidebar.classList.remove('open'); // スマホ配慮：タブ選択後に閉じる
}

// --- 4. 筋肥大カロリー計算 ---
function calcFitness() {
    const weight = document.getElementById('weight-input').value;
    if (!weight) return alert("体重を入力してください");
    
    const calorie = Math.round(weight * 40); 
    const protein = weight * 2; 
    const fat = Math.round((calorie * 0.2) / 9); 
    const carb = Math.round((calorie - (protein * 4) - (fat * 9)) / 4);

    document.getElementById('fitness-result').innerHTML = `
        <p>🔥 目標カロリー: <strong>${calorie} kcal</strong></p>
        <p>🥩 タンパク質 (P): ${protein} g</p>
        <p>🥑 脂質 (F): ${fat} g</p>
        <p>🍚 炭水化物 (C): ${carb} g</p>
        <p><small style="color:#888;">※バルクアップ期（体重増加）の目安です</small></p>
    `;
}

// --- 5. 宇宙徒歩シミュレーター ---
function calcSpaceWalk() {
    const km = document.getElementById('target-astro').value;
    const hours = km / 4; // 時速4km
    const days = hours / 24;
    const years = (days / 365).toFixed(1);
    
    document.getElementById('walk-result').innerText = 
        `到着まで約 ${years} 年かかります。人生が足りません。`;
}

// --- 6. M-1 語録 ---
const m1Quotes = [
    "「いなせだねぇ〜」(令和ロマン)",
    "「あ〜、これこれ」(ケビンス)",
    "「お前、さっきから何言ってんだよ！」(オズワルド)",
    "「つり革を持ちたくない」(マジカルラブリー)",
    "「どうも〜、錦鯉です！こんにちはー！」",
    "「俺が街の灯りや！」(笑い飯)",
    "「もうええわ！」"
];

function showM1Quote() {
    const quote = m1Quotes[Math.floor(Math.random() * m1Quotes.length)];
    document.getElementById('quote-text').innerText = quote;
}

// --- 7. 占い ---
function tellFortune() {
    const messages = ["大吉", "中吉", "小吉", "吉", "天文吉（星が味方します）"];
    const res = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('fortune-text').innerText = "運勢： " + res;
    
    // 背景をランダムな色に
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.background = randomColor;
}