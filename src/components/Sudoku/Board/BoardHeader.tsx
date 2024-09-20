import { useAppDispatch, useAppSelector } from "@/redux/useHook"
import { setCandidates, setCells, setDifficulty, setNewBoard } from "@/redux/slices/sudoku/sudokuSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { Difficulty, SudokuCells, SudokuCellsCandidates } from "@/redux/slices/sudoku/types";
import { setTime } from "@/redux/slices/sudoku/sudokuSlice";
import { EMPTY_CELL } from "../config";
import { getShuffledNumbers } from "@/utils/sudoku/helpers";
import _ from 'lodash';

function getRowIndexes(index: number): number[] {
  const rowStart = Math.floor(index / 9) * 9;
  return Array.from({ length: 9 }, (_, i) => rowStart + i);
}

function getColIndexes(index: number): number[] {
  const colStart = index % 9;
  return Array.from({ length: 9 }, (_, i) => colStart + i * 9);
}

function getBoxIndexes(index: number): number[] {
  const rowStart = Math.floor(index / 9);
  const colStart = index % 9;

  // Calculate which 3x3 box the index is in
  const boxRowStart = Math.floor(rowStart / 3) * 3;
  const boxColStart = Math.floor(colStart / 3) * 3;

  // Collect all 9 elements of the 3x3 box
  const boxIndexes: number[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      boxIndexes.push((boxRowStart + i) * 9 + (boxColStart + j));
    }
  }
  return boxIndexes;
}

function inGroup(cells: SudokuCells, groupIds: number[], value: number) {
  for (let i = 0; i < groupIds.length; ++i) {
    if (cells[groupIds[i]].value === value) return true;
  }
  return false
}

const isValidSudokuCell = (cells: SudokuCells, i: number, value: number) => {
  return (
    !inGroup(cells, getRowIndexes(i), value) &&
    !inGroup(cells, getColIndexes(i), value) &&
    !inGroup(cells, getBoxIndexes(i), value))
}

const solveBoard = (cells: SudokuCells) => {
  for (let y = 0; y < Object.keys(cells).length; ++y) {
    if (cells[y].value === EMPTY_CELL) {
      const numbers = getShuffledNumbers();
      for (let x = 0; x < numbers.length; ++x) {
        if (isValidSudokuCell(cells, y, numbers[x])) {
          cells[y].value = numbers[x]

          if (solveBoard(cells)) {
            return true;
          }

          cells[y].value = EMPTY_CELL
        }
      }

      return false;
    }
  }

  return true
}

const solveBoardCandidates = (cells: SudokuCells, candidates: SudokuCellsCandidates) => {
  for (let y = 0; y < Object.keys(cells).length; ++y) {
    if (cells[y].value === EMPTY_CELL) {
      const numbers = getShuffledNumbers();
      for (let x = 0; x < numbers.length; ++x) {
        console.log(y, isValidSudokuCell(cells, y, numbers[x]), numbers[x])
        if (isValidSudokuCell(cells, y, numbers[x])) {
          candidates[y][numbers[x]] = true;
        }
      }
    }
  }
}

const parseSeconds = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  let formattedTime = `${m}:${s < 10 ? `0${s}` : s}`;
  if (h || d) formattedTime = `${h}:${formattedTime}`
  if (d) formattedTime = `${d}:${formattedTime}`

  return formattedTime;
}

const Timer = () => {
  const dispatch = useAppDispatch();
  const { time, difficulty, cells, candidates } = useAppSelector(state => state.sudoku);

  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(time);
  const timeRef = useRef(time);
  const interval = useRef<NodeJS.Timer>()

  const onChangeDifficulty = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTime(timeRef.current))
    dispatch(setDifficulty(e.target.value as Difficulty))
  }, [dispatch, difficulty])

  useEffect(() => {
    // update internal component state with global time
    setTimer(time);
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    if (!isPaused) {
      interval.current = setInterval(() => {
        setTimer(s => {
          ++s;
          timeRef.current = s;
          return s;
        });
      }, 1000);
    } else {
      clearInterval(interval.current);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [isPaused])

  useEffect(() => {
    // save timer on refresh
    const handleBeforeUnload = () => {
      dispatch(setTime(timeRef.current))
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const onClickPause = () => {
    setIsPaused(true);
  }

  const onClickSolve = useCallback(() => {
    const temp = _.cloneDeep(cells);
    const didSolve = solveBoard(temp);
    if (didSolve) dispatch(setCells(temp));
  }, [cells, dispatch]);

  const onClickSolveCandidates = useCallback(() => {
    const temp = _.cloneDeep(candidates);
    solveBoardCandidates(cells, temp);
    dispatch(setCandidates(temp));
  }, [cells, candidates, dispatch]);

  const onClickNewBoard = useCallback(() => {
    dispatch(setNewBoard(difficulty));
  }, [difficulty, dispatch]);

  return (
    <div>
      <select onChange={onChangeDifficulty}>
        <option>easy</option>
        <option>medium</option>
        <option>hard</option>
      </select>
      {parseSeconds(timer)}
      <button className="w-10 h-10 bg-yellow-300" onClick={onClickPause}>PAUSE</button>
      <button className="w-10 h-10 bg-green-300 ml-4" onClick={onClickSolve}>SOLVE IT</button>
      <button className="w-10 h-10 bg-purple-300 ml-4" onClick={onClickSolveCandidates}>SUGGEST IT</button>
      <button className="w-10 h-10 bg-red-300 ml-4" onClick={onClickNewBoard}>NEW BOARD</button>
    </div>
  );
}

export const BoardHeader = () => {
  const dispatch = useAppDispatch();

  // const onChangeDifficulty = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
  //   dispatch(setSelectDifficulty(e.target.value as Difficulty))
  // }, [dispatch])

  return (
    <div className="w-full h-[50px]">
      <div className="flex justify-center">
        {/* <select onChange={onChangeDifficulty}>
          <option>easy</option>
          <option>medium</option>
          <option>hard</option>
        </select> */}
        <Timer />
      </div>
    </div>
  )
}