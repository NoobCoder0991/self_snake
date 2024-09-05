
let rows = 13, cols = 20;
CreateGrid(rows, cols);
let squares = document.getElementsByClassName('square');
addDragBehaviourToBlockSquares();

//representation of the snake is a 1d array representing the indices where the snake is located. Initially the snake has just a length of 1 which is set to the starting index;

let snake = [1, 0];
let direction = 2;
let grid = [];
let score = 0;
var foodIndex = GenerateFood();
let started = false;
let speed = 1 / 100;

for (let i = 0; i < rows * cols; i++) {
    grid.push(0);
}
for (let i = 1; i < snake.length; i++) {
    grid[snake[i]] = 1;
}
RenderSnake(snake);

// console.log(FindShortestPath(grid, 0, 25))


document.getElementById('start-button').addEventListener('click', e => {
    Start(snake)
    document.getElementById('start-button').disabled = true;
})
document.addEventListener('keydown', function (event) {
    if (event.key == 'ArrowUp' || event.key == 'w') {
        MoveSnake(snake, 1);
    }
    if (event.key == 'ArrowDown' || event.key == 's') {
        MoveSnake(snake, -1);
    }
    if (event.key == 'ArrowRight' || event.key == 'd') {
        MoveSnake(snake, 2);
    }
    if (event.key == 'ArrowLeft' || event.key == 'a') {
        MoveSnake(snake, -2);

    }
});
function CreateSquare(i, j, color) {
    let square = document.createElement('div');
    square.classList.add('square');
    square.style.gridRowStart = i + 1;
    square.style.gridColumnStart = j + 1;
    document.getElementsByClassName('snake-container')[0].appendChild(square);
    square.addEventListener('click', e => {
        toggleBlockedSquare(i * cols + j)
    })

}

function CreateGrid(rows, cols) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let rand = Math.floor(2 * Math.random());
            CreateSquare(i, j, rand);
        }
    }

}

function RenderSnake(snake) {
    for (let i = 0; i < squares.length; i++) {
        squares[i].classList.remove('snake-square');
        squares[i].classList.remove('food-square');
        squares[i].classList.remove('snake-head');
        if (i == foodIndex) {
            squares[i].classList.add('food-square');
        }
    }
    for (let i = 0; i < snake.length; i++) {
        let index = snake[i];
        document.getElementsByClassName('square')[index].classList.add('snake-square');
        if (i == 0) {

            document.getElementsByClassName('square')[index].classList.add('snake-head');
        }
    }
}


function MoveSnake(snake, dir) {
    //snake:: snake array
    //dir:: the direction in which the snake has to be moved
    //current:: the current direction of movement of the snake
    // convention of directions : 1 -> top, -1-> bottom, 2->right, -2->left;
    // if (!started) {
    //     Start(snake);
    // }
    let tail = snake[snake.length - 1];
    grid[tail] = 0;
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = snake[i - 1];
    }
    switch (dir) {
        case 1: snake[0] = snake[0] - cols; break;
        case -1: snake[0] = snake[0] + cols; break;
        case 2: snake[0] = snake[0] % cols == cols - 1 ? rows * cols : snake[0] + 1; break;
        case -2: snake[0] = snake[0] % cols == 0 ? rows * cols : snake[0] - 1; break;
    }
    grid[snake[0]] = 1;
    direction = dir;
    if (snake[0] == foodIndex) {
        grid[tail] = 1;
        snake.push(tail)
        squares[foodIndex].classList.remove('food-square');
        foodIndex = GenerateFood();
        squares[foodIndex].classList.add('food-square');
        score++;
        document.getElementsByClassName('score-value')[0].textContent = score

    }
    if (IsOutsideBox(snake[0]) || squares[snake[0]].classList.contains('blocked-square') || (squares[snake[0]].classList.contains('snake-square'))) {
        //gameover
        document.getElementsByClassName('gameover-wrapper')[0].classList.add('show');
        document.getElementsByClassName('final-score')[0].textContent = "Score : " + score;
        score = 0;
        started = false;
    }
    RenderSnake(snake);
}

function Start(snake) {

    started = true;
    if (direction == 0) {
        return;
    }
    RenderSnake(snake);
    let directions = direction = GetShortestPath(snake[0], foodIndex, grid);
    if (directions && directions.length) {
        direction = directions[0];
    }
    else {
        //no option for the snake
        let head = snake[0];
        if (head / cols > 0 && grid[head - cols] == 0) {
            direction = 1;
        }
        else if (head / cols < rows - 1 && grid[head + cols] == 0) {
            direction = -1;
        }
        else if (head % cols != cols - 1 && grid[head + 1] == 0) {
            direction = 2;
        }
        else if (head % cols != 0 && grid[head - 1] == 0) {
            direction = -2;
        }
        else {

            let dirs = [1, -1, 2, -2];
            direction = dirs[Math.floor(Math.random() * dirs.length)];
        }


    }
    MoveSnake(snake, direction);
    if (started) {
        setTimeout(() => {
            Start(snake);
        }, 1 / speed);
    }

}

function IsOutsideBox(index) {
    if (index < 0 || index >= rows * cols) {
        return true;
    }

    return false;
}

function toggleBlockedSquare(index) {
    let targetSquare = document.getElementsByClassName('square')[index];
    if (targetSquare.classList.contains('blocked-square')) {
        targetSquare.classList.remove('blocked-square');
        grid[index] = 0;
    }
    else {
        targetSquare.classList.add('blocked-square');
        grid[index] = 1;
    }

}

function GenerateFood() {
    let food = Math.floor(rows * cols * Math.random());
    while (snake.includes(food) || squares[food].classList.contains('blocked-square')) {
        food = Math.floor(rows * cols * Math.random());
    }
    return food;
}


function GetShortestPath(startIndex, endIndex, grid) {
    const directions = {
        top: 1,
        bottom: -1,
        right: 2,
        left: -2
    };

    function indexToRowCol(index) {
        return [Math.floor(index / cols), index % cols];
    }

    function rowColToIndex(row, col) {
        return row * cols + col;
    }

    function isValidMove(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
        return grid[rowColToIndex(row, col)] === 0;
    }

    function bfs(startIndex, endIndex) {
        const queue = [[startIndex, []]];
        const visited = new Set();
        visited.add(startIndex);

        while (queue.length > 0) {
            const [currentIndex, path] = queue.shift();
            const [currentRow, currentCol] = indexToRowCol(currentIndex);

            if (currentIndex === endIndex) {
                return path;
            }

            const neighbors = [
                { row: currentRow - 1, col: currentCol, direction: directions.top },     // Move up
                { row: currentRow + 1, col: currentCol, direction: directions.bottom },  // Move down
                { row: currentRow, col: currentCol - 1, direction: directions.left },    // Move left
                { row: currentRow, col: currentCol + 1, direction: directions.right }    // Move right
            ];

            for (const neighbor of neighbors) {
                const newRow = neighbor.row;
                const newCol = neighbor.col;
                const newIdx = rowColToIndex(newRow, newCol);

                if (isValidMove(newRow, newCol) && !visited.has(newIdx)) {
                    visited.add(newIdx);
                    queue.push([newIdx, path.concat(neighbor.direction)]);
                }
            }
        }

        return null; // No path found
    }

    return bfs(startIndex, endIndex);
}

var dragged = false;
function addDragBehaviourToBlockSquares() {
    let squares = document.getElementsByClassName('square');
    for (let i = 0; i < squares.length; i++) {

        squares[i].addEventListener('dragstart', (e) => {
            e.preventDefault();
        })
        squares[i].addEventListener('mousedown', (e) => {
            dragged = true;
            if (squares[i].classList.contains('blocked-square')) {
                squares[i].classList.remove('blocked-square')
                grid[i] = 0;
            }
            else {
                squares[i].classList.add('blocked-square')
                grid[i] = 1;
            }

        })
        squares[i].addEventListener('mouseup', (e) => {
            dragged = false;
            if (squares[i].classList.contains('blocked-square')) {
                squares[i].classList.remove('blocked-square')
                grid[i] = 0;
            }
            else {
                squares[i].classList.add('blocked-square')
                grid[i] = 1;
            }
        })
        squares[i].addEventListener('mouseover', (e) => {
            if (dragged) {
                if (squares[i].classList.contains('blocked-square')) {
                    squares[i].classList.remove('blocked-square')
                    grid[i] = 0;
                }
                else {
                    squares[i].classList.add('blocked-square')
                    grid[i] = 1;
                }
            }
        })

    }
}



