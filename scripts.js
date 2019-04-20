function formatCell(cell) {
    cell.style.width = `${cell_width}%`;
    cell.style.height = `${cell_height}%`;
    cell.style.margin = `${cell_margin}%`;
}

function addCells(N) {
    for (i=0;i<N**2;i++){
        let cell = document.createElement("div");
        cell.classList.add("cell");
        formatCell(cell);
        cell.appendChild(document.createElement("p"));
        cell.childNodes[0].textContent = `${i+1}`
        board.appendChild(cell);
        ;
    }
}

function resizeCells(){
    board.style.height = `${(board.offsetWidth)}px`;
    board.childNodes.forEach(function (x) {
    formatCell(x);
    });
}

let N = 8;

// Making a truly square grid
const board = document.querySelector("#board");
board.style.height = `${(board.offsetWidth)}px`;

// Computing cell width and height
let cell_margin = 1;
let cell_height = (100 / N) - 2*cell_margin;
let cell_width = cell_height;

// Adding cells and resize event listener
addCells(N);
window.addEventListener('resize', () => resizeCells());
