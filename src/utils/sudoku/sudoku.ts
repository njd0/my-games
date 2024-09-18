import { EmptyCell } from "@/components/Sudoku/config";

export const getCoordinateKey = ({ col, row }: { col: number; row: number }) => {
  return `${col}-${row}`;
}

export const getCoordinatesFromKey = (key: string) => {
  // console.log('split', { key })
  const [col, row] = key.split('-');
  return {
    col: Number(col),
    row: Number(row),
  }
}

export const getRelatedGroups = ({ col, row }: { col: number; row: number }) => {
  const grid: { [k: string]: boolean } = {};
  // for (let i = 0; i < 9; i++) {
  //   const x = 3 * Math.floor(col / 3) + i % 3;
  //   const y = 3 * Math.floor(row / 3) + Math.floor(i / 3);
  //   grid[getCoordinateKey({ col: x, row: y })] = true;
  // }

  const [top, left] = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];

  for (let i = top; i < top + 3; i++) {
    for (let j = left; j < left + 3; j++) {
      grid[getCoordinateKey({ col: j, row: i })] = true;
    }
  }

  return {
    col,
    row,
    grid,
  }
}

const SUBGRID_SIZE = 3
export const isValid = (board: number[][], row: number, col: number, value: number) => {
  for (let i = 0; i < 9; ++i) {
    if (i === col) continue;
    if (board[row][i] === value) return false;
  }

  for (let i = 0; i < 9; ++i) {
    if (i === row) continue
    if (board[i][col] === value) return false;
  }


  const startRow = Math.floor(row / SUBGRID_SIZE) * SUBGRID_SIZE;
  const startCol = Math.floor(col / SUBGRID_SIZE) * SUBGRID_SIZE;
  for (let r = 0; r < SUBGRID_SIZE; r++) {
    for (let c = 0; c < SUBGRID_SIZE; c++) {
      if (startRow + r === row && startCol + c === col) continue;
      if (board[startRow + r][startCol + c] === value) {
        return true;
      }
    }
  }

  return true;
}

export const isBoardSolved = (board: number[][]) => {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      if (board[i][j] === EmptyCell || !isValid(board, i, j, board[i][j])) return false
    }
  }

  return true
}