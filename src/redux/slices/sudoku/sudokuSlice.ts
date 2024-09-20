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
  time: number,
}

const initialState: SudokuState = loadSudokuState('easy');
updateSudokuLocalStorage(initialState);

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    setDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.difficulty = action.payload;
      Object.assign(state, loadSudokuState(action.payload));
      updateSudokuLocalStorage(state);
    },
    setSelectCell: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
      updateSudokuLocalStorage(state);
    },
    setTime: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
      updateSudokuLocalStorage(state);
    },
    setCells: (state, action: PayloadAction<SudokuCells>) => {
      state.cells = action.payload;
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
    setCandidates: (state, action: PayloadAction<SudokuCellsCandidates>) => {
      state.candidates = action.payload
      updateSudokuLocalStorage(state);
    },
    setNewBoard: (state, action: PayloadAction<Difficulty>) => {
      Object.assign(state, loadSudokuState(action.payload, true));
      updateSudokuLocalStorage(state);
    },
  },
});

export const {
  setDifficulty,
  setSelectCell,
  setCellCandidate,
  setCellValue,
  setTime,
  setCells,
  setCandidates,
  setNewBoard,
} = sudokuSlice.actions;

export default sudokuSlice.reducer;
