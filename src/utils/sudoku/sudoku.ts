import { EMPTY_CELL } from "@/components/Sudoku/config";
import { CellCoordinates } from "@/redux/slices/sudoku/types";
import { BoolSet } from "../types";

export const get2dDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export const cellIdToRowCol = (cellId: number): CellCoordinates => {
  return {
    row: Math.floor(cellId / 9),
    col: cellId % 9,
  }
}

const rowColToCellId = ({ row, col }: CellCoordinates): number => {
  return (row * 9) + col
}

export const getGroupIds = (cellId: number): { [k: string]: BoolSet } => {
  const { row, col } = cellIdToRowCol(cellId);

  const rowIds: BoolSet = {}
  for (let i = 0; i < 9; ++i) {
    rowIds[rowColToCellId({ row, col: i })] = true
  }

  const colIds: BoolSet = {}
  for (let i = 0; i < 9; ++i) {
    colIds[rowColToCellId({ row: i, col })] = true
  }

  const [top, left] = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];
  const boxIds: BoolSet = {};
  for (let i = top; i < top + 3; i++) {
    for (let j = left; j < left + 3; j++) {
      boxIds[rowColToCellId({ row: i, col: j })] = true;
    }
  }

  return {
    rowIds,
    colIds,
    boxIds,
  }
}
