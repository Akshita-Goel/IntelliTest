const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popupTutorial');
const main = document.querySelector('.main');

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}