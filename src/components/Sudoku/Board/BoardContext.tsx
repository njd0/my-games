import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch } from '@/redux/useHook'
import {
  setCellValue,
} from '@/redux/slices/sudoku/sudokuSlice';
import { BoardRender, EmptyCell, GenerateEmptyBoard } from '../config';

interface BoardContextValue {
  dummyBoard: number[][];
  boardSize: number;
}

export const BoardContext =
  createContext<BoardContextValue>({
    dummyBoard: [],
    boardSize: (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3)
  })

export const Board: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

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
  }, [onKeyDown])

  const contextValue: BoardContextValue = {
    dummyBoard,
    boardSize,
  }

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  )
}
