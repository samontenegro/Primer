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

function isPrime (num) {
        if (num == 1) return true;
        for(let i = 2, s = Math.sqrt(num); i <= s; i++){
            if(num % i === 0) return false;
        }
        return num > 1;
}

function getRandomInt (max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1)) +1;
}

function setNumbers (n) { // fills the n^2 cells with a number, so that n/2 cells contain primes
    let mapping = makeSequence(n);
    let cellArray = Array.from(cells);
    for (i=0;i<n**2;i += 2) {
        let val = getRandomInt(Diff_max);
        let selected_cell = cellArray[mapping[i]];
        let next_selected_cell = cellArray[mapping[i+1]];

        while (val > 0) { 
            if (isPrime(val)) {
                val += 1;
                continue
            } else {
                selected_cell.firstElementChild.textContent = `${val}`;
                selected_cell.removeAttribute('data-prime');
                break
            }
        }

        if (next_selected_cell) {
            while (val > 0) {
                if (isPrime(val)) {
                    next_selected_cell.firstElementChild.textContent = `${val}`;
                    next_selected_cell.setAttribute('data-prime','data-prime');
                    break
                }
                val -= 1
            }
        }
    }
    return mapping
}

function highlightPrimes () { // highlights cells with prime values
    cells.forEach(
        function (cell) {
            cell.style.backgroundColor = "#eee";
            if (cell.getAttribute('data-prime') !== null) {
                cell.style.backgroundColor = "red";
            }
        }
    );
}

let N = 5;
let Diff_max = 200;

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

// Ref for cells appearing in the board
let cells = board.querySelectorAll('.cell');