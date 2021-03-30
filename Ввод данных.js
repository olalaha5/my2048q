let segments = document.querySelectorAll('.segment');
let nSeg = 0;
let q = 1;

//увеличение
function sumScale(a) {
    let sc = 1;
    function scale() {
        sc += 0.01;
        a.style.transform = `scale(${sc})`;
    };
    function scaleN(el) {
        sc -= 0.01;
        a.style.transform = `scale(${sc})`;
    };
    let time = setInterval(scale, 10, a);
    setTimeout(() => clearInterval(time), 91);
    let timeN;
    setTimeout(() => timeN = setInterval(scaleN, 10, a), 91);
    setTimeout(() => { clearInterval(timeN); a.style.transform = `scale(1)` }, 182);
    a.removeAttribute('data-sum');
}

//рандомная постановка
function randomSet() {
    if (nSeg < 16 && q === 1) {
        let X = Math.floor(Math.random() * 4);
        let Y = Math.floor(Math.random() * 4);
        while (segments[Y * 4 + X].innerHTML !== '') {
            X = Math.floor(Math.random() * 4);
            Y = Math.floor(Math.random() * 4);
        };
        let n;
        if (Math.random() * 10 <= 1) {
            n = 4;
        } else {
            n = 2;
        };
        segments[Y * 4 + X].style.display = 'none';
        segments[Y * 4 + X].textContent = n;
        segments[Y * 4 + X].classList.add(`n${n}`);
        nSeg++;
        segments[Y * 4 + X].style.transform = `scale(0)`
        segments[Y * 4 + X].style.display = 'inline-block';
        let sc = 0;
        function scale() {
            sc += 0.01;
            segments[Y * 4 + X].style.transform = `scale(${sc})`;
        };
        let newScale = setInterval(scale, 5, segments[Y * 4 + X], sc);
        setTimeout(() => { clearInterval(newScale); segments[Y * 4 + X].style.transform = `scale(1)` }, 500);
    };
    q = 0;
};
randomSet();
//сумма
function sum(a, b) {
    a.classList.remove(`n${a.textContent}`);
    b.classList.remove(`n${b.textContent}`);

    a.textContent = a.textContent * 2;
    b.textContent = '';

    a.classList.add(`n${a.textContent}`);
    q = 1;
    nSeg = nSeg - 1;
    a.setAttribute('data-sum', 1);
};


function run(a, b, c) {
    for (let i = 0; i < 4; i++) {
        let allElem = [segments[i * c], segments[b + i * c], segments[b * 2 + i * c], segments[b * 3 + i * c]];
        if (a === 1) {
            [allElem[0], allElem[1], allElem[2], allElem[3]] = [allElem[3], allElem[2], allElem[1], allElem[0]]
        };
        allElem = allElem.filter(elem => elem.textContent !== '');
        for (let j = 0; j < allElem.length - 1; j++) {
            if (allElem[j].textContent === allElem[j + 1].textContent && allElem[j].textContent !== '') {
                sum(allElem[j], allElem[j + 1]);
            };
        };
        allElem = allElem.filter(elem => elem.textContent !== '');
        for (let j = 0; j <= allElem.length - 1; j++) {
            let bCof = (a === 1 ? 3 - j : j);
            if (segments[b * bCof + i * c] !== allElem[j]) {
                segments[b * bCof + i * c].classList.remove(`n${segments[b * bCof + i * c].textContent}`);
                allElem[j].classList.remove(`n${allElem[j].textContent}`);
                segments[b * bCof + i * c].textContent = allElem[j].textContent;
                allElem[j].textContent = '';
                segments[b * bCof + i * c].classList.add(`n${segments[b * bCof + i * c].textContent}`);
                q = 1;
            }
            if (allElem[j].getAttribute('data-sum') === '1') {
                sc = 1;
                sumScale(segments[b * bCof + i * c]);
            };
        };
    };
    randomSet();
};


document.addEventListener('keydown',
    function (event) {
        if (event.code === 'ArrowDown' || event.code === 'KeyS') run(1, 4, 1);
        if (event.code === 'ArrowUp' || event.code === 'KeyW') run(0, 4, 1);
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') run(0, 1, 4);
        if (event.code === 'ArrowRight' || event.code === 'KeyD') run(1, 1, 4);
    }
);


let touchS = [0, 0]
let touchE = [0, 0]
document.addEventListener('touchstart', tch);
function tch(event) {
    touchS[0] = event.changedTouches[0].clientX
    touchS[1] = event.changedTouches[0].clientY
};
document.addEventListener('touchend', tch1);
function tch1(event) {
    touchE[0] = event.changedTouches[0].clientX
    touchE[1] = event.changedTouches[0].clientY
    if (touchS[1] - touchE[1] > 10 && (touchS[1] - touchE[1]) / 2 > Math.abs(touchS[0] - touchE[0])) run(0, 4, 1)
    else if (touchS[0] - touchE[0] < -10 && Math.abs(touchS[0] - touchE[0]) / 2 > Math.abs(touchS[1] - touchE[1])) run(1, 1, 4)
    else if (touchS[1] - touchE[1] < -10 && Math.abs(touchS[1] - touchE[1]) / 2 > Math.abs(touchS[0] - touchE[0])) run(1, 4, 1)
    else if (touchS[0] - touchE[0] > 10 && Math.abs(touchS[0] - touchE[0]) / 2 > Math.abs(touchS[1] - touchE[1])) run(0, 1, 4)
};