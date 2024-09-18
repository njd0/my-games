import { useContext } from "react";
import { CellRenderer } from "../Cell/CellRenderer";
import { Cell } from "../Cell/CellContext";
import { BoardContext } from "./BoardContext";
import { getCoordinateKey, isBoardSolved } from "@/utils/sudoku/sudoku";

export const BoardRenderer = () => {
  const {
    dummyBoard,
    boardSize,
    highlightedCells,
  } = useContext(BoardContext);

  return (
    <div className="w-[100vw] max-w-[500px] min-w-[auto] md:max-w-[800px] md:min-w-[500px] md:w-[80vh]">
      <div className="relative h-0 pb-[100%]">
        <div className="absolute top-0 left-0 right-0 bottom-0 ">
          <div
            style={{
              top: '5px',
              width: `${boardSize}px`,
              height: `${boardSize}px`
            }}
            className={`relative bg-[#959595] translate-x-[-50%] left-[50%] outline-[5px] outline outline-black`}>
            {dummyBoard.flat().map((_, index) => {
              const row = Math.floor(index / 9)
              const col = index % 9
              const key = getCoordinateKey({ col, row });
              return (
                <Cell
                  key={key}
                  row={row}
                  col={col}
                >
                  <CellRenderer isHighlighted={
                    highlightedCells?.col === col ||
                    highlightedCells?.row === row ||
                    highlightedCells?.grid[key] === true
                  }
                  />
                </Cell>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}