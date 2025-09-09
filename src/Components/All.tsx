// import React from 'react'
import{ useState } from 'react';





const All = () => {
 const [state,upState] = useState(Array(9).fill(null));
 const [mode, setMode] = useState<"multiplayer" | "easy" | "medium" | "hard">("multiplayer");

 const [turnX, setTurnX] = useState(true);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5], 
  [6, 7, 8],
  
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 

  [0, 4, 8],
  [2, 4, 6]  
];

function getwinner(squares: (string | null)[]): string | null {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


//eida hoilo medium mode er jonno

function findBestMoveMedium(board: (string|null)[], emptySquares: number[]): number {
  // Try to win
  for (let idx of emptySquares) {
    const copy = [...board];
    copy[idx] = "O";
    if (getwinner(copy) === "O") return idx;
  }
  // Try to block
  for (let idx of emptySquares) {
    const copy = [...board];
    copy[idx] = "X";
    if (getwinner(copy) === "X") return idx;
  }
  // Else random
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}

//hard mode using algorithm
function findBestMoveHard(board: (string|null)[]): number {
  let bestScore = -Infinity;
  let move = -1;

  board.forEach((square, i) => {
    if (!square) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
}

function minimax(board: (string|null)[], depth: number, isMaximizing: boolean): number {
  const winner = getwinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(sq => sq)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((square, i) => {
      if (!square) {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((square, i) => {
      if (!square) {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}



function handlesquareClick(index: number) {
  if (state[index] || getwinner(state)) return;

  const updateBoard = [...state];
updateBoard[index] = turnX ? "X" : "O";
setTurnX(!turnX);

  if (mode === "multiplayer") {
    setTurnX(!turnX); // multiplayer mode uses turns
    return;
  }

  // Check if player won or draw before bot plays
  if (getwinner(updateBoard) || updateBoard.every(sq => sq)) return;

  // Bot move
  setTimeout(() => {
    let botMove: number | null = null;

    const emptySquares = updateBoard
      .map((val, i) => (val ? null : i))
      .filter((i) => i !== null) as number[];

    if (emptySquares.length === 0) return;

    if (mode === "easy") {
      // Random move
      botMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    } 
    else if (mode === "medium") {
      // Try to win or block, else random
      botMove = findBestMoveMedium(updateBoard, emptySquares);
    } 
    else if (mode === "hard") {
      // Unbeatable minimax
      botMove = findBestMoveHard(updateBoard);
    }

    if (botMove !== null) {
      updateBoard[botMove] = "O";
      upState([...updateBoard]);
    }
  }, 500);
}



function gamestatues(){
  const winner = getwinner(state);
  if(winner)return `winner is ${winner}`;
  if(state.every(square => square)) return "It's a draw!";
  return `Next turn: ${turnX ? 'X' : 'O'}`;

}
function Restartgame(){
  upState(Array(9).fill(null));
  setTurnX(true);
}



  return (
    <div
      className="min-h-screen bg-slate-950 flex
     items-center justify-center flex-col gap-1.5">

      <div className="flex gap-2 my-4">
  <button 
    onClick={() => setMode("multiplayer")}
    className={`px-3 py-1 rounded ${mode==="multiplayer" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`}
  >
    Multiplayer
  </button>
  <button 
    onClick={() => setMode("easy")}
    className={`px-3 py-1 rounded ${mode==="easy" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`}
  >
    Easy [Bot]
  </button>
  <button 
    onClick={() => setMode("medium")}
    className={`px-3 py-1 rounded ${mode==="medium" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`}
  >
    Medium [Bot]
  </button>
  <button 
    onClick={() => setMode("hard")}
    className={`px-3 py-1 rounded ${mode==="hard" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
  >
    Hard [Bot]
  </button>
</div>

      <div className="text-6xl text-white font-bold text-center">
        Tic Tac Toe
      </div>


      <div className={`text-center mb-6 ${getwinner(state)?"text-2xl text-green-500 mt-4 animate-bounce":"text-xl text-gray-400 mt-4"}`}>
        {gamestatues()}
      </div>
      
     <div className="grid grid-cols-3 gap-1 rounded-xl bg-amber-300 p-2">
  {state.map((square, index) => (
    <button
      key={index}
      onClick={() => handlesquareClick(index)}
      className={`
        w-20 h-20 flex items-center justify-center rounded-md text-3xl font-bold
        transition-colors duration-200 
        ${square === "X" ? "text-blue-500" : square === "O" ? "text-red-500" : "text-white"}
        bg-gray-800 hover:bg-gray-600
      `}
    >
      {square}
    </button>
  ))}
</div>


      <button className="border border-blue-500 text-blue-500 py-2 px-4 rounded
       hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
       focus:ring-opacity-50" onClick={Restartgame}>
        Restart
      </button>
    </div>
  );
};

export default All;
