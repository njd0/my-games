import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/useHook'
import {
  setCellValue,
} from '@/redux/slices/sudoku/sudokuSlice';
import { BoardRender, EMPTY_CELL } from '../config';
interface BoardContextValue {
  boardSize: number;
}

export const BoardContext =
  createContext<BoardContextValue>({
    boardSize: (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3),
  })

export const Board: FC<PropsWithChildren> = ({ children }) => {
  const { selected } = useAppSelector(state => state.sudoku);
  const dispatch = useAppDispatch();

  const boardSize = useMemo(() => {
    // todo make this reactive to screen size
    return (9 * BoardRender.Cell.Desktop + (2 * BoardRender.Gap) - 3)
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;
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
  }, [dispatch, selected])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown]);

  const contextValue: BoardContextValue = {
    boardSize,
  }

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  )
}
