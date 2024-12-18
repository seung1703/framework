// 타일 및 설정 데이터
const tiles = [
    { id: '1m', symbol: '🀇', type: 'man' }, { id: '2m', symbol: '🀈', type: 'man' }, { id: '3m', symbol: '🀉', type: 'man' },
    { id: '4m', symbol: '🀊', type: 'man' }, { id: '5m', symbol: '🀋', type: 'man' }, { id: '6m', symbol: '🀌', type: 'man' },
    { id: '7m', symbol: '🀍', type: 'man' }, { id: '8m', symbol: '🀎', type: 'man' }, { id: '9m', symbol: '🀏', type: 'man' },
    { id: '1s', symbol: '🀐', type: 'sou' }, { id: '2s', symbol: '🀑', type: 'sou' }, { id: '3s', symbol: '🀒', type: 'sou' },
    { id: '4s', symbol: '🀓', type: 'sou' }, { id: '5s', symbol: '🀔', type: 'sou' }, { id: '6s', symbol: '🀕', type: 'sou' },
    { id: '7s', symbol: '🀖', type: 'sou' }, { id: '8s', symbol: '🀗', type: 'sou' }, { id: '9s', symbol: '🀘', type: 'sou' },
    { id: '1p', symbol: '🀙', type: 'pin' }, { id: '2p', symbol: '🀚', type: 'pin' }, { id: '3p', symbol: '🀛', type: 'pin' },
    { id: '4p', symbol: '🀜', type: 'pin' }, { id: '5p', symbol: '🀝', type: 'pin' }, { id: '6p', symbol: '🀞', type: 'pin' },
    { id: '7p', symbol: '🀟', type: 'pin' }, { id: '8p', symbol: '🀠', type: 'pin' }, { id: '9p', symbol: '🀡', type: 'pin' }
];

const winds = [
    { symbol: '🀀', name: '동' }, { symbol: '🀁', name: '남' },
    { symbol: '🀂', name: '서' }, { symbol: '🀃', name: '북' }
];

const doraTiles = [
    { symbol: '🀇', name: '1만' }, { symbol: '🀈', name: '2만' }, { symbol: '🀉', name: '3만' },
    { symbol: '🀐', name: '1삭' }, { symbol: '🀙', name: '1통' }
];

// 타일 및 설정 데이터는 이전과 동일

// 랜덤 자풍 및 도라 설정
function setRandomConditions() {
    const randomWind = winds[Math.floor(Math.random() * winds.length)];
    document.getElementById('seat-wind-tile').textContent = randomWind.symbol;
    document.getElementById('seat-wind-tile').setAttribute('data-name', randomWind.name);

    const randomDora = doraTiles[Math.floor(Math.random() * doraTiles.length)];
    document.getElementById('dora-indicator-tile').textContent = randomDora.symbol;
    document.getElementById('dora-indicator-tile').setAttribute('data-name', randomDora.name);
}

// 손패 생성
function drawHand() {
    setRandomConditions(); // 자풍과 도라도 변경되도록 추가
    const handContainer = document.getElementById('hand');
    handContainer.innerHTML = ''; // 기존 패 초기화
    const hand = [];
    while (hand.length < 13) {
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        if (hand.filter(t => t.id === randomTile.id).length < 4) {
            hand.push(randomTile);
        }
    }
    const sortedHand = hand.sort((a, b) => {
        const typeOrder = { man: 0, sou: 1, pin: 2 };
        if (typeOrder[a.type] === typeOrder[b.type]) {
            return parseInt(a.id[0]) - parseInt(b.id[0]);
        }
        return typeOrder[a.type] - typeOrder[b.type];
    });
    renderHand(sortedHand);
    return sortedHand;
}


// 손패 렌더링
function renderHand(hand) {
    const handContainer = document.getElementById('hand');
    hand.forEach(tile => {
        const tileDiv = document.createElement('div');
        tileDiv.className = `tile ${tile.type}`;
        tileDiv.textContent = tile.symbol;
        tileDiv.setAttribute('data-id', tile.id);
        handContainer.appendChild(tileDiv);
    });

    // 기존 이벤트 리스너 제거 후 새로 추가
    handContainer.replaceWith(handContainer.cloneNode(true));
    addTileClickEvents(hand);
}

// 추천 타일 계산
function getRecommendedTile(hand) {
    const seatWind = document.getElementById('seat-wind-tile').textContent;
    const doraTile = document.getElementById('dora-indicator-tile').textContent;

    const counts = hand.reduce((acc, tile) => {
        acc[tile.symbol] = (acc[tile.symbol] || 0) + 1;
        return acc;
    }, {});

    let minTile = null;
    let minCount = Infinity;
    hand.forEach(tile => {
        if (counts[tile.symbol] < minCount && tile.symbol !== seatWind && tile.symbol !== doraTile) {
            minCount = counts[tile.symbol];
            minTile = tile;
        }
    });

    return minTile;
}

// 메시지 추가
function addMessage(content, isCorrect) {
    const messageBox = document.getElementById('message-box');
    const message = document.createElement('div');
    message.className = `message ${isCorrect ? 'correct' : 'incorrect'}`;
    message.textContent = content;

    messageBox.appendChild(message);

    // 자동 스크롤
    messageBox.scrollTop = messageBox.scrollHeight;
}

// 메시지 박스 초기화
function clearMessages() {
    const messageBox = document.getElementById('message-box');
    messageBox.innerHTML = ''; // 기존 메시지 삭제
}

// 클릭 이벤트 추가
function addTileClickEvents(hand) {
    const handContainer = document.getElementById('hand');
    const recommendedTile = getRecommendedTile(hand);

    handContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('tile')) {
            const clickedTileSymbol = event.target.textContent;
            const seatWind = document.getElementById('seat-wind-tile').textContent;
            const doraTile = document.getElementById('dora-indicator-tile').textContent;

            if (clickedTileSymbol === recommendedTile.symbol) {
                addMessage(`정답입니다! 이유: ${clickedTileSymbol}은(는) 가치가 낮아 버리기 적합한 타일입니다. 새로운 패를 뽑습니다.`, true);
                drawHand(); // 정답인 경우 손패를 새로 생성
            } else {
                let reason = '';
                if (clickedTileSymbol === seatWind) {
                    reason = `${clickedTileSymbol}은(는) 당신의 자풍(바람)으로, 이 타일로 점수를 높일 수 있는 기회를 잃을 수 있습니다. 자풍은 게임에서 중요한 역할을 하며, 적절히 사용하면 더 많은 점수를 얻을 수 있습니다.`;
                } else if (clickedTileSymbol === doraTile) {
                    reason = `${clickedTileSymbol}은(는) 도라로, 게임 점수를 높이는 중요한 타일입니다. 도라 타일은 추가 점수를 제공하므로, 가능한 한 버리지 않는 것이 좋습니다.`;
                } else {
                    reason = `${clickedTileSymbol}은(는) 동일한 종류의 숫자나 순서가 인접한 타일과 연결될 가능성이 높아 유용할 수 있습니다. 이 타일을 버리면 멘젠(손의 완성)에 필요한 조합을 만들기 어려울 수 있습니다.`;
                }
                addMessage(`오답입니다! 이유: ${reason} 동일한 패를 유지합니다.`, false);
            }
        }
    });
}

// 손패 생성
function drawHand() {
    setRandomConditions(); // 자풍과 도라도 변경되도록 추가
    const handContainer = document.getElementById('hand');
    handContainer.innerHTML = ''; // 기존 패 초기화
    const hand = [];
    while (hand.length < 13) {
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        if (hand.filter(t => t.id === randomTile.id).length < 4) {
            hand.push(randomTile);
        }
    }
    const sortedHand = hand.sort((a, b) => {
        const typeOrder = { man: 0, sou: 1, pin: 2 };
        if (typeOrder[a.type] === typeOrder[b.type]) {
            return parseInt(a.id[0]) - parseInt(b.id[0]);
        }
        return typeOrder[a.type] - typeOrder[b.type];
    });
    renderHand(sortedHand);
    return sortedHand;
}


// 초기화
document.getElementById('draw-button').addEventListener('click', () => {
    clearMessages(); // 메시지 박스 초기화
    drawHand();
});
setRandomConditions();
drawHand();
