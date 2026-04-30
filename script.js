// --- パスワード保護の追加 ---
(function() {
    const password = prompt("パスワードを入力してください");
    if (password !== "0712") { // 「sota123」の部分を好きなパスワードに変えてください
        alert("パスワードが違います。アクセスできません。");
        document.body.innerHTML = '<div style="color:white; text-align:center; margin-top:100px;"><h1>Forbidden</h1><p>正しいパスワードが必要です。</p></div>';
        window.stop(); // 読み込みをストップ
    }
})();
// -----------------------

// ここから下に、以前書いたメニュー開閉や占いのコードが続くようにします
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');

// メニューの開閉
menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// タブ切り替え
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
    event.currentTarget.classList.add('active');
    
    sidebar.classList.remove('open'); // メニューを閉じる
}

// 占い
document.getElementById('fortuneButton').addEventListener('click', function() {
    const messages = ["大吉", "中吉", "小吉", "吉", "Web吉"];
    const res = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('fortune-text').innerText = "運勢： " + res;
    
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.background = randomColor;
});