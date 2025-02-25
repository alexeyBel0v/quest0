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

// Локации с правильным расширением .png
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

const n8nWebhook = "https://your-ngrok-url.ngrok.io/webhook/quest-start";

function sendToN8n(data) {
    fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            plotText.textContent = data.message;
            optionsDiv.innerHTML = data.options ? data.options.map(opt => `<button onclick="sendToN8n({ choice: '${opt}' })">${opt}</button>`).join('') : '';
            if (data.location) locationImg.src = data.location;
            animateScene();
        }
    })
    .catch(error => {
        console.error("n8n error:", error);
        plotText.textContent = "Ошибка связи с сервером. Попробуй позже.";
    });
}

function animateScene() {
    gsap.from('#location', { opacity: 0, scale: 1.1, duration: 1, ease: 'power4.out' });
    gsap.from('#plot', { opacity: 0, y: 20, duration: 1, ease: 'back.out(1.7)' });
    gsap.from('#options button', { opacity: 0, y: 20, duration: 1, delay: 0.2, ease: 'elastic.out(1, 0.5)', stagger: 0.1 });
}

plotText.textContent = "Добро пожаловать в DUNGEON QUEST. Выбери свой пол:";

femaleBtn.addEventListener('click', () => sendToN8n({ gender: "female" }));
maleBtn.addEventListener('click', () => {
    plotText.textContent = "Как настоящий мужчина, выбери сложность подземелья:";
    optionsDiv.innerHTML = `
        <button onclick="sendToN8n({ difficulty: 'easy' })">Лёгкая</button>
        <button onclick="sendToN8n({ difficulty: 'medium' })">Средняя</button>
        <button onclick="sendToN8n({ difficulty: 'hard' })">Сложная</button>
    `;
    animateScene();
});
