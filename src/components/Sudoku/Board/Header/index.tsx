import { useAppSelector } from "@/redux/useHook";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Difficulty } from "@/redux/slices/sudoku/types";
import { BoardContext } from "../BoardContext";
import { ActionMenu } from "./ActionMenu";
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import PauseIcon from '@mui/icons-material/Pause';

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
  const { time, difficulty } = useAppSelector(state => state.sudoku);

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

  const onChangeDifficulty = useCallback((e: SelectChangeEvent) => {
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
    <div className="w-full border-t-2 border-b-2 padding-4 mb-4">
      <div className="flex justify-between">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="select-difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="select-difficulty-label"
            id="select-difficulty"
            value={difficulty}
            label="Difficulty"
            onChange={onChangeDifficulty}
          >
            <MenuItem value={'easy'}>Easy</MenuItem>
            <MenuItem value={'medium'}>Medium</MenuItem>
            <MenuItem value={'hard'}>Hard</MenuItem>
          </Select>
        </FormControl>
        <div className="flex items-center gap-2">
          {parseSeconds(timer)}
          <IconButton aria-label="pause" size="small" onClick={onClickPause}>
            <PauseIcon fontSize="inherit" />
          </IconButton>
        </div>
        <ActionMenu />
      </div>
    </div>
  )
}