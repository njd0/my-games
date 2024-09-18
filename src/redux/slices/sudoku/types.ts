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