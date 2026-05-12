// --- 共通：サイドバーとタブ制御 ---
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');
menuIcon.addEventListener('click', () => sidebar.classList.toggle('open'));

function openTab(tabName) {
    if (tabName === 'admin') {
        const password = prompt("管理者パスワードを入力してください");
        if (password !== "0712") {
            alert("パスワードが違います");
            return; 
        }
    }

    const contents = document.getElementsByClassName('tab-content');
    for (let c of contents) c.classList.remove('active');
    document.getElementById(tabName).classList.add('active');

    const buttons = document.getElementsByClassName('tab-btn');
    for (let b of buttons) b.classList.remove('active');
    
    // イベントが存在する場合のみクラスを追加（非推奨警告回避）
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    sidebar.classList.remove('open');
    
    // サッカータブを開いた時だけ順位表を読み込む
    if (tabName === 'soccer') {
        loadStandings();
    }
}

// --- グルメ機能：データ管理 ---
let myShops = [];

async function loadShops() {
    try {
        const response = await fetch('shops.json');
        if (!response.ok) throw new Error('Network response was not ok');
        myShops = await response.json();
        return true;
    } catch (error) {
        console.error("データの読み込み失敗:", error);
        return false;
    }
}

async function updateGourmetList() {
    const listDiv = document.getElementById('gourmet-list');
    if (myShops.length === 0) {
        const success = await loadShops();
        if (!success) {
            listDiv.innerHTML = "<p>データの読み込みに失敗しました。</p>";
            return;
        }
    }

    const genre = document.getElementById('gourmet-genre-select').value;
    const status = document.getElementById('gourmet-status-select').value;
    listDiv.innerHTML = "<p style='text-align:center;'>現在地を取得中...</p>";

    navigator.geolocation.getCurrentPosition(pos => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        
        let shops = myShops.map(s => ({
            ...s, 
            dist: getDistance(uLat, uLng, s.lat, s.lng)
        }))
        .filter(s => (genre === 'all' || s.category === genre) && (status === 'all' || s.status === status))
        .sort((a, b) => a.dist - b.dist);
            
        if (shops.length === 0) {
            listDiv.innerHTML = "<p style='text-align:center;'>条件に合うお店がありません。</p>";
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
                </div>`;
        }).join('');
    }, (error) => {
        listDiv.innerHTML = `<p style="color:#ff4d4d; text-align:center;">位置情報エラー</p>`;
    });
}

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- 管理機能：JSON生成 ---
function getCurrentLocationForAdmin() {
    navigator.geolocation.getCurrentPosition(pos => {
        document.getElementById('in-lat').value = pos.coords.latitude;
        document.getElementById('in-lng').value = pos.coords.longitude;
    }, () => alert("取得失敗"));
}

function generateJSON() {
    const data = {
        name: document.getElementById('in-name').value,
        area: document.getElementById('in-area').value,
        lat: parseFloat(document.getElementById('in-lat').value) || 0,
        lng: parseFloat(document.getElementById('in-lng').value) || 0,
        isHyakumeiten: document.getElementById('in-hyaku').checked,
        category: document.getElementById('in-cat').value,
        status: document.getElementById('in-status').value,
        price: document.getElementById('in-price').value || "ー",
        rating: document.getElementById('in-status').value === 'visited' ? document.getElementById('in-rating').value : "",
        comment: document.getElementById('in-comment').value,
        recommend: document.getElementById('in-rec').value,
        url: document.getElementById('in-url').value
    };
    document.getElementById('out-json').value = "  ,\n" + JSON.stringify(data, null, 2);
}

function copyJSON() {
    const textArea = document.getElementById('out-json');
    textArea.select();
    document.execCommand('copy');
    alert("コピーしました！");
}

// --- その他 ---
function generateRandomNumber() {
    document.getElementById('number-display').innerText = Math.floor(Math.random()*100)+1;
}
function tellFortune() {
    const m = ["大吉", "中吉", "小吉", "吉", "天文吉"];
    document.getElementById('fortune-text').innerText = "運勢: " + m[Math.floor(Math.random()*m.length)];
}

// --- サッカー機能 ---
let replayInterval;
let currentMinute = 0;
let homeScore = 0;
let awayScore = 0;

// APIから取得したと仮定した「終わった試合のイベントデータ」
const mockMatchEvents = [
    { minute: 13, team: 'home', player: '興梠 慎三', type: 'goal' },
    { minute: 42, team: 'away', player: '泉澤 仁', type: 'goal' },
    { minute: 89, team: 'home', player: '伊藤 敦樹', type: 'goal' }
];

// APIから取得したと仮定した「順位表データ」
const mockStandingsData = [
    { rank: 1, team: "ヴィッセル神戸", points: 71, gd: "+29" },
    { rank: 2, team: "横浜F・マリノス", points: 64, gd: "+23" },
    { rank: 3, team: "サンフレッチェ広島", points: 58, gd: "+14" },
    { rank: 4, team: "浦和レッズ", points: 57, gd: "+15" },
    { rank: 5, team: "鹿島アントラーズ", points: 52, gd: "+9" },
    { rank: 21, team: "大宮アルディージャ", points: 39, gd: "-32" } // デモ用
];

// 試合再生のロジック
function startMatchReplay() {
    // リセット処理
    clearInterval(replayInterval);
    currentMinute = 0;
    homeScore = 0;
    awayScore = 0;
    document.getElementById('score-home').innerText = 0;
    document.getElementById('score-away').innerText = 0;
    
    const eventLog = document.getElementById('event-log');
    eventLog.innerHTML = '<p style="color:#4cc9f0;">⏱ 試合開始！(さいたまダービー)</p>';

    // タイマー開始 (1秒 = ゲーム内の1分 とする設定)
    replayInterval = setInterval(() => {
        currentMinute++;
        document.getElementById('match-timer').innerText = currentMinute + "'";

        // その時間に発生したイベント（ゴール等）を探す
        const eventsNow = mockMatchEvents.filter(e => e.minute === currentMinute);
        
        eventsNow.forEach(event => {
            if (event.type === 'goal') {
                if (event.team === 'home') {
                    homeScore++;
                    document.getElementById('score-home').innerText = homeScore;
                } else {
                    awayScore++;
                    document.getElementById('score-away').innerText = awayScore;
                }
                
                // ログに追記して一番下までスクロール
                eventLog.innerHTML += `<p><strong>${event.minute}' ⚽ GOAL!</strong> - ${event.player}</p>`;
                eventLog.scrollTop = eventLog.scrollHeight;
            }
        });

        // 90分で終了
        if (currentMinute >= 90) {
            clearInterval(replayInterval);
            eventLog.innerHTML += `<p style="color:#ffdc34;">🏁 試合終了 (${homeScore} - ${awayScore})</p>`;
            eventLog.scrollTop = eventLog.scrollHeight;
        }
    }, 200); // 実際の200ミリ秒を1分として扱う（1試合18秒で終わります）
}

// 順位表の描画ロジック
function loadStandings() {
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = ''; // 一旦クリア
    
    mockStandingsData.forEach(teamData => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${teamData.rank}</td>
            <td style="text-align: left; font-weight: bold;">${teamData.team}</td>
            <td style="color: #ffdc34;">${teamData.points}</td>
            <td>${teamData.gd}</td>
        `;
        tbody.appendChild(tr);
    });
}