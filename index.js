'use strict'

let images = document.querySelectorAll('.portfolio__img');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

function handleImg(myImg, observer) {
    myImg.forEach((myImgSingle) => {        
        if(myImgSingle.intersectionRatio > 0) {
            loadImage(myImgSingle.target);
        }
    })
}

function loadImage(image) {
    image.src = image.getAttribute('data');
}

const observer = new IntersectionObserver(handleImg, options);

images.forEach(image => {
    observer.observe(image);
})

let accBtns = document.querySelectorAll('.experience__item');

accBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');
        let panel = this.querySelector('.experience__description');
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
    });
})