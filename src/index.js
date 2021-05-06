import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

// Board
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    renderRow(i) {
        return (
            <div className="board-row">
                {this.renderSquare(i)}
                {this.renderSquare(i+1)}
                {this.renderSquare(i+2)}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderRow(0)}
                {this.renderRow(3)}
                {this.renderRow(6)}
            </div>
        );        
    }
}

// Game
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMoveLocation: null,
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }    

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const loc = determineLocation(i);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMoveLocation: loc,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 
                'Go to move #' + move : 
                'Go to game start';
            const locationOfMove = move ?
                step.lastMoveLocation :
                '';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    <div>{locationOfMove}</div>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
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
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

// React boilerplate
ReactDOM.render(
    <Game />,
    document.getElementById('root')
)

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

function determineLocation(i) {
    let col;
    let row;
    
    if (i === 0 || i === 3 || i === 6) {
        col = 1;
    } else if (i === 1 || i === 4 || i === 7) {
        col = 2;
    } else {
        col = 3;
    }

    if (i < 3) {
        row = 1;
    } else if (i < 6) {
        row = 2;
    } else {
        row = 3;
    }

    return 'Move made in column ' + col + ', row ' + row;
}