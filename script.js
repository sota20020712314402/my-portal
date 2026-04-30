// --- 1. パスワード保護 ---
(function() {
    const password = prompt("パスワードを入力してください");
    if (password !== "0712") {
        alert("アクセス拒否");
        document.body.innerHTML = '<h1>残念でした</h1>';
        window.stop();
    }
})();

// --- 2. メニュー開閉 ---
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');

menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// --- 3. タブ切り替え ---
function openTab(tabName) {
    const contents = document.getElementsByClassName('tab-content');
    for (let content of contents) content.classList.remove('active');
    document.getElementById(tabName).classList.add('active');

    const buttons = document.getElementsByClassName('tab-btn');
    for (let btn of buttons) btn.classList.remove('active');
    event.currentTarget.classList.add('active');
    
    sidebar.classList.remove('open');

    // キャンバスを表示した時にサイズを初期化
    if (tabName === 'planetarium') initCanvas();
}

// --- 4. プラネタリウム機能 ---
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 星を描く（光彩付き）
    const size = Math.random() * 2 + 1;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
});

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// --- 5. 占い ---
function tellFortune() {
    const messages = ["大吉", "中吉", "小吉", "吉", "天文吉"];
    const res = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('fortune-text').innerText = "運勢： " + res;
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.background = randomColor;
}