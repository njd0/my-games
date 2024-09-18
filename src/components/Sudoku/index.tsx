import classNames from "classnames";
import { Board } from "./Board/BoardContext";
import { BoardRenderer } from "./Board/BoardRenderer";


export const Sudoku = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-8">
      {/* board */}
      <div>
        {/* <select onSelect={() => { }}>
          <option>easy</option>
          <option>medium</option>
          <option>hard</option>
        </select> */}
        <Board>
          <BoardRenderer />
        </Board>
      </div>
      <div>
        {/* answer and candidate selection controls */}
      </div>
    </div>
  )
}