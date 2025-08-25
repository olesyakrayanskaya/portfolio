'use strict'

// инициализация canvas

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// генерация случайного числа из диапазона

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// массив кругов

let circles = [];

// массив используемых цветов

const colors = ['#1a0ed3', '#f21dbb', '#6e28a8ff', '#7ab7e9ff'];

// инициализация круга

function initCircles() {

    // очищаем предыдущие круги

    circles = [];

    // количество кругов, в зависимости от ширины экрана

    let circleCount = window.innerWidth / 100;

    // цикл по количеству кругов 

    for (let i = 0; i < circleCount; i++) {

        // радиус кругов

        let radius = window.innerWidth / 4;

        // позиция круга на холсте по оси X

        let x = randomBetween(radius, canvas.width - radius);

        // позиция круга на холсте по оси Y

        let y = randomBetween(radius, canvas.height - radius);

        // скорость движения по оси X

        let dx = randomBetween(window.innerWidth / -600, window.innerWidth / 600);

        // скорость движения по оси Y

        let dy = randomBetween(window.innerHeight / -600, window.innerHeight / 600);

        // случайный цвет из массива цветов

        let color = colors[Math.floor(Math.random() * colors.length)];

        // добавляем в наш массив кругов новые данные

        circles.push({ x, y, dx, dy, radius, color });
    }

}

//  функция отрисовки круга

function drawCircle(circle) {

    ctx.beginPath();

    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);

    ctx.fillStyle = circle.color;

    ctx.fill();

    ctx.closePath();
}

// функция анимации

function animate() {

    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {

        // если круг выходит за пределы холста по оси Х - двигаем в противоположном направлении

        if ((circle.x + circle.radius) > canvas.width || (circle.x - circle.radius) < 0) {

            circle.dx = -circle.dx;

        }

        // если круг выходит за пределы холста по оси Y - двигаем в противоположном направлении

        if ((circle.y + circle.radius) > canvas.height || (circle.y - circle.radius) < 0) {

            circle.dy = -circle.dy;

        }

        // движение круга

        circle.x += circle.dx;
        circle.y += circle.dy;

        // отрисовываем круг в новой позиции

        drawCircle(circle);

    })
}

// делаем холст всегда на весь экран, задаем его размеры больше размеров окна

function resizeCanvas() {

    canvas.width = window.innerWidth * 1.5;
    canvas.height = window.innerHeight * 1.5;

    // для новых размеров генерируем новые параметры кругов

    initCircles();

}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

initCircles();

animate();
