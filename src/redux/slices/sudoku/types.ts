export type Difficulty = 'easy' | 'medium' | 'hard'

export type BoardCell = {
  value: number;
  candidates: {
    [key: string]: boolean;
  };
}

export type CellCoordinates = {
  row: number;
  col: number;
}

export type SudokuCellsCandidates = {
  [k: number]: {
    [k: number]: boolean;
  }
}

export type SudokuCell = {
  id: number;
  prefilled: boolean;
  value: number;
  // state: 'guessed' 
}

export type SudokuCells = {
  [k: number]: SudokuCell
}