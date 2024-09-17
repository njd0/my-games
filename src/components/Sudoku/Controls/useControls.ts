import { useCallback, useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from '@/redux/useHook'
import { setCellValue } from "@/redux/slices/sudoku/sudokuSlice";
import { EmptyCell } from "../config";

export const useControls = () => {
  const { selectedCell } = useAppSelector(state => state.sudoku);
  const dispatch = useAppDispatch();

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
  }, [selectedCell, setCellValue])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])


  return useMemo(() => {

  }, []);
}