// import React from 'react'
import{ useState } from 'react';


const All = () => {
 const [state,upState] = useState(Array(9).fill(null));
 
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


function handlesquareClick(index: number) {
  if (state[index] || getwinner(state))return; 

  const updateBoard = [...state];
  updateBoard[index] = turnX ? 'X' : 'O';

  upState(updateBoard);
  setTurnX(!turnX);

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
