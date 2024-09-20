import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/useHook'
import {
  setCandidates,
  setCells,
  setCellValue,
  setDifficulty,
  setNewBoard,
  setResetBoard,
  setTime,
} from '@/redux/slices/sudoku/sudokuSlice';
import { BoardRender, EMPTY_CELL } from '../../../utils/sudoku/config';
import { solveCells, solveCellsCandidates } from '@/utils/sudoku/helpers';
import _ from 'lodash';
import { Difficulty } from '@/redux/slices/sudoku/types';

interface BoardContextValue {
  boardSize: number;
  solveBoardPuzzle: () => void
  solveBoardCandidates: () => void
  changeDifficulty: (difficulty: Difficulty, time: number) => void
  createNewBoard: () => void
  resetBoard: () => void
  updateTime: (time: number) => void
  setIsPaused: (pause: boolean) => void
  isPaused: boolean
}

export const BoardContext =
  createContext<BoardContextValue>({
    boardSize: (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3),
    solveBoardPuzzle: () => { },
    solveBoardCandidates: () => { },
    changeDifficulty: () => { },
    createNewBoard: () => { },
    resetBoard: () => { },
    updateTime: () => { },
    setIsPaused: () => { },
    isPaused: false,
  })

export const Board: FC<PropsWithChildren> = ({ children }) => {
  const { selected, cells, candidates, difficulty } = useAppSelector(state => state.sudoku);
  const dispatch = useAppDispatch();
  const [isPaused, setIsPaused] = useState(false);

  const boardSize = useMemo(() => {
    // todo make this reactive to screen size
    return (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3)
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;

    const { prefilled } = cells[selected];
    if (prefilled) return;

    switch (true) {
      case (Number(key) >= 1 && Number(key) <= 9):
        dispatch(setCellValue({
          cellId: selected,
          value: Number(key)
        }));
        break;
      case (key === 'Backspace'):
        dispatch(setCellValue({
          cellId: selected,
          value: EMPTY_CELL,
        }));
        break;
    }
  }, [dispatch, selected, cells]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown]);

  const updateTime = useCallback((time: number) => {
    dispatch(setTime(time))
  }, [dispatch])

  const solveBoardPuzzle = useCallback(() => {
    const copy = _.cloneDeep(cells);
    const didSolve = solveCells(copy);
    if (didSolve) dispatch(setCells(copy));
  }, [dispatch, cells]);

  const solveBoardCandidates = useCallback(() => {
    const copy = _.cloneDeep(candidates);
    solveCellsCandidates(cells, copy);
    dispatch(setCandidates(copy));
  }, [dispatch, cells, candidates]);

  const changeDifficulty = useCallback((difficulty: Difficulty, time: number) => {
    dispatch(setTime(time))
    dispatch(setDifficulty(difficulty))
  }, [dispatch])

  const createNewBoard = useCallback(() => {
    dispatch(setNewBoard(difficulty));
  }, [dispatch, difficulty]);

  const resetBoard = useCallback(() => {
    dispatch(setResetBoard());
  }, [dispatch]);

  const contextValue: BoardContextValue = {
    boardSize,
    solveBoardPuzzle,
    solveBoardCandidates,
    changeDifficulty,
    createNewBoard,
    updateTime,
    setIsPaused,
    isPaused,
    resetBoard,
  }

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  )
}
