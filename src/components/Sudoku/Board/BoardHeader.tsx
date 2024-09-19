import { useAppDispatch } from "@/redux/useHook"
import { setSelectDifficulty } from "@/redux/slices/sudoku/sudokuSlice";
import { useCallback } from "react";
import { Difficulty } from "@/redux/slices/sudoku/types";

export const BoardHeader = () => {
  const dispatch = useAppDispatch();

  const onChangeDifficulty = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectDifficulty(e.target.value as Difficulty))
  }, [dispatch])

  return (
    <div className="w-full h-[50px]">
      <div className="flex justify-center">
        <select onChange={onChangeDifficulty}>
          <option>easy</option>
          <option>medium</option>
          <option>hard</option>
        </select>
      </div>
    </div>
  )
}