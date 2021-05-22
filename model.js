
//The Snake View 
class SnookView {
    constructor (boardSide) {
        this.boardSide = boardSide; //The printed board is X by X size, where X is the initial boardSide given by the user.
        this.board = this.createBoard(); //The display is initialized here.
        this.model = new SnookModel(boardSize); //The model is initialized here.
        this.initialData = this.model.getGameData(); //The model data is retrieved here.
        this.updateBoard(this.initialData); //The display is updated via this method.
        this.directions = {
            up: [1, 0],
            left: [0, -1],
            right: [0, 1],
            down: [-1, 0]
        }
    }

    //this method takes in data from the Model and prints it onto the browser. 
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

    //This method takes in the directional input from the user (arrow keys)
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

    //This method takes the data from our Model and updates the board to match, first checking for the lose condition (snake hits wall or itself).
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

    //This method clears the board state in preparation for a new state to be displayed.
    clearBoard = () => {
        for (let i = 0; i < this.boardSide; i++) {
            for (let j = 0; j < this.boardSide; j++) {
                this.board[i][j].innerHTML = "";
            }
        }
    }

    //This is our main game loop.
    run = () => {
        let data = this.model.snookMove();
        this.updateBoard(data);
        if (data.state === "ongoing") setTimeout(this.run, 250);
    }
};

//The Snake Model
class SnookModel {
    constructor(boardSize) {
        this.boardSize = boardSize; //The model is X by X size, where X is the initial boardSide given by the user.
        this.snook = this.createSnook(); //The snake is initialized here.
        this.snicker = this.createSnicker(); //The snicker (apple) is initialized here.
        this.state = "ongoing" // lose;
        this.direction = [0, 0];
    }

    //This method creates the initial snake (in the middle of the board)
    createSnook = () => {
        const x = Math.floor(this.boardSize/2);
        const y = Math.floor(this.boardSize/2);
        const snook = [[x, y]];
        return snook;
    }
    
    //This method creates a snicker (apple) on a random cell that is not already inhabited by the snake.
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

    //This method takes in the direction state provided by the user and updates our model with that new direction. 
    //It also checks if the user decided to move backwards and doesn't allow the direction to update if so. 
    setDirection = (nextDirection) => {
        const oppositeDirection = nextDirection.map(x => x * -1);
        if (oppositeDirection[0] === this.direction[0] && oppositeDirection[1] === this.direction[1]) return;
        this.direction = nextDirection;
    }

    //This is the initial game data sent to the display on initialization.
    getGameData = () => ({
        snook: this.snook,
        snicker: this.snicker,
        counter: 0,
        state: this.state
    })
    
    //This method moves the snake in the given direction, creates a new snicker (apple) and grows the snake if the snicker was eaten, and sends the updated model back to the display.
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

    //This method updates the state to the lose condition if the snake goes out of bounds, or if it runs into itself.
    updateState = () => {
        if(!this.isWithinBounds(this.snook[0][0], this.snook[0][1])) this.state = "lose";
        for (let i = 1; i < this.snook.length; i++) {
            if (this.snook[0][0] === this.snook[i][0] && this.snook[0][1] === this.snook[i][1]) this.state = "lose";
        }
    }

    //This method checks if the snake head is within bounds of the board.
    isWithinBounds = (x, y) => x >= 0 && y >= 0 && x < this.boardSize && y < this.boardSize;
}

const boardSize = 10;

let game = new SnookView(boardSize);
game.run();