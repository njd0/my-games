import { SudokuState } from "@/redux/slices/sudoku/sudokuSlice";
import { Difficulty } from "@/redux/slices/sudoku/types";

const stateKey = 'mg-sudoku'
const sudokuLocalStorageKey = (difficulty: Difficulty) => `${stateKey}-${difficulty}`

export const updateSudokuLocalStorage = (state: SudokuState) => {
  window.localStorage.setItem(
    sudokuLocalStorageKey(state.difficulty),
    JSON.stringify(state),
  )
}

export const getSudokuLocalStorage = (difficulty: Difficulty): SudokuState | undefined => {
  const state = window.localStorage.getItem(sudokuLocalStorageKey(difficulty));
  if (!state) return;
  return JSON.parse(state);
}