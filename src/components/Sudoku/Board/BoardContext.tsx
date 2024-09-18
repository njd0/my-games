import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/useHook'
import {
  setBoard,
  setCellValue,
} from '@/redux/slices/sudoku/sudokuSlice';
import { BoardRender, EmptyCell, GenerateEmptyBoard } from '../config';
import { CellCoordinates } from '@/redux/slices/sudoku/types';
import { getRelatedGroups } from '@/utils//sudoku/sudoku';
import { generateSudoku } from '@/utils/sudoku/boardGenerator';

interface BoardContextValue {
  dummyBoard: number[][];
  boardSize: number;
  highlightedCells?: ReturnType<typeof getRelatedGroups>
}

export const BoardContext =
  createContext<BoardContextValue>({
    dummyBoard: [],
    boardSize: (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3),
    highlightedCells: undefined,
  })

export const Board: FC<PropsWithChildren> = ({ children }) => {
  const {
    selectedCell,
    difficulty,
  } = useAppSelector(state => state.sudoku);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // todo use local storage to cache unsolved generated board states
    // todo every day cache should be cleared
    const board = generateSudoku(difficulty);
    dispatch(setBoard(board));
  }, [difficulty, dispatch])

  const dummyBoard = useMemo(() => GenerateEmptyBoard(), []);

  const boardSize = useMemo(() => {
    // todo make this reactive to screen size
    return (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3)
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    switch (true) {
      case (Number(key) >= 1 && Number(key) <= 9):
        dispatch(setCellValue(Number(key)));
        break;
      case (key === 'Backspace'):
        dispatch(setCellValue(EmptyCell));
        break;
    }
  }, [setCellValue])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown]);

  const highlightedCells = useMemo(() => {
    if (!selectedCell) return undefined;
    const { col, row } = selectedCell;
    return getRelatedGroups({ col, row });
  }, [selectedCell]);

  const contextValue: BoardContextValue = {
    dummyBoard,
    boardSize,
    highlightedCells,
  }

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  )
}
