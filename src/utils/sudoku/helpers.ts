import { EMPTY_CELL, GRID_SIZE, SUBGRID_SIZE } from "@/components/Sudoku/config";
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

// Check if the number exists in the current row
const inRow = (grid: number[][], row: number, num: number): boolean => grid[row].includes(num);

// Check if the number exists in the current column
const inCol = (grid: number[][], col: number, num: number): boolean => grid.some((row) => row[col] === num);

// Check if the number exists in the 3x3 subgrid
const inBox = (grid: number[][], row: number, col: number, num: number): boolean => {
  const startRow = Math.floor(row / SUBGRID_SIZE) * SUBGRID_SIZE;
  const startCol = Math.floor(col / SUBGRID_SIZE) * SUBGRID_SIZE;
  for (let r = 0; r < SUBGRID_SIZE; r++) {
    for (let c = 0; c < SUBGRID_SIZE; c++) {
      if (grid[startRow + r][startCol + c] === num) {
        return true;
      }
    }
  }
  return false;
};

// Check if placing a number is valid in the row, column, and box
export const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
  return !inRow(grid, row, num) && !inCol(grid, col, num) && !inBox(grid, row, col, num);
};

// Shuffle an array using the Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Generate a shuffled array of numbers 1-9
export const getShuffledNumbers = (): number[] => {
  const numbers = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
  return shuffleArray(numbers)
};