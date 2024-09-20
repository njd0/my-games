import { useAppSelector } from "@/redux/useHook";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Difficulty } from "@/redux/slices/sudoku/types";
import { BoardContext } from "./BoardContext";

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

export const BoardHeader = () => {
  const { time } = useAppSelector(state => state.sudoku);

  const {
    solveBoardPuzzle,
    solveBoardCandidates,
    changeDifficulty,
    createNewBoard,
    updateTime,
    setIsPaused,
    resetBoard,
    isPaused,
  } = useContext(BoardContext);

  const [timer, setTimer] = useState(time);
  const timeRef = useRef(time);
  const interval = useRef<NodeJS.Timer>()

  useEffect(() => {
    // update internal component state with global time
    // only updates on load or if board difficult changes
    setTimer(time);
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    if (!isPaused) {
      // set timer if game timer isnt paused
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
      updateTime(timeRef.current)
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [updateTime]);

  const onClickPause = useCallback(() => {
    setIsPaused(true);
  }, [setIsPaused]);

  const onChangeDifficulty = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    changeDifficulty(e.target.value as Difficulty, timeRef.current)
  }, [changeDifficulty])

  const onClickSolve = useCallback(() => {
    solveBoardPuzzle();
  }, [solveBoardPuzzle])

  const onClickSolveCandidates = useCallback(() => {
    solveBoardCandidates()
  }, [solveBoardCandidates])

  const onClickNewBoard = useCallback(() => {
    createNewBoard();
  }, [createNewBoard])

  const onClickResetBoard = useCallback(() => {
    resetBoard();
  }, [resetBoard])

  return (
    <div className="w-full h-[50px]">
      <div className="flex justify-center">
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
        <button className="w-10 h-10 bg-blue-300 ml-4" onClick={onClickResetBoard}>RESET BOARD</button>
      </div>
    </div>
  )
}