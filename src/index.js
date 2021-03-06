import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from "jquery";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function History(props) {
  const moves = props.history.map((step, move) => 
  {
    const desc = move ?
      'Move #' + move :
      'Game start';

    const clsName = move === props.stepNumber ?
      'selected' :
      'notSelected';

    return (
      <li key={move} className={clsName}>
        <a href={'#' + move} onClick={() => props.jumpTo(move)}>{desc}</a>
      </li>
    );
  });

  // reverse the order depending on how the radio button is checked
  if (!props.sortAsc) moves.reverse();
    

  return (
    <div className="moves-container">
      <div>
        <input type="radio" name="moves-order" id="moves-order-asc" value="asc" 
          onChange={ () => {
            props.handleOrderClick(true);
          }} 
          checked={props.sortAsc} 
        />
        <label htmlFor="moves-order-asc">Ascending</label>
      </div>
      <div>
        <input type="radio" name="moves-order" id="moves-order-desc" value="desc" 
          onChange={ () => {
            props.handleOrderClick(false);
          }} 
          checked={!props.sortAsc} 
        />
        <label htmlFor="moves-order-desc">Descending</label>
      </div>
      <ol>{moves}</ol>
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      sortAsc: true,
      xIsNext: true,
    };
  }

  jumpTo(step)
  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // don't do anything if there's alreaddy a winner or the square is already clicked
    if (calculateWinner(squares) || squares[i])
    {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleOrderClick(_sortAsc)
  {
    this.setState({sortAsc: _sortAsc});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner)
    {
      status = 'Winner: ' + winner;
    }
    else
    {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <History
            history={history}
            stepNumber={this.state.stepNumber}
            sortAsc={this.state.sortAsc}
            handleOrderClick={(sortAsc) => {this.handleOrderClick(sortAsc)}}
            jumpTo={(step) => {this.jumpTo(step)}}
          />
        </div>
      </div>
    );
  }
}

function calculateWinner(squares)
{
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],    
  ];

  for (let i = 0; i < lines.length; i++) 
  {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) 
    {
      return squares[a];
    }
  }
  return null;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

$(() => {
    console.log('ready');
    // $('.square').click(() => console.log('clicky'));
});