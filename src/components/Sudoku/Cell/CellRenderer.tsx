import { useCallback, useContext, useMemo } from "react";
import { CellContext } from "./CellContext";
import { BoardRender, EMPTY_CELL } from "../config";
import classNames from "classnames";
import { Candidates } from "./Candidates";
import { cellIdToRowCol } from "@/utils/sudoku/sudoku";
import { SudokuCell } from "@/redux/slices/sudoku/types";

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

interface Props {
  isHighlighted: boolean;
  cell: SudokuCell;
  candidates: {
    [k: number]: boolean;
  };
}

export const CellRenderer = ({ cell, candidates, isHighlighted }: Props) => {
  const {
    isSelectedCell,
    selectCell,
  } = useContext(CellContext);

  const onSelectCell = useCallback(() => {
    selectCell(cell.id)
  }, [selectCell, cell.id]);

  const { row, col } = useMemo(() => {
    return cellIdToRowCol(cell.id);
  }, [cell.id])

  const isSelected = useMemo(() => {
    return isSelectedCell(cell.id);
  }, [isSelectedCell, cell.id])

  return (
    <div
      className={`bg-[#fff] absolute border-1 ${classNames({
        'bg-gray-300': isHighlighted && !isSelected,
        'bg-gray-500 cursor-pointer': isSelected
      })}`}
      style={getCellTransform(row, col, BoardRender.Cell.Desktop)}
      onClick={onSelectCell}
    >
      {cell.value !== EMPTY_CELL ?
        <div className="flex w-full h-full justify-center items-center font-bold text-4xl">{cell.value}</div> :
        <Candidates isSelected={isSelected} cellId={cell.id} candidates={candidates} />
      }
      {/* color for pre-filled cell #e6e6e6 */}
    </div>
  )
}