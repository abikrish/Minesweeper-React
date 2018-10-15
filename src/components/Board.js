import React from 'react';
import MineButton from './MineButton';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState();
    this.tick = this.tick.bind(this);
  }

  initializeState() {
    return {
     board: this.constructBoard(this.props.rows, this.props.columns, this.props.mines),
     timeStart: Date.now(),
     currentTime: Date.now(),
     flagsPlanted: 0,
     gameActive: true,
     won: false,
    };
  }

  constructBoard(rows, columns, mines) {
    var boardData =[];
   
    for (let i = 0; i < rows; i++) {
      boardData.push([]);
      for (let j = 0; j < columns; j++) {
        boardData[i][j] = {
          x: i,
          y: j,
          mineCount:0,
          isMine: false,
          visible: false,
          isFlagged: false
        };
      }
    };

    var mineCount = 0;

    while (mineCount < mines) {
      var xCoord = Math.floor((Math.random() * rows));
      var yCoord = Math.floor((Math.random() * columns));

      if (!boardData[xCoord][yCoord].isMine) {
        boardData[xCoord][yCoord].isMine = true;
        mineCount++;
        this.incrementNeighborCount(xCoord, yCoord, boardData, rows, columns);
      }
    }

    return boardData;
  }

  incrementNeighborCount(xCoord, yCoord, boardData, rows, columns) {
      for (let x = xCoord - 1; x <= xCoord + 1; x++) {
        for (let y = yCoord - 1; y <= yCoord + 1; y++) {
          if (x == xCoord && y == yCoord) {
            continue;
          }

          if (x >= 0 && x < rows && y >= 0 && y < columns) {
              boardData[x][y].mineCount++;
          }
        }
      }
  }

  revealMines(board, x,y) {
    if (board[x][y].isVisible) {
      return board;
    } 

    board[x][y].isVisible = true;
    this.setState({revealedMines: this.state.revealedMines + 1});

    if (board[x][y].mineCount > 0) {    
        return board;
    } 

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (i == x && j == y) {
            continue;
          }

          if (i >= 0 && i < this.props.rows && j >= 0 && j < this.props.columns) {
              board = this.revealMines(board, i, j);
          }
        }
      }

    return board;
  }

  handleClick(x,y) {
    if (!this.state.gameActive) {
      return;
    }

    var boardDataClone = this.state.board.slice();
    var mineButton = boardDataClone[x][y];
    if (mineButton.isVisible || mineButton.isFlagged) {
      return;
    } else if (mineButton.isMine) {
      this.ActivateGameOver();
    } else {
       this.setState({board: this.revealMines(boardDataClone, x,y)});
    }

    if (this.state.revealedMines == ((this.state.rows * this.state.columns) - this.state.flagsPlanted)) {
      this.state.setState({gameActive: false})
    }
  }

  handleContextClick(e,x,y) {
    e.preventDefault();
    
    if (!this.state.gameActive) {
      return;
    }
  
    var boardDataClone = this.state.board.slice();
    var mineButton = boardDataClone[x][y];
    var flagCount = this.state.flagsPlanted;
    if (mineButton.isVisible) {
      return;
    } else {
      mineButton.isFlagged ? flagCount-- : flagCount++;
      mineButton.isFlagged = !mineButton.isFlagged;
      this.setState({board: boardDataClone, flagsPlanted: flagCount});
    }
  }

  ActivateGameOver(won) {
    clearInterval(this.tick);
    this.setState({gameActive: false, won: won});

    if (won) {
        alert("You Won");
    } else {
        alert("You Lose");  
    }
    
  }

  renderBoard() {
    return this.state.board.map((row) => {
        return row.map((mineData) => {
          return (
                <MineButton 
                key = {mineData.x + "" + mineData.y} 
                mineData = {mineData} isRowBeginning = {row[0] === mineData} 
                onClick = {() => this.handleClick(mineData.x, mineData.y)} 
                onContextMenu = {(e) => this.handleContextClick(e, mineData.x, mineData.y)}/>
            );
          })
      });
  }

  getDoomFace() {
    if (this.state.gameActive) {
      return "🙂";
    } else if (this.state.won) {
        return "😅";
    } else {
         return "😖";
    }
  }

  getTimeElapsed() {
    var timeElapsed = Math.floor((this.state.currentTime - this.state.timeStart)/1000) + "";
    return timeElapsed;
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  tick() {
    this.setState({currentTime: Date.now()});
  }

  resetGame() {
      this.setState(this.initializeState());
  }

  render() {
    return (
      <div className="game-holder">
        <div className="status-header"> 
          <div className="mines-left">
              <div>{this.props.mines - this.state.flagsPlanted}</div>
          </div>
          <div className="doom-guy"><button onClick = {() => this.resetGame()}>{this.getDoomFace()}</button></div>
          <div className="time-left">
              <div>{this.getTimeElapsed()}</div>
          </div>
        </div>
        <div className ="Board"> 
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}
