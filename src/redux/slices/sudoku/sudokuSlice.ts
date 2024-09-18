import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenerateEmptyCellBoard } from '@/components/Sudoku/config';
import { BoardCell, Difficulty, CellCoordinates } from './types';

export type SudokuState = {
  difficulty: Difficulty;
  board: BoardCell[][];
  selectedCell?: CellCoordinates;
}

const initialState: SudokuState = {
  difficulty: 'hard',
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
    setSelectCell: (state, action: PayloadAction<CellCoordinates>) => {
      state.selectedCell = action.payload
    },
    setCellValue: (state, action: PayloadAction<number>) => {
      if (!state.selectedCell) return;

      state.board[state.selectedCell.row][state.selectedCell.col] = {
        ...state.board[state.selectedCell.row][state.selectedCell.col],
        value: action.payload,
      }
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
    setBoard: (state, action: PayloadAction<number[][]>) => {
      for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
          state.board[i][j].value = action.payload[i][j]
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
  setCellValue,
  setBoard,
  resetBoard,
} = sudokuSlice.actions;

export default sudokuSlice.reducer;
