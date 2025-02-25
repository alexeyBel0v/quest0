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

const plotText = document.getElementById('plot');
const optionsDiv = document.getElementById('options');
const gameSection = document.querySelector('.game');

const baseUrl = window.location.href.includes('netlify') ? "https://dungeonquest0.netlify.app/" : "";
const deepSeekApiKey = "sk-86563994b0f247b4aee3b4403a0a2092"; // Замени на свой ключ

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

function animateScene() {
    gsap.from('#plot', { opacity: 0, y: 20, duration: 1, ease: 'back.out(1.7)' });
    gsap.from('#options button', { opacity: 0, y: 20, duration: 1, delay: 0.2, ease: 'elastic.out(1, 0.5)', stagger: 0.1 });
}

async function getDeepSeekResponse(prompt, sceneNum, locationName) {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${deepSeekApiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "Ты — создатель квестов в стиле подземелий. Генерируй короткий сюжет (50-70 слов) для сцены и 2 варианта выбора. Локация: " + locationName + ". Формат ответа: { \"plot\": \"...\", \"options\": [\"Вариант 1\", \"Вариант 2\"] }" },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7
        })
    });
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

optionsDiv.addEventListener('click', async (event) => {
    const target = event.target;

    if (target.id === 'start') {
        document.body.style.backgroundImage = `url('${baseUrl}img/malefemale.png')`;
        gameSection.classList.remove('welcome');
        plotText.textContent = "Добро пожаловать в DUNGEON QUEST. Выбери свой пол:";
        optionsDiv.innerHTML = `
            <button id="gender-male">Мужчина</button>
            <button id="gender-female">Женщина</button>
        `;
        animateScene();
    } else if (target.id === 'gender-female') {
        plotText.textContent = "Для вас игра очень тяжёлая, попросите мужчину помочь вам и вернитесь.";
        optionsDiv.innerHTML = '<button id="restart">Начать заново</button>';
        animateScene();
    } else if (target.id === 'gender-male') {
        plotText.textContent = "Как настоящий мужчина, выбери сложность подземелья:";
        optionsDiv.innerHTML = `
            <button id="easy">Лёгкая</button>
            <button id="medium">Средняя</button>
            <button id="hard">Сложная</button>
        `;
        animateScene();
    } else if (target.id === 'easy') {
        plotText.textContent = "Как настоящий мужчина вы решили не заморачиваться, подземелье пройдено, всего доброго!";
        optionsDiv.innerHTML = '<button id="restart">Начать заново</button>';
        animateScene();
    } else if (target.id === 'medium') {
        startGame(10);
    } else if (target.id === 'hard') {
        startGame(30);
    } else if (target.id === 'left' || target.id === 'right') {
        nextScene(target.id);
    } else if (target.id === 'restart') {
        location.reload();
    }
});

function startGame(scenes) {
    let currentScene = 0;

    function getRandomLocation() {
        const randomIndex = Math.floor(Math.random() * locations.length);
        console.log("Trying to load:", locations[randomIndex].url);
        return locations[randomIndex];
    }

    window.nextScene = async function(choice) {
        if (currentScene < scenes) {
            const location = getRandomLocation();
            document.body.style.backgroundImage = `url('${location.url}')`;
            const deepSeekData = await getDeepSeekResponse(
                `Сцена ${currentScene + 1} в подземелье. Что происходит?`,
                currentScene + 1,
                location.name
            );
            plotText.textContent = deepSeekData.plot;
            optionsDiv.innerHTML = `
                <button id="left">${deepSeekData.options[0]}</button>
                <button id="right">${deepSeekData.options[1]}</button>
            `;
            animateScene();
            currentScene++;
        } else {
            plotText.textContent = "Поздравляем, ты прошёл подземелье!";
            optionsDiv.innerHTML = '<button id="restart">Начать заново</button>';
            animateScene();
        }
    };

    nextScene();
}
