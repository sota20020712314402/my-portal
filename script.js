// 1. パスワード保護 (0712)
(function(){
    if(prompt("Password")!=="0712"){
        document.body.innerHTML='<div style="color:white; text-align:center; margin-top:100px;"><h1>Forbidden</h1></div>';
        window.stop();
    }
})();

// 2. サイドバー制御
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');
menuIcon.addEventListener('click', () => sidebar.classList.toggle('open'));

function openTab(tabName) {
    const contents = document.getElementsByClassName('tab-content');
    for (let c of contents) c.classList.remove('active');
    document.getElementById(tabName).classList.add('active');

    const buttons = document.getElementsByClassName('tab-btn');
    for (let b of buttons) b.classList.remove('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    sidebar.classList.remove('open');
}

// --- 3. グルメ機能 (新ジャンル対応版) ---
let myShops = [];

// ページ読み込み時にJSONを取得
async function loadShops() {
    try {
        const response = await fetch('shops.json');
        myShops = await response.json();
        console.log("データの読み込みに成功しました");
    } catch (error) {
        console.error("データの読み込み失敗:", error);
    }
}

// 既存の updateGourmetList の最初にこれを入れる
async function updateGourmetList() {
    if (myShops.length === 0) await loadShops(); 
    // ...以下、これまでのロジックと同じ
}
// 距離計算などのロジック（変更なし）
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLng = (lng2-lng1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function updateGourmetList() {
    const genre = document.getElementById('gourmet-genre-select').value;
    const status = document.getElementById('gourmet-status-select').value;
    const listDiv = document.getElementById('gourmet-list');
    
    listDiv.innerHTML = "<p style='text-align:center;'>現在地を取得中...</p>";

    navigator.geolocation.getCurrentPosition(pos => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        
        let shops = myShops.map(s => ({...s, dist: getDistance(uLat, uLng, s.lat, s.lng)}))
            .filter(s => (genre==='all'||s.category===genre) && (status==='all'||s.status===status))
            .sort((a,b) => a.dist - b.dist);
            
        if (shops.length === 0) {
            listDiv.innerHTML = "<p>条件に合うお店がありません。</p>";
            return;
        }

        listDiv.innerHTML = shops.map(s => {
            const borderColor = s.isHyakumeiten ? '#ffd700' : (s.status === 'visited' ? '#4cc9f0' : '#ff9e00');
            const badge = s.isHyakumeiten ? '<span style="background:#ffd700; color:#1a1a2e; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:bold; margin-left:8px; vertical-align:middle;">🏆 百名店</span>' : '';

            return `
                <div style="background:#0f3460; padding:15px; border-radius:10px; margin-bottom:10px; border-left:5px solid ${borderColor};">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div>
                            <strong style="font-size:1.1rem;">${s.name}</strong>${badge}
                            <!-- エリア表示を追加 -->
                            <div style="font-size:0.75rem; color:#4cc9f0; margin-top:4px;">📍 ${s.area}</div>
                        </div>
                        <small style="color:#4cc9f0;">${s.dist.toFixed(1)}km</small>
                    </div>
            
                    <div style="font-size:0.85rem; margin:8px 0; color:#ddd;">
                        <span>${s.category}</span> | <span style="color:#ffdc34;">${s.price}</span>
                        ${s.status === 'visited' ? `<span style="margin-left:10px; color:#ffdc34;">${s.rating}</span>` : ""}
                    </div>

                    <div style="background: rgba(76, 201, 240, 0.1); padding: 5px 10px; border-radius: 5px; margin: 8px 0; display: inline-block;">
                        <small style="color:#4cc9f0; font-weight:bold;">✨ おすすめ: ${s.recommend}</small>
                    </div>

                    <p style="font-size:0.8rem; color:#ccc; margin:5px 0;">"${s.comment}"</p>
                    <a href="${s.url}" target="_blank" style="color:#4cc9f0; font-size:0.75rem;">詳細を見る</a>
                </div>
            `;
        }).join('');    }, (error) => {
        let msg = "";
        switch(error.code) {
            case 1: msg = "位置情報の利用が許可されていません。設定を確認してください。"; break;
            case 2: msg = "デバイスの位置を特定できません（電波状況など）。"; break;
            case 3: msg = "タイムアウトしました。"; break;
            default: msg = "不明なエラーが発生しました。"; break;
        }
        listDiv.innerHTML = `<p style="color:#ff4d4d;">${msg}</p>`;
    });
}
// 4. ito / 占い
function generateRandomNumber() {
    const display = document.getElementById('number-display');
    display.innerText = Math.floor(Math.random()*100)+1;
}
function tellFortune() {
    const m = ["大吉", "中吉", "小吉", "吉", "天文吉"];
    document.getElementById('fortune-text').innerText = "運勢: " + m[Math.floor(Math.random()*m.length)];
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.background = randomColor;
}

function generateJSON() {
    const data = {
        name: document.getElementById('in-name').value,
        area: document.getElementById('in-area').value,
        lat: parseFloat(document.getElementById('in-lat').value),
        lng: parseFloat(document.getElementById('in-lng').value),
        isHyakumeiten: document.getElementById('in-hyaku').checked,
        category: document.getElementById('in-cat').value,
        status: "visited", // ここは必要に応じてセレクトボックス化
        price: "〜1,000円", // ここも同様
        rating: "★★★★☆",
        comment: document.getElementById('in-comment').value,
        recommend: document.getElementById('in-rec').value,
        url: ""
    };
    // JSON文字列にしてテキストエリアに出力
    document.getElementById('out-json').value = JSON.stringify(data, null, 2) + ",";
}