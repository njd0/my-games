import { generateSudokuPuzzle } from "@/utils/sudoku/sudokuPuzzleGenerator";
import { Difficulty, SudokuCells, SudokuCellsCandidates } from "./types";
import { EMPTY_CANDIDATES, EMPTY_CELL } from "@/utils/sudoku/config";
import { SudokuState } from "./sudokuSlice";
import { getSudokuLocalStorage } from "@/utils/sudoku/localStorage";

const getId = () => {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1; //Months are zero based
  const year = d.getFullYear();
  return `${month}-${day}-${year}`
}

const parseId = (stateId: string): string[] => {
  return stateId.split('-');
}

export const resetGameState = (state: SudokuState): SudokuState | undefined => {
  let selected: number = -1;
  state.time = 0;

  for (const key in state.cells) {
    if (state.cells[key].prefilled === false) {
      state.cells[key].value = EMPTY_CELL;
    }

    if (selected === -1 && state.cells[key].value === EMPTY_CELL) selected = Number(key);

    state.candidates[key] = EMPTY_CANDIDATES();
  }
  console.log({ selected })
  state.selected = selected
  return state;
}

export const generateNewGameState = (difficulty: Difficulty): SudokuState => {
  const id = getId();
  const board = generateSudokuPuzzle(difficulty);
  let selected: number = -1;

  const boardState = board.flat().reduce((acc, curr, i) => {
    if (selected === -1 && curr === EMPTY_CELL) selected = i;

    acc.cells[i] = {
      id: i,
      prefilled: curr !== EMPTY_CELL,
      value: curr,
    }

    acc.candidates[i] = EMPTY_CANDIDATES();

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
    time: 0,
  }
}

export const loadSudokuState = (difficulty: Difficulty, forceRegen: boolean = false): SudokuState => {
  if (forceRegen === true) return generateNewGameState(difficulty);

  const localStorageState = getSudokuLocalStorage(difficulty);
  // generae new board if none in storage
  if (!localStorageState) return generateNewGameState(difficulty);
  const now = new Date();
  const [_, day] = parseId(localStorageState.id);
  // generae new board if than 1 day old
  // todo add logic for generating also off of last played timestamp 
  if (now.getDate() > Number(day)) return generateNewGameState(difficulty);
  return localStorageState;
}