

class SnookView {
    constructor (boardSide) {
        this.boardSide = boardSide;
        this.board = this.createBoard();
        this.model = new SnookModel(boardSize);
        this.initialData = this.model.getGameData();
        this.updateBoard(this.initialData);
        this.directions = {
            up: [1, 0],
            left: [0, -1],
            right: [0, 1],
            down: [-1, 0]
        }
    }

    createBoard = () => {
        let boardDiv = document.getElementsByClassName("board")[0];
        let board = new Array(this.boardSide);
        for (let i = 0; i < this.boardSide; i++) {
            board[i] = [];
            let row = document.createElement('div');
            row.className = 'row';
            boardDiv.appendChild(row);
            for (let j = 0; j < this.boardSide; j++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                row.appendChild(cell);
                board[i].push(cell);
            }
        }
        document.addEventListener("keydown", (e) => this.handleUserMove(e));
        return board;
    }

    handleUserMove = (e) => {
        if (e.keyCode == 37) {
            this.model.setDirection(this.directions.left);
        } else if (e.keyCode == 38) {
            this.model.setDirection(this.directions.down);
        } else if (e.keyCode == 39) {
            this.model.setDirection(this.directions.right);
        } else if (e.keyCode == 40) {
            this.model.setDirection(this.directions.up);
        } 
    }

    updateBoard = (data) => {
        this.clearBoard(); 
        if (data.state === "lose") return window.alert(`Snook has died. Refresh to play again!`)
        for (let i = 0; i < data.snook.length; i++) {
            this.board[data.snook[i][0]][data.snook[i][1]].innerHTML = "O";
        }
        this.board[data.snicker[0]][data.snicker[1]].innerHTML = "S";
        const counterDiv = document.getElementsByClassName("counter")[0];
        counterDiv.innerHTML = data.counter; 
        
    }

    clearBoard = () => {
        for (let i = 0; i < this.boardSide; i++) {
            for (let j = 0; j < this.boardSide; j++) {
                this.board[i][j].innerHTML = "";
            }
        }
    }

    run = () => {
        let data = this.model.snookMove();
        this.updateBoard(data);
        if (data.state === "ongoing") setTimeout(this.run, 250);
    }
};

class SnookModel {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.snook = this.createSnook();
        this.snicker = this.createSnicker();
        this.state = "ongoing" // lose;
        this.direction = [0, 0];
    }

    createSnook = () => {
        const x = Math.floor(this.boardSize/2);
        const y = Math.floor(this.boardSize/2);
        const snook = [[x, y]];
        return snook;
    }
    
    createSnicker = () => {
        let shouldRedo = false;
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        // checking if within snake
        for (const part of this.snook) {
            if (part[0] === x && part[1] === y) {
                shouldRedo = true;
                break;
            }
        }
        return shouldRedo ?  this.createSnicker() : [x, y];
    }

    setDirection = (nextDirection) => {
        const oppositeDirection = nextDirection.map(x => x * -1);
        if (oppositeDirection[0] === this.direction[0] && oppositeDirection[1] === this.direction[1]) return;
        this.direction = nextDirection;
    }

    getGameData = () => ({
        snook: this.snook,
        snicker: this.snicker,
        counter: 0,
        state: this.state
    })
    

    snookMove = () => {
        const newPosition = [this.snook[0][0] + this.direction[0], this.snook[0][1] + this.direction[1]];
        this.snook.unshift(newPosition);
        if ((this.snook[0][0] === this.snicker[0]) && (this.snook[0][1] === this.snicker[1])) {
            this.snicker = this.createSnicker();
        } else {
            this.snook.pop();
        }
        this.updateState();
        return {
            snook: this.snook,
            snicker: this.snicker,
            state: this.state,
            counter: this.snook.length - 1
        }
    }

    updateState = () => {
        if(!this.isWithinBounds(this.snook[0][0], this.snook[0][1])) this.state = "lose";
        for (let i = 1; i < this.snook.length; i++) {
            if (this.snook[0][0] === this.snook[i][0] && this.snook[0][1] === this.snook[i][1]) this.state = "lose";
        }
    }

    isWithinBounds = (x, y) => x >= 0 && y >= 0 && x < this.boardSize && y < this.boardSize;
}

const boardSize = 10;


let game = new SnookView(boardSize);
game.run();