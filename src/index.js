import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './components/Board';

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board rows={9} columns={9} mines={10}/>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
