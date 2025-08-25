'use strict';

const NUM_PARTICLES = 300; // количество частиц
const MAX_SPEED = 0.6; // максимальная скорость
const PARTICLE_COLOR = 'rgba(207, 58, 230, 0.8)';
const LINE_COLOR = 'rgba(123, 35, 120, 0.2)';
const MOUSE_CONNECT_PERSENT = 0.2; // процент от ширины окна расстояния от курсора мыши до частиц (20%)
const PARTICLE_CONNECT_PERSENT = 0.05; // процент от ширины окна расстояния между двумя частицами (5%)
let particles = []; // массив частиц

let w = window.innerWidth;
let h = window.innerHeight;

let mouse = {
    x: 0,
    y: 0
}; // координаты курсора мыши

// холст

const canvasParticles = document.querySelector('#canvas');
const ctxParticles = canvasParticles.getContext('2d');

init(); // запускаем анимацию

// в функции объединены установка начального состояния холста и частиц
// установка обработчиков событий
// анимация частиц

function init() {
    initEvents();
    initStage();

    run();
}

// функция, устанавливающая обработчики событий resize окна и движения мыши

function initEvents() {
    window.addEventListener('resize', initStage);
    document.addEventListener('mousemove', onMouseMove);
}

// устанавливаем начальное состояние 

function initStage() {

    // устанавливаем ширину и высоту холста по ширине окна

    w = window.innerWidth;
    h = window.innerHeight;

    canvasParticles.setAttribute('width', w);
    canvasParticles.setAttribute('height', h);

    initParticles(); // создаем массив частиц
}

// записываем текущие координаты мыши

function onMouseMove(e) {
    mouse = {
        x: e.clientX,
        y: e.clientY
    };
}

// создаем массив частиц

function initParticles() {
    particles = [];

    let i = NUM_PARTICLES;
    let p, x, y, velX, velY, r;

    while (i--) {
        x = randomBetween(0, w);
        y = randomBetween(0, h);
        r = randomBetween(1, 3);

        velX = randomBetween(-MAX_SPEED, MAX_SPEED);
        velY = randomBetween(-MAX_SPEED, MAX_SPEED);

        p = new Particle(x, y, velX, velY, r);
        particles.push(p);
    }
}

// функция-конструктор, которая создает экземпляр - частицу;
// параметры x,y - начальные координаты частицы на холсте;
// параметры velX, velY - скорость движения частицы по оси X и оси Y;
// параметр r - радиус, размер частицы;

function Particle(x, y, velX, velY, r) {

    // создаем свойства частицы: координаты, скорость, размер(радиус):

    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.radius = r;

    // метод update отвечает за обновление позиции частицы и её взаимодействие с границами холста

    this.update = function () {
        this.x += this.velX;
        this.y += this.velY;

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        // Если частица выходит за границы холста (по оси X или Y), её скорость инвертируется
        // (velX = -velX или velY = -velY), что создает эффект "отскока"

        if (this.x <= 0 || this.x >= w) {
            this.velX = -this.velX;
        }

        if (this.y <= 0 || this.y >= h) {
            this.velY = -this.velY;
        }
    };

    // метод distanceTo вычисляет расстояние между текущей частицей и другой частицей p, переданной в качестве аргумента

    this.distanceTo = function (p) {
        // разница координат по осям X и Y
        let dx = p.x - this.x;
        let dy = p.y - this.y;
        // вычисляем расстояние по теореме Пифагора
        return Math.sqrt(dx * dx + dy * dy);
    };
}

//  функция run отвечает за анимацию частиц на холсте, их обновление, отрисовку и соединение линиями между собой и с курсором мыши

function run() {

    // requestAnimationFrame вызывает функцию run перед следующим обновлением экрана (обычно 60 раз в секунду)
    // это создает бесконечный цикл анимации

    window.requestAnimationFrame(run);

    // очищаем холст

    ctxParticles.clearRect(0, 0, w, h);

    let i = particles.length; // индекс текущей частицы (начинается с длины массива particles и уменьшается)
    let distance; // расстояние между двумя частицами
    let distanceMouse; // расстояние между частицей и курсором мыши
    let q; // индекс для вложенного цикла
    let p1; // временные переменные для хранения текущих частиц
    let p2; // временные переменные для хранения текущих частиц

    while (i--) {
        p1 = particles[i]; // текущая частица
        p1.update(); // обновление позиции частицы (вызов метода update у частицы)

        // отрисовываем частицу

        ctxParticles.beginPath();
        ctxParticles.fillStyle = PARTICLE_COLOR;
        ctxParticles.arc(p1.x, p1.y, p1.radius, 0, 2 * Math.PI, false);
        ctxParticles.fill();
        ctxParticles.closePath();

        // вычисляем расстояние от текущей частицы до курсора мыши

        distanceMouse = p1.distanceTo(mouse);

        // если это расстояние меньше или равно указанному - соединяем частицу и курсор мыши

        if (distanceMouse <= w * MOUSE_CONNECT_PERSENT) {
            // connect(p1, mouse) — вызов функции connect, которая рисует линию между частицей p1 и курсором мыши
            connect(p1, mouse);
        }

        // Вложенный цикл for проходит по всем частицам и проверяет расстояние между текущей частицей p1 и каждой другой частицей p2

        for (q = 0; q < particles.length; q++) {
            p2 = particles[q];
            distance = p2.distanceTo(p1);

            // Если расстояние меньше или равно указанному % ширины холста и p2 не равна p1, то частицы соединяются линией с помощью функции connect

            if (p2 !== p1 && distance <= w * PARTICLE_CONNECT_PERSENT) {
                connect(p1, p2);
            }
        }
    }
}

// функция, отрисовывает линию, соединяющую две частицы p1 и p2 между собой

function connect(p1, p2) {
    ctxParticles.beginPath();
    ctxParticles.strokeStyle = LINE_COLOR;

    ctxParticles.moveTo(p1.x, p1.y);
    ctxParticles.lineTo(p2.x, p2.y);
    ctxParticles.stroke();
    ctxParticles.closePath();
}

// функция возвращает целое случайное число в диапазоне 

function randomBetween(min, max) {
    let rand = Math.floor(Math.random() * (max - min + 1) + min);
    return rand;
}