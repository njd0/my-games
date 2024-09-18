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
  isConflicted: boolean;
  cell: SudokuCell;
  candidates: {
    [k: number]: boolean;
  };
  distanceFromSelected: number;
}

export const CellRenderer = ({ cell, candidates, isConflicted, isHighlighted, distanceFromSelected }: Props) => {
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
      // delay-500 todo delay based on distance from selected 
      className={classNames('bg-[#fff] absolute border-1', {
        'bg-gray-200': cell.prefilled && !isHighlighted && !isSelected,
        'bg-gray-300': isHighlighted && !isSelected,
        'bg-gray-400 cursor-pointer': isSelected
        // [`transition-colors duration-500 animate-color-change delay-${Math.floor(distanceFromSelected) * 100}`]: isHighlighted,
        // [`delay-${500}`]: true
      })}
      style={getCellTransform(row, col, BoardRender.Cell.Desktop)}
      onClick={onSelectCell}
    >
      {cell.value !== EMPTY_CELL ?
        <div className="flex w-full h-full justify-center items-center relative">
          <div className="font-bold text-4xl">
            {cell.value}
          </div>
          {isConflicted && (
            <div
              style={{
                width: '8px',
                height: '8px',
                bottom: '4px',
                right: '4px'
              }}
              className="absolute translate-x-[50%] bg-red-400 rounded-full">
            </div>
          )}
        </div> :
        <Candidates isSelected={isSelected} cellId={cell.id} candidates={candidates} />
      }
      {/* color for pre-filled cell #e6e6e6 */}
    </div>
  )
}