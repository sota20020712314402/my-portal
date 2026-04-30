// --- 1. パスワード保護 (0712) ---
(function() {
    const password = prompt("パスワードを入力してください");
    if (password !== "0712") {
        alert("アクセス拒否");
        document.body.innerHTML = '<div style="color:white; text-align:center; margin-top:100px;"><h1>Forbidden</h1></div>';
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
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    sidebar.classList.remove('open');
}

// --- 4. ito用 乱数生成 ---
function generateRandomNumber() {
    const num = Math.floor(Math.random() * 100) + 1; // 1から100まで
    const display = document.getElementById('number-display');
    
    // 少し演出：一瞬消してから表示
    display.style.opacity = 0;
    setTimeout(() => {
        display.innerText = num;
        display.style.opacity = 1;
    }, 100);
}

// --- 5. 占い ---
function tellFortune() {
    const messages = ["大吉", "中吉", "小吉", "吉", "天文吉"];
    const res = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('fortune-text').innerText = "運勢： " + res;
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.background = randomColor;
}

// --- グルメデータベース (ここにお店を追加していく) ---
const myShops = [
    {
        name: "埼玉大学 近くの定食屋",
        lat: 35.8624, lng: 139.6074,
        category: "定食",
        status: "visited",
        rating: "★★★★☆",
        comment: "ご飯お代わり無料でバルクアップに最適。",
        url: "https://tabelog.com/..."
    },
    {
        name: "大宮の気になるラーメン店",
        lat: 35.9064, lng: 139.6239,
        category: "ラーメン",
        status: "wishlist",
        rating: "-",
        comment: "百名店常連らしい。週末に行きたい。",
        url: "https://tabelog.com/..."
    }
];

// 距離計算（ハバサイン公式）
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function updateGourmetList() {
    const genreFilter = document.getElementById('gourmet-genre-select').value;
    const statusFilter = document.getElementById('gourmet-status-select').value;
    const listDiv = document.getElementById('gourmet-list');

    if (!navigator.geolocation) {
        alert("位置情報が使えません");
        return;
    }

    listDiv.innerHTML = "<p style='text-align:center;'>現在地を取得中...</p>";

    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // 距離追加 & フィルター
        let sortedShops = myShops.map(shop => ({
            ...shop,
            distance: getDistance(userLat, userLng, shop.lat, shop.lng)
        }));

        // 条件絞り込み
        sortedShops = sortedShops.filter(shop => {
            const genreMatch = (genreFilter === 'all' || shop.category === genreFilter);
            const statusMatch = (statusFilter === 'all' || shop.status === statusFilter);
            return genreMatch && statusMatch;
        });

        // 近い順にソート
        sortedShops.sort((a, b) => a.distance - b.distance);

        if (sortedShops.length === 0) {
            listDiv.innerHTML = "<p>該当するお店がありません。</p>";
            return;
        }

        // HTML生成
        listDiv.innerHTML = sortedShops.map(shop => {
            const isVisited = shop.status === 'visited';
            const statusLabel = isVisited ? "✅ 行ってよかった" : "📌 行ってみたい";
            const labelColor = isVisited ? "#4cc9f0" : "#ff9e00";

            return `
                <div style="background:#0f3460; padding:15px; border-radius:10px; margin-bottom:10px; border-left: 5px solid ${labelColor};">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <strong style="font-size:1.1rem;">${shop.name}</strong>
                        <span style="font-size:0.8rem; color:${labelColor};">📍約${shop.distance.toFixed(1)}km</span>
                    </div>
                    <div style="font-size:0.85rem; margin:8px 0; color:#ddd;">
                        <span style="background:#1a1a2e; padding:3px 8px; border-radius:4px; font-weight:bold;">${statusLabel}</span>
                        ${isVisited ? `<span style="color:#ffdc34; margin-left:10px;">${shop.rating}</span>` : ""}
                    </div>
                    <p style="font-size:0.85rem; color:#ccc; margin:5px 0;">"${shop.comment}"</p>
                    <a href="${shop.url}" target="_blank" style="color:#4cc9f0; font-size:0.8rem;">食べログを見る →</a>
                </div>
            `;
        }).join('');
    }, () => {
        listDiv.innerHTML = "<p>位置情報の取得に失敗しました。</p>";
    });
}