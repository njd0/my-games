import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenerateEmptyCellBoard } from '@/components/Sudoku/config';
import { BoardCell, Difficulty, SelectedCell } from './types';

export type SudokuState = {
  difficulty?: Difficulty;
  board: BoardCell[][];
  selectedCell?: SelectedCell;
}

const initialState: SudokuState = {
  difficulty: undefined,
  board: GenerateEmptyCellBoard(),
  selectedCell: undefined
};

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setSelectDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.difficulty = action.payload;
    },
    setSelectCell: (state, action: PayloadAction<SelectedCell>) => {
      state.selectedCell = action.payload
    },
    setCellCandidate: (state, action: PayloadAction<number>) => {
      if (!state.selectedCell) return;

      state.board[state.selectedCell.row][state.selectedCell.col] = {
        ...state.board[state.selectedCell.row][state.selectedCell.col],
        candidates: {
          ...state.board[state.selectedCell.row][state.selectedCell.col].candidates,
          [action.payload]: !state.board[state.selectedCell.row][state.selectedCell.col].candidates[action.payload],
        }
      }
    },
    resetBoard: (state) => {
      state.board = GenerateEmptyCellBoard();
    }
  },
});

export const {
  setSelectDifficulty,
  setSelectCell,
  setCellCandidate,
  resetBoard,
} = sudokuSlice.actions;

export default sudokuSlice.reducer;
