import { useCallback, useContext } from "react";
import { CellContext } from "./CellContext";
import { BoardRender, EmptyCell } from "../config";
import classNames from "classnames";
import { Candidates } from "./Candidates";

// TODO:why subtract subGrid Row and Col from top and left.
// AND why - 3 from board size must be done together. else all breaks???
const getCellTransform = (row: number, col: number, size: number) => {
  const subGridRow = Math.floor(row / 3)
  const subGridCol = Math.floor(col / 3)
  return {
    top: row * size + ((BoardRender.Gap * subGridRow) - subGridRow),
    left: col * size + ((BoardRender.Gap * subGridCol) - subGridCol),
    width: size - 1,  // - 1 for outline w
    height: size - 1, // - 1 for outline w
  }
}

export const CellRenderer = () => {
  const {
    isSelectedCell,
    selectCell,
    row,
    col,
    cell,
  } = useContext(CellContext);

  const onSelectCell = useCallback(() => {
    selectCell({ row, col })
  }, [selectCell, row, col])

  return (
    <div
      // className="absolute bg-[#fff] outline outline-1 outline-[#959595]"
      className={`bg-[#fff] absolute border-1 ${classNames({
        'bg-yellow-300 cursor-pointer': isSelectedCell
      })}`}
      style={getCellTransform(row, col, BoardRender.Cell.Desktop)}
      onClick={onSelectCell}
    >
      {cell.value !== EmptyCell ?
        <div className="flex w-full h-full justify-center items-center font-bold text-4xl">{cell.value}</div> :
        <Candidates candidates={cell.candidates} />
      }
      {/* color for pre-filled cell #e6e6e6 */}
    </div>
  )
}