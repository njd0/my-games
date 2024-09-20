import { Board } from "./Board/BoardContext";
import { BoardHeader } from "./Board/BoardHeader";
import { BoardRenderer } from "./Board/BoardRenderer";

export const Sudoku = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <Board>
        <BoardHeader />
        <BoardRenderer />
      </Board>
      <div>
        {/* answer and candidate selection controls */}
      </div>
    </div >
  )
}