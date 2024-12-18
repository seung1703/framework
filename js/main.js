// 화면 크기에 따라 로고 이미지를 변경
function changeLogo() {
    const logo = document.getElementById('logo-img'); // 로고 이미지 요소 선택
    const width = window.innerWidth; // 현재 브라우저 창 너비 가져오기

    if (width <= 480) {
        // 화면 너비가 480px 이하인 경우 (모바일 화면)
        logo.src = '../media/logo(2).png'; // 모바일용 로고 이미지 설정
    } else if (width <= 1200) {
        // 화면 너비가 481px 이상 1200px 이하인 경우 (태블릿 화면)
        logo.src = '../media/logo(2).png'; // 태블릿용 로고 이미지 설정
    } else {
        // 화면 너비가 1201px 이상인 경우 (PC 화면)
        logo.src = '../media/mainimg.png'; // 기본 PC용 로고 이미지 설정
    }
}

// 이미지 미리 로드
function preload(...paths) {
    paths.forEach(src => {
        const img = new Image(); // 새로운 이미지 객체 생성
        img.src = src; // 이미지 경로 설정
    });
}

// 초기화
function init() {
    // 로고 이미지 미리 로드
    preload('../media/mainimg.png', '../media/logo(2).png', '../media/logo(2).png');

    // 초기 로고 설정
    changeLogo();

    // 화면 크기 변경 시 로고 변경
    window.addEventListener('resize', changeLogo);
}

// DOMContentLoaded 이벤트에서 초기화 함수 호출
document.addEventListener('DOMContentLoaded', init);
