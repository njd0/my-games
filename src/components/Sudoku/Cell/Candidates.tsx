import { useCallback, useContext } from "react";
import { CellContext } from "./CellContext";
import classNames from "classnames";

interface Props {
  candidates: { [key: string]: boolean }
}

export const Candidates = ({ candidates }: Props) => {
  const {
    isSelectedCell,
    selectCandidate,
  } = useContext(CellContext);

  const onSelectCandidate = useCallback((candidate: number) => {
    selectCandidate(candidate);
  }, [selectCandidate])

  return (
    <div className={classNames("grid grid-cols-3 w-full h-full", {
      'pointer-events-none': !isSelectedCell
    })}>
      {Object.entries(candidates).map(([k, v]) => (
        <div
          key={k}
          className={classNames("flex items-center justify-center text-sm", {
            'opacity-1': v === true,
            'opacity-0 transition-opacity duration-1000 ease-out hover:opacity-60': v === false,
          })}
          onClick={() => onSelectCandidate(Number(k))}
        >{k}</div>
      ))}
    </div>
  )
}