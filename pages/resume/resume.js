'use strict'

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