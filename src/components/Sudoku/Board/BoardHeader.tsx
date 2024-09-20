import { useAppDispatch, useAppSelector } from "@/redux/useHook"
import { setSelectDifficulty } from "@/redux/slices/sudoku/sudokuSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { Difficulty } from "@/redux/slices/sudoku/types";
import { setTime } from "@/redux/slices/sudoku/sudokuSlice";

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
  const { time, difficulty } = useAppSelector(state => state.sudoku);

  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(time);
  const timeRef = useRef(time);
  const interval = useRef<NodeJS.Timer>()

  const onChangeDifficulty = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTime(timeRef.current))
    dispatch(setSelectDifficulty(e.target.value as Difficulty))
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

  return (
    <div>
      <select onChange={onChangeDifficulty}>
        <option>easy</option>
        <option>medium</option>
        <option>hard</option>
      </select>
      {parseSeconds(timer)}
      <button className="w-10 h-10 bg-black" onClick={onClickPause}></button>
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