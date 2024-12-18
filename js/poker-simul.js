
// 카드의 무늬와 숫자를 정의 (클럽, 다이아몬드, 하트, 스페이드)
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

// 카드 이미지 경로를 저장할 배열
const cardImages = generateCardImagePaths();

// 플레이어 손패, 커뮤니티 카드, 컴퓨터 최적 족보 초기화
let playerHand = [];
let communityCards = [];
let computerBestHand = '';


// 모든 카드 이미지 경로를 생성하는 함수
function generateCardImagePaths() {
    const paths = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            // 각 무늬와 숫자를 조합해 파일 경로 생성
            paths.push(`${rank}_of_${suit}.png`);
        });
    });
    return paths;
}

// 배열을 랜덤하게 섞는 함수 (카드 셔플)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];// 배열 요소를 교환
    }
}

// 게임 종류를 선택하고 카드 분배를 수행하는 함수
function selectGame(gameType) {
    resetGame();// 기존 게임 데이터를 초기화
    const cardPool = [...cardImages]; // 카드 이미지를 복사해 풀(deck)을 만듦
    shuffle(cardPool);// 카드 섞기
    // 게임 종류에 따라 손패 및 커뮤니티 카드 분배
    if (gameType === 'texas') {
        playerHand = cardPool.splice(0, 2);
        communityCards = cardPool.splice(0, 5);
    } else if (gameType === 'omaha') {
        playerHand = cardPool.splice(0, 4);
        communityCards = cardPool.splice(0, 5);
    } else if (gameType === 'stud') {
        playerHand = cardPool.splice(0, 7);
    } //else if (gameType === 'draw') {
        //playerHand = cardPool.splice(0, 5);
    //}

    displayCards();
    computerBestHand = calculateBestHand([...playerHand, ...communityCards]);
}
// 카드를 화면에 표시하는 함수
function displayCards() {
    document.getElementById('hand-cards').innerHTML = playerHand.map(card => createCardHTML(card)).join('');
    document.getElementById('community-cards').innerHTML = communityCards.map(card => createCardHTML(card)).join('');
}
// HTML 요소로 카드를 생성하는 함수
function createCardHTML(card) {
    return `<div class="card" style="background-image: url('../media/Playing-Cards/${card}')"></div>`;
}
// 게임 데이터를 초기화하는 함수
function resetGame() {
    playerHand = [];
    communityCards = [];
    computerBestHand = '';
    document.getElementById('hand-cards').innerHTML = '';
    document.getElementById('community-cards').innerHTML = '';
    document.getElementById('feedback').textContent = '';
}
//족보를 계산하는 함수
function calculateBestHand(cards) {
    if (!cards || cards.length < 5) {
        console.error('calculateBestHand: 카드 배열이 유효하지 않습니다.', cards);
        return 'High Card'; // 기본값 반환
    }

    const ranks = getRanks(cards);
    const suits = getSuits(cards);

    if (isRoyalFlush(ranks, suits)) return 'Royal Flush';
    if (isStraightFlush(ranks, suits)) return 'Straight Flush';
    if (isFourOfAKind(ranks)) return 'Four of a Kind';
    if (isFullHouse(ranks)) return 'Full House';
    if (isFlush(suits)) return 'Flush';
    if (isStraight(ranks)) return 'Straight';
    if (isThreeOfAKind(ranks)) return 'Three of a Kind';
    if (isTwoPair(ranks)) return 'Two Pair';
    if (isOnePair(ranks)) return 'One Pair';
    return 'High Card'; // 기본값 반환
}

// 추가 보조 함수

// 로열 플러시
function isRoyalFlush(ranks, suits) {
    const royalRanks = [10, 11, 12, 13, 14];
    return isFlush(suits) && royalRanks.every(rank => ranks.includes(rank));
}

// 스트레이트 플러시
function isStraightFlush(ranks, suits) {
    return isFlush(suits) && isStraight(ranks);
}

// 포카드
function isFourOfAKind(ranks) {
    const counts = countRanks(ranks);
    return Object.values(counts).includes(4);
}

// 풀하우스
function isFullHouse(ranks) {
    const counts = countRanks(ranks);
    const values = Object.values(counts);
    return values.includes(3) && values.includes(2);
}

// 플러시
function isFlush(suits) {
    return suits.every(suit => suit === suits[0]);
}

// 스트레이트
function isStraight(ranks) {
    const rankValues = [...new Set(ranks.map(rankToValue))].sort((a, b) => a - b);

    // Ace를 1로 사용할 수 있도록 처리
    if (rankValues.includes(14)) rankValues.unshift(1);

    if (rankValues.length < 5) return false;

    for (let i = 0; i <= rankValues.length - 5; i++) {
        const slice = rankValues.slice(i, i + 5);
        if (slice.every((num, index, arr) => !index || num === arr[index - 1] + 1)) {
            return true;
        }
    }
    return false;
}

// 트리플
function isThreeOfAKind(ranks) {
    const counts = countRanks(ranks);
    return Object.values(counts).includes(3);
}

// 투페어
function isTwoPair(ranks) {
    const counts = countRanks(ranks);
    return Object.values(counts).filter(count => count === 2).length === 2;
}

// 원페어
function isOnePair(ranks) {
    const counts = countRanks(ranks);
    return Object.values(counts).includes(2);
}

// 숫자 랭크를 값으로 변환
function rankToValue(rank) {
    const rankMap = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        'jack': 11, 'queen': 12, 'king': 13, 'ace': 14,
    };
    return rankMap[rank.toLowerCase()] || 0;
}
// 숫자별 개수를 세는 함수
function countRanks(ranks) {
    if (!ranks || ranks.length === 0) {
        console.error('countRanks: ranks 배열이 비어있습니다.', ranks);
        return {};
    }
    return ranks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {});
}

// 사용자 선택
function evaluateChoice() {
    const userChoice = document.getElementById('user-hand-choice').value; // 사용자가 선택한 족보
    const feedback = document.getElementById('feedback'); // 결과를 보여줄 영역

    // 컴퓨터 최적 족보가 비어있는 경우 기본값 설정
    if (!computerBestHand || computerBestHand === '') {
        console.error('evaluateChoice: computerBestHand 값이 비어있습니다.');
        computerBestHand = 'High Card'; // 기본값 설정
    }

    if (userChoice === computerBestHand) {
        feedback.textContent = `훌륭해요! '${userChoice}'를 선택하셨군요. 현재 카드 상황에서는 이 전략이 가장 효과적이에요. 계속 이렇게 판단하시면 승리 확률이 높아질 거예요!`;
    } else {
        feedback.textContent = ` '${userChoice}'도 시도해볼 만한 선택이었지만, 현재 카드 상황에서는 '${computerBestHand}'를 노리는 것이 더 나은 전략이에요. 다음 기회에 더 나은 판단을 기대해볼까요?`;
    }
}

function getRanks(cards) {
    if (!cards || !cards.length) {
        console.error('getRanks: cards 배열이 비어있습니다.', cards);
        return [];
    }
    return cards.map(card => card.split('_')[0]);
}

function getSuits(cards) {
    if (!cards || !cards.length) {
        console.error('getSuits: cards 배열이 비어있습니다.', cards);
        return [];
    }
    return cards.map(card => card.split('_')[2]?.replace('.png', ''));
}
