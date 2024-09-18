import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMPTY_CELL } from '@/components/Sudoku/config';
import { Difficulty, SudokuCells, SudokuCellsCandidates } from './types';
import { generateSudokuPuzzle } from '@/utils/sudoku/sudokuPuzzleGenerator';

export type SudokuState = {
  difficulty: Difficulty;
  cells: SudokuCells,
  id: string, // start date
  candidates: SudokuCellsCandidates,
  selected: number,
}

const getId = () => {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1; //Months are zero based
  const year = d.getFullYear();
  return `${month}-${day}-${year}`
}

export const getNewGameState = (difficulty: Difficulty): SudokuState => {
  const id = getId();
  const board = generateSudokuPuzzle(difficulty);
  let selected: number = -1;

  const boardState = board.flat().reduce((acc, curr, i) => {
    if (selected === -1 && curr === EMPTY_CELL) selected = i
    acc.cells[i] = {
      id: i,
      prefilled: curr !== EMPTY_CELL,
      value: curr,
    }

    acc.candidates[i] = Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i, false]))

    return acc;
  }, {
    cells: {},
    candidates: {},
  } as {
    cells: SudokuCells
    candidates: SudokuCellsCandidates
  })

  return {
    difficulty,
    cells: boardState.cells,
    candidates: boardState.candidates,
    id,
    selected,
  }
}

const initialState: SudokuState = getNewGameState('easy');

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    setSelectDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state = getNewGameState(action.payload);
    },
    setSelectCell: (state, action: PayloadAction<number>) => {
      state.selected = action.payload
    },
    setCellValue: (state, action: PayloadAction<{
      cellId: number;
      value: number;
    }>) => {
      const { value, cellId } = action.payload;
      state.cells[cellId].value = value;
    },
    setCellCandidate: (state, action: PayloadAction<{
      cellId: number;
      candidate: number;
    }>) => {
      const { candidate, cellId } = action.payload;
      state.candidates[cellId][candidate] = !state.candidates[cellId][candidate]
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
