import { Board } from "./Board/BoardContext";
import { BoardRenderer } from "./Board/BoardRenderer";



export const Sudoku = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-8">
      {/* board */}
      <Board>
        <BoardRenderer />
      </Board>
      <div>
        {/* answer and candidate selection controls */}
      </div>
    </div >
  )
}