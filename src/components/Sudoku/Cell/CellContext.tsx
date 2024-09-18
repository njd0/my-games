import { createContext, FC, PropsWithChildren, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/useHook'
import {
  setSelectCell,
  setCellCandidate,
} from '@/redux/slices/sudoku/sudokuSlice';

interface CellContextValue {
  selectCell: (cellId: number) => void
  selectCandidate: (cellId: number, candidate: number) => void
  isSelectedCell: (cellId: number) => boolean
}

export const CellContext =
  createContext<CellContextValue>({
    isSelectedCell: () => false,
    selectCell: () => {
      // intentionally empty
    },
    selectCandidate: () => {
      // intentionally empty
    },
  })

export const Cell: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { selected } = useAppSelector(state => state.sudoku)

  const selectCell = useCallback((cellId: number) => {
    dispatch(setSelectCell(cellId))
  }, [dispatch]);

  const selectCandidate = useCallback((cellId: number, candidate: number) => {
    dispatch(setCellCandidate({
      cellId,
      candidate
    }))
  }, [dispatch])

  const isSelectedCell = useCallback((cellId: number) => {
    return selected === cellId
  }, [selected])

  const contextValue: CellContextValue = {
    selectCell,
    selectCandidate,
    isSelectedCell,
  }

  return (
    <CellContext.Provider value={contextValue}>
      {children}
    </CellContext.Provider>
  )
}
