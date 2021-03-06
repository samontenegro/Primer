function cellFontAdjust (cell) { // dinamically sets the font size to 30% of the cell height
    cell.style.fontSize = `${cell.offsetHeight * 30 / 100}px`; 
}

function formatCell(cell) { // sets size of cell according to percentage values
    cell.style.width = `${cell_width}%`;
    cell.style.height = `${cell_height}%`;
    cell.style.margin = `${cell_margin}%`;
}

function resizeCells(){ // resizes cells and font size by adjusting dinamically
    board.style.height = `${(board.offsetWidth)}px`;
    board.childNodes.forEach(function (x) {
    formatCell(x);
    cellFontAdjust(x);
    });
}

function addCells(N) { // adds cells to 'board'
    for (i=0;i<N**2;i++){
        let cell = document.createElement("div");
        cell.classList.add("cell");

        cell.appendChild(document.createElement("p"));
        cell.firstElementChild.textContent = `${i+1}`;

        formatCell(cell);
        board.appendChild(cell);
        resizeCells();
    }
}

function shuffle(array) { // shuffles an array using Fisher-Yates
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function makeSequence (n) { // generates a random sequence of the numbers 1, 2, ... , n^2 
    let seq = [];
    for (i=0;i<n**2;i++) {
        seq.push(i);
    }
    seq = shuffle(seq);
    return seq
}

function isPrime (num) { // checks whether a number 'num' is prime or not
        if (num == 1) return true;
        for(let i = 2, s = Math.sqrt(num); i <= s; i++){
            if(num % i === 0) return false;
        }
        return num > 1;
}

function getRandomInt (max) { // returns a positive random integer
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1)) +1;
}

function setNumbers () { // fills the N^2 cells with a number, so that N/2 cells contain primes
    let mapping = makeSequence(N);
    let cellArray = Array.from(cells);

    cells.forEach(function (x) {
        x.classList.remove('selected','highlight');
    });

    for (i=0;i<N**2;i += 2) {
        let val = getRandomInt(Diff_max);
        let selected_cell = cellArray[mapping[i]];
        let next_selected_cell = cellArray[mapping[i+1]];

        while (val > 0) { 
            if (isPrime(val) || val % 2 === 0) {
                val += 1;
                continue
            } else {
                selected_cell.firstElementChild.textContent = `${val}`;
                selected_cell.removeAttribute('data-prime');
                break
            }
        }

        let val_2 = Math.floor((val + getRandomInt(Diff_max)) / 4);

        if (next_selected_cell) {

            while (val_2 > 0) {
                if (isPrime(val_2)) {
                    next_selected_cell.firstElementChild.textContent = `${val_2}`;
                    next_selected_cell.setAttribute('data-prime','data-prime');
                    break
                }
                val_2 += 1
            }
        }
    }
    return mapping
}

function highlightPrimes () { // highlights cells with prime values
    cells.forEach(
        function (cell) {
            cell.classList.remove('highlight');
            if (cell.getAttribute('data-prime') !== null) {
                cell.classList.add('highlight');
            }
        }
    );
}

function acceptRound () { // decides if selected cells win round
    let currentTime = parseInt(timer.textContent);
    
    if (currentTime <= 0) {
        return false
    }

    let selected = Array.from(cells).filter(
        function (x) {
            if (x.classList.contains('selected')) {
                return true
            }
        }
    );

    let selected_primes = selected.filter(
        function (x) {
            if (x.getAttribute('data-prime') !== null) {
                return true
            }
        }
    );

    if (selected_primes.length === selected.length && selected_primes.length === Math.floor(N**2 /2)) {
        return true
    } else {
        return false
    }


    // if (primeCount === Math.floor(N**2 /2)) {return true}
}

function startTimer(time) { // starts timer and ends it when time reaches 0
    timer.textContent = `${time}`;
    let timeDisplay = setInterval( function() {
        if (time > 1) {
            time -= 1;
            timer.textContent = `${time}`;
        } else {
            timer.textContent = `${time - 1}`;
            clearInterval(timeDisplay);
            next.textContent = "Time's up!";
            timer.classList.toggle('hidden');
            next.classList.toggle('finished');
        }
    },1000);
    return timeDisplay
}

function pushScore (val) { // adds val into "score"
    if (score.textContent === "") {score.textContent = val}
    else {score.textContent = parseInt(score.textContent) + val}
}

let N = 2;
let Diff_max = 200;
const time = N**2 + N;
const timer = document.querySelector("#timer");
const score = document.querySelector('#score');

// Making a truly square board
const board = document.querySelector("#board");
board.style.height = `${(board.offsetWidth)}px`;

// Computing cell width and height and defining margin (in %)
let cell_margin = 1;
let cell_height = (100 / N) - 2*cell_margin;
let cell_width = cell_height;

// Adding cells and resize event listener for dynamic resizing
addCells(N);
window.addEventListener('resize', () => resizeCells());

// Ref for cells appearing in the board and setting event listeners for 'click' event
const cells = board.querySelectorAll('.cell');
const next = document.querySelector('#next-round');

cells.forEach(
    function (x) {
        x.addEventListener('click',
            function (e) {
                e.currentTarget.classList.toggle('selected');
            }
        );
    }
);

next.addEventListener('click',
    function () {
        if (acceptRound()) {
            pushScore(N**2 * timer.textContent);
            setNumbers();
            clearInterval(timer_id);
            timer_id = startTimer(time);
        }
    }
);

// This part starts the game
setNumbers();
let timer_id = startTimer(time);
