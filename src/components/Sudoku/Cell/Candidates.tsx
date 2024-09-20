import { useCallback, useContext } from "react";
import { CellContext } from "./CellContext";
import classNames from "classnames";

interface Props {
  cellId: number
  candidates: { [k: number]: boolean }
  isSelected: boolean
}

export const Candidates = ({
  cellId,
  candidates,
  isSelected,
}: Props) => {
  const {
    selectCandidate,
  } = useContext(CellContext);

  const onSelectCandidate = useCallback((candidate: number) => {
    selectCandidate(cellId, candidate);
  }, [cellId, selectCandidate]);

  return (
    <div className={classNames("grid grid-cols-3 w-full h-full", {
      'pointer-events-none': !isSelected
    })}>
      {Object.entries(candidates).map(([k, v]) => (
        <div
          key={k}
          className={classNames("flex items-center justify-center text-sm", {
            'opacity-1': v === true,
            'opacity-0 hover:transition-opacity hover:duration-1000 hover:ease-out hover:opacity-60': v === false,
          })}
          onClick={() => onSelectCandidate(Number(k))}
        >{k}</div>
      ))}
    </div>
  )
}