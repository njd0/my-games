import { EMPTY_CELL, GRID_SIZE } from "./config";
import { CellCoordinates, SudokuCells, SudokuCellsCandidates } from "@/redux/slices/sudoku/types";
import { BoolSet } from "../types";

const getRowIndexes = (index: number): number[] => {
  const rowStart = Math.floor(index / 9) * 9;
  return Array.from({ length: 9 }, (_, i) => rowStart + i);
}

const getColIndexes = (index: number): number[] => {
  const colStart = index % 9;
  return Array.from({ length: 9 }, (_, i) => colStart + i * 9);
}

const getBoxIndexes = (index: number): number[] => {
  const rowStart = Math.floor(index / 9);
  const colStart = index % 9;

  // Calculate which 3x3 box the index is in
  const boxRowStart = Math.floor(rowStart / 3) * 3;
  const boxColStart = Math.floor(colStart / 3) * 3;

  // Collect all 9 elements of the 3x3 box
  const boxIndexes: number[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      boxIndexes.push((boxRowStart + i) * 9 + (boxColStart + j));
    }
  }
  return boxIndexes;
}

const inGroup = (cells: SudokuCells, groupIds: number[], value: number) => {
  for (let i = 0; i < groupIds.length; ++i) {
    if (cells[groupIds[i]].value === value) return true;
  }
  return false
}

// 1D array isValid value
export const isValidSudokuCell = (cells: SudokuCells, i: number, value: number) => {
  return !inGroup(cells, getRowIndexes(i), value)
    && !inGroup(cells, getColIndexes(i), value)
    && !inGroup(cells, getBoxIndexes(i), value)
}

// in place solve sudoku puzzle
export const solveCells = (cells: SudokuCells) => {
  for (let y = 0; y < Object.keys(cells).length; ++y) {
    if (cells[y].value === EMPTY_CELL) {
      const numbers = getShuffledNumbers();
      for (let x = 0; x < numbers.length; ++x) {
        if (isValidSudokuCell(cells, y, numbers[x])) {
          cells[y].value = numbers[x]

          if (solveCells(cells)) {
            return true;
          }

          cells[y].value = EMPTY_CELL
        }
      }

      return false;
    }
  }

  return true
}

// in place solve board candidates
export const solveCellsCandidates = (cells: SudokuCells, candidates: SudokuCellsCandidates) => {
  for (let y = 0; y < Object.keys(cells).length; ++y) {
    if (cells[y].value === EMPTY_CELL) {
      const numbers = getShuffledNumbers();
      for (let x = 0; x < numbers.length; ++x) {
        if (isValidSudokuCell(cells, y, numbers[x])) {
          candidates[y][numbers[x]] = true;
        }
      }
    }
  }
}

// get float distance of 2 cells
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

// get 1D array col, row, box ids
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

// get true random number in range
export const getTrueRandomNumber = (): number => {
  const randomArray = new Uint8Array(1); // Create a Uint8Array to store the random value
  window.crypto.getRandomValues(randomArray); // Fill the array with cryptographically random values
  return randomArray[0];
}

export const getRandomGridIndex = () => getTrueRandomNumber() % 9;