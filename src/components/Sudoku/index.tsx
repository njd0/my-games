import { useMemo } from "react";
import { CellRenderer } from "./Cell/CellRenderer";
import { BoardRender, GenerateEmptyBoard } from "./config";
import { Cell } from "./Cell/CellContext";
import { useControls } from "./Controls/useControls";

const board = GenerateEmptyBoard();

export const Sudoku = () => {
  const boardSize = useMemo(() => {
    return (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3)
  }, []);

  useControls();

  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-8">
      {/* board */}
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
              {board.flat().map((_, index) => {
                const row = Math.floor(index / 9)
                const col = index % 9
                return (
                  <Cell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                  >
                    <CellRenderer />
                  </Cell>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* answer and candidate selection controls */}
      </div>
    </div >
  )
}