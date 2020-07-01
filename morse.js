var last = 0;
var text = "";
var start = 0;
var end = 0;
var noting = false;
var pressing = false;
let unit = 60;
let funit = 80;

var letter = "";
var translated = "";

var audioContext;
var sine;
var gain;

var started = false;

const AudioContext = window.AudioContext || window.webkitAudioContext;

var keys = new Map([
    ['.-', 'A'],
    ['-...', 'B'],
    ['-.-.', 'C'],
    ['-..', 'D'],
    ['.', 'E'],
    ['..-.', 'F'],
    ['--.', 'G'],
    ['....', 'H'],
    ['..', 'I'],
    ['.---', 'J'],
    ['-.-', 'K'],
    ['.-..', 'L'],
    ['--', 'M'],
    ['-.', 'N'],
    ['---', 'O'],
    ['.--.', 'P'],
    ['--.-', 'Q'],
    ['.-.', 'R'],
    ['...', 'S'],
    ['-', 'T'],
    ['..-', 'U'],
    ['...-', 'V'],
    ['.--', 'W'],
    ['-..-', 'X'],
    ['-.--', 'Y'],
    ['--..', 'Z'],
    ['-----', '0'],
    ['.----', '1'],
    ['..---', '2'],
    ['...--', '3'],
    ['....-', '4'],
    ['.....', '5'],
    ['-....', '6'],
    ['--...', '7'],
    ['---..', '8'],
    ['----.', '9'],
    ['.-.-', 'ä'],
    ['.--.-', 'á'],
    ['.--.-', 'å'],
    ['----', 'Ch'],
    ['..-..', 'é'],
    ['--.--', 'ñ'],
    ['---.', 'ö'],
    ['..--', 'ü'],
    ['.-...', '&'],
    ['.----.', "'"],
    ['.--.-.', '@'],
    ['-.--.-', ')'],
    ['-.--.', '('],
    ['---...', ':'],
    ['--..--', ','],
    ['-...-', '='],
    ['-.-.--', '!'],
    ['.-.-.-', '.'],
    ['-....-', '-'],
    ['.-.-.', '+'],
    ['.-..-.', '"'],
    ['..--..', '?'],
    ['-..-.', '/']
]);

window.onload = (event) => {

    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }

    last = Date.now();
    start = Date.now();
    document.querySelector("#container").innerHTML = "";

    document.querySelector("#start-button").addEventListener('click', () => {
        if (!started) startAudio();
        [...document.querySelectorAll(".dissapearing")].map(e => e.style.display = 'none');
        document.querySelector("#paddle").style.display = 'block';
    })

    document.querySelector("#clear-button").addEventListener('click', () => {
        text = "";
        letter = "";
        translated = "";
        start = Date.now();
        update();
    });
    
    // document.addEventListener('touchstart', inputDown);
    // document.addEventListener('mousedown', inputDown);
    // document.addEventListener('touchend', inputUp);
    // document.addEventListener('dblclick', inputUp);
    // document.addEventListener('mouseup', inputUp);

    document.querySelector("#paddle").addEventListener('click dblclick', (e) => {
        e.preventDefault();
    });

    document.querySelector("#paddle").addEventListener('mousedown', inputDown);
    document.querySelector("#paddle").addEventListener('mouseup', inputUp);
    document.querySelector("#paddle").addEventListener('touchstart', inputDown);
    document.querySelector("#paddle").addEventListener('touchend', inputUp);
}

document.addEventListener('keydown', inputDown);

// T = 1200 / W // where t = time in ms and w = wpm for PARIS
// T = 1200 / 15 wpm
// T = 80 ms for one dit ie one unit of time

document.addEventListener('keyup', inputUp);

function inputDown (evt) {
    evt.preventDefault();

    if (evt.key == "r" || evt.key == "R") {
        text = "";
        letter = "";
        translated = "";
        start = Date.now();
    } else { 
        if (pressing == false) {
            pressing = true;
            noting = true;
            start = Date.now();
            gain.gain.value = 1;
        }
    }
    update();
}

function inputUp (evt) {
    evt.preventDefault();

    if (evt.key == "r" || evt.key == "R") {
        return;
    } 

    pressing = false;

    gain.gain.value = 0;
    // text += Date.now() - start;

    if (Date.now() - start < unit * 3) {
        letter += '.';
        text += ".";
    } else {
        letter += '-';
        text += "-";
    }

    setTimeout(() => {
        if (Date.now() - start >= funit * 3) {
            noting = false;
            text += "    ";
            addLetter();
            letter = "";
            update();
        }
    }, funit * 3);

    setTimeout(() => {
        if (Date.now() - start >= funit * 10) {
            text += "    /    ";
            translated += " ";
            update();
        }
    }, funit * 10);

    update();
}

function update () {
    document.querySelector("#container").innerHTML = text;
    // document.querySelector("#noting").innerHTML = noting;
    document.querySelector("#translated").innerHTML = translated;
}

function addLetter () {
    let attempt = keys.get(letter);
    translated += attempt ? attempt : "#";
}

function changeUnit (wpm) {
    unit = 1200 / wpm + 10;
}

function startAudio () {
    try {
        update();

        audioContext = new AudioContext();
        sine = audioContext.createOscillator();
        gain = audioContext.createGain();
        gain.gain.value = 0;

        gain.connect(audioContext.destination);
        sine.frequency.value = 550;
        sine.start();
        sine.connect(gain);

        started = true;
    } catch (e) {
        alert("no webaudio api");
    }
}