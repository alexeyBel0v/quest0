console.log("Scripts.js loaded");

if (typeof gsap !== 'undefined') {
    console.log("GSAP loaded");

    gsap.from('header', { 
        opacity: 0, 
        y: -50, 
        duration: 1, 
        ease: 'bounce.out' 
    });
    gsap.from('.game', { 
        opacity: 0, 
        scale: 0.8, 
        duration: 1.5, 
        ease: 'elastic.out(1, 0.5)' 
    });
}

window.Telegram.WebApp.ready();
const userId = window.Telegram.WebApp.initDataUnsafe.user?.id || "test_user";

const locationImg = document.getElementById('location');
const plotText = document.getElementById('plot');
const optionsDiv = document.getElementById('options');
const maleBtn = document.getElementById('gender-male');
const femaleBtn = document.getElementById('gender-female');

const baseUrl = "https://dungeonquest0.netlify.app/";

const locations = [
    { name: "Темница теней", url: `${baseUrl}img/dungeon background 1.png` },
    { name: "Забытый коридор", url: `${baseUrl}img/dungeon background 2.png` },
    { name: "Пещера костей", url: `${baseUrl}img/dungeon background 3.png` },
    { name: "Лабиринт эха", url: `${baseUrl}img/dungeon background 4.png` },
    { name: "Зал цепей", url: `${baseUrl}img/dungeon background 5.png` },
    { name: "Тронный зал", url: `${baseUrl}img/dungeon background 6.png` },
    { name: "Каменный разлом", url: `${baseUrl}img/dungeon background 7.png` },
    { name: "Подземный храм", url: `${baseUrl}img/dungeon background 8.png` },
    { name: "Туннель пауков", url: `${baseUrl}img/dungeon background 9.png` },
    { name: "Затопленная крипта", url: `${baseUrl}img/dungeon background 10.png` },
    { name: "Огненная бездна", url: `${baseUrl}img/dungeon background 11.png` },
    { name: "Врата судьбы", url: `${baseUrl}img/dungeon background 12.png` }
];

plotText.textContent = "Добро пожаловать в DUNGEON QUEST. Выбери свой пол:";

function animateScene() {
    gsap.from('#location', { opacity: 0, scale: 1.1, duration: 1, ease: 'power4.out' });
    gsap.from('#plot', { opacity: 0, y: 20, duration: 1, ease: 'back.out(1.7)' });
    gsap.from('#options button', { opacity: 0, y: 20, duration: 1, delay: 0.2, ease: 'elastic.out(1, 0.5)', stagger: 0.1 });
}

femaleBtn.addEventListener('click', () => {
    plotText.textContent = "Для вас игра очень тяжёлая, попросите мужчину помочь вам и вернитесь.";
    optionsDiv.innerHTML = '<button onclick="location.reload()">Начать заново</button>';
    animateScene();
});

maleBtn.addEventListener('click', () => {
    plotText.textContent = "Как настоящий мужчина, выбери сложность подземелья:";
    optionsDiv.innerHTML = `
        <button id="easy">Лёгкая</button>
        <button id="medium">Средняя</button>
        <button id="hard">Сложная</button>
    `;
    animateScene();

    document.getElementById('easy').addEventListener('click', () => {
        plotText.textContent = "Как настоящий мужчина вы решили не заморачиваться, подземелье пройдено, всего доброго!";
        optionsDiv.innerHTML = '<button onclick="location.reload()">Начать заново</button>';
        animateScene();
    });

    document.getElementById('medium').addEventListener('click', () => {
        startGame(10);
    });

    document.getElementById('hard').addEventListener('click', () => {
        startGame(30);
    });
});

function startGame(scenes) {
    let currentScene = 0;

    function getRandomLocation() {
        const randomIndex = Math.floor(Math.random() * locations.length);
        return locations[randomIndex];
    }

    function nextScene() {
        if (currentScene < scenes) {
            const location = getRandomLocation();
            locationImg.src = location.url;
            plotText.textContent = `Сцена ${currentScene + 1}: Ты в ${location.name}. Ты спускаешься в тёмное подземелье, слышишь шаги за углом.`;
            optionsDiv.innerHTML = `
                <button onclick="nextScene()">Пойти налево</button>
                <button onclick="nextScene()">Пойти направо</button>
            `;
            animateScene();
            currentScene++;
        } else {
            plotText.textContent = "Поздравляем, ты прошёл подземелье!";
            optionsDiv.innerHTML = '<button onclick="location.reload()">Начать заново</button>';
            animateScene();
        }
    }

    nextScene();
}
