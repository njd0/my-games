import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Difficulty, SudokuCells, SudokuCellsCandidates } from './types';
import { updateSudokuLocalStorage } from '@/utils/sudoku/localStorage';
import { loadSudokuState } from './loader';

export type SudokuState = {
  difficulty: Difficulty;
  cells: SudokuCells,
  id: string, // start date
  candidates: SudokuCellsCandidates,
  selected: number,
}

const initialState: SudokuState = loadSudokuState('easy');
updateSudokuLocalStorage(initialState);

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    setSelectDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.difficulty = action.payload;
      Object.assign(state, loadSudokuState(action.payload));
      updateSudokuLocalStorage(state);
    },
    setSelectCell: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
      updateSudokuLocalStorage(state);
    },
    setCellValue: (state, action: PayloadAction<{
      cellId: number;
      value: number;
    }>) => {
      const { value, cellId } = action.payload;
      state.cells[cellId].value = value;
      updateSudokuLocalStorage(state);
    },
    setCellCandidate: (state, action: PayloadAction<{
      cellId: number;
      candidate: number;
    }>) => {
      const { candidate, cellId } = action.payload;
      state.candidates[cellId][candidate] = !state.candidates[cellId][candidate]
      updateSudokuLocalStorage(state);
    },
  },
});

export const {
  setSelectDifficulty,
  setSelectCell,
  setCellCandidate,
  setCellValue,
} = sudokuSlice.actions;

export default sudokuSlice.reducer;
