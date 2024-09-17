import { createContext, ReactNode, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/useHook'
import {
  setSelectCell,
  setCellCandidate,
} from '../../../redux/slices/sudoku/sudokuSlice';
import { BoardCell, SelectedCell } from '../../../redux/slices/sudoku/types';
import { EmptyCell } from '../config';

interface CellContextValue {
  selectCell: (cell: SelectedCell) => void
  selectCandidate: (candidate: number) => void
  isSelectedCell: boolean;
  row: number;
  col: number;
  cell: BoardCell;
}

export const CellContext =
  createContext<CellContextValue>({
    row: 0,
    col: 0,
    cell: {
      value: EmptyCell,
      candidates: {},
    },
    isSelectedCell: false,
    selectCell: () => {
      // intentionally empty
    },
    selectCandidate: () => {
      // intentionally empty
    },
  })

interface Props {
  row: number;
  col: number;
  children: ReactNode;
}

export const Cell = ({ children, row, col }: Props) => {
  const dispatch = useAppDispatch();
  const { selectedCell, board } = useAppSelector(state => state.sudoku)

  const selectCell = useCallback((cell: SelectedCell) => {
    dispatch(setSelectCell(cell))
  }, [dispatch]);

  const selectCandidate = useCallback((candidate: number) => {
    dispatch(setCellCandidate(candidate))
  }, [dispatch])

  const isSelectedCell = useMemo(() => {
    if (!selectedCell) return false;
    return selectedCell.col === col && selectedCell.row === row;
  }, [selectedCell])

  const contextValue: CellContextValue = {
    selectCell,
    selectCandidate,
    isSelectedCell,
    row,
    col,
    cell: board[row][col]
  }

  return (
    <CellContext.Provider value={contextValue}>
      {children}
    </CellContext.Provider>
  )
}
