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

// Элементы интерфейса
const locationImg = document.getElementById('location');
const plotText = document.getElementById('plot');
const optionsDiv = document.getElementById('options');
const maleBtn = document.getElementById('gender-male');
const femaleBtn = document.getElementById('gender-female');

// Список локаций (12 подземелий)
const locations = [
    { name: "Темница теней", url: "img/dungeon background 1.jpg" },
    { name: "Забытый коридор", url: "img/dungeon background 2.jpg" },
    { name: "Пещера костей", url: "img/dungeon background 3.jpg" },
    { name: "Лабиринт эха", url: "img/dungeon background 4.jpg" },
    { name: "Зал цепей", url: "img/dungeon background 5.jpg" },
    { name: "Тронный зал", url: "img/dungeon background 6.jpg" },
    { name: "Каменный разлом", url: "img/dungeon background 7.jpg" },
    { name: "Подземный храм", url: "img/dungeon background 8.jpg" },
    { name: "Туннель пауков", url: "img/dungeon background 9.jpg" },
    { name: "Затопленная крипта", url: "img/dungeon background 10.jpg" },
    { name: "Огненная бездна", url: "img/dungeon background 11.jpg" },
    { name: "Врата судьбы", url: "img/dungeon background 12.jpg" }
];

// Начальная сцена
plotText.textContent = "Добро пожаловать в DUNGEON QUEST. Выбери свой пол:";

// Выбор пола
femaleBtn.addEventListener('click', () => {
    plotText.textContent = "Для вас игра очень тяжёлая, попросите мужчину помочь вам и вернитесь.";
    optionsDiv.innerHTML = '<button onclick="location.reload()">Начать заново</button>';
    gsap.from(plotText, { opacity: 0, y: 20, duration: 1, ease: 'power4.out' });
});

maleBtn.addEventListener('click', () => {
    plotText.textContent = "Как настоящий мужчина, выбери сложность подземелья:";
    optionsDiv.innerHTML = `
        <button id="easy">Лёгкая</button>
        <button id="medium">Средняя</button>
        <button id="hard">Сложная</button>
    `;
    gsap.from(optionsDiv, { opacity: 0, y: 20, duration: 1, ease: 'back.out(1.7)' });

    // Выбор сложности
    document.getElementById('easy').addEventListener('click', () => {
        plotText.textContent = "Как настоящий мужчина вы решили не заморачиваться, подземелье пройдено, всего доброго!";
        optionsDiv.innerHTML = '<button onclick="location.reload()">Начать заново</button>';
        gsap.from(plotText, { opacity: 0, y: 20, duration: 1, ease: 'power4.out' });
    });

    document.getElementById('medium').addEventListener('click', () => {
        startGame(10); // 10 сцен
    });

    document.getElementById('hard').addEventListener('click', () => {
        startGame(30); // 20-30 сцен
    });
});

// Логика игры
function startGame(scenes) {
    let currentScene = 0;

    function getRandomLocation() {
        const randomIndex = Math.floor(Math.random() * locations.length);
        return locations[randomIndex];
    }

    function nextScene() {
        if (currentScene < scenes) {
            const location = getRandomLocation(); // Случайная локация
            locationImg.src = location.url;
            plotText.textContent = `Сцена ${currentScene + 1}: Ты в ${location.name}. [Заглушка DeepSeek: ты спускаешься в тёмное подземелье, слышишь шаги за углом].`;
            optionsDiv.innerHTML = `
                <button onclick="nextScene()">Пойти налево</button>
                <button onclick="nextScene()">Пойти направо</button>
            `;
            gsap.from('#location', { opacity: 0, scale: 1.1, duration: 1, ease: 'power4.out' });
            gsap.from(plotText, { opacity: 0, y: 20, duration: 1, ease: 'back.out(1.7)' });
            gsap.from(optionsDiv, { opacity: 0, y: 20, duration: 1, delay: 0.2, ease: 'elastic.out(1, 0.5)' });
            currentScene++;
        } else {
            plotText.textContent = "Поздравляем, ты прошёл подземелье!";
            optionsDiv.innerHTML = '<button onclick="location.reload()">Начать заново</button>';
            gsap.from(plotText, { opacity: 0, y: 20, duration: 1, ease: 'power4.out' });
        }
    }

    nextScene();
}