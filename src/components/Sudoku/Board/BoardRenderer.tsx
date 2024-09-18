import { useCallback, useContext, useMemo } from "react";
import { CellRenderer } from "../Cell/CellRenderer";
import { Cell } from "../Cell/CellContext";
import { BoardContext } from "./BoardContext";
import { cellIdToRowCol, get2dDistance, getGroupIds } from "@/utils/sudoku/sudoku";
import { useAppSelector } from "@/redux/useHook";
import { SudokuCell } from "@/redux/slices/sudoku/types";
import { BoolSet } from "@/utils/types";
import { EMPTY_CELL } from "../config";

export const BoardRenderer = () => {
  const { selected, cells, candidates } = useAppSelector(state => state.sudoku);
  const { boardSize } = useContext(BoardContext);

  const selectedGroupIds = useMemo(() => getGroupIds(selected), [selected]);

  const isInSelectedGroup = useCallback((cellId: number) => {
    return selectedGroupIds.colIds[cellId] ||
      selectedGroupIds.rowIds[cellId] ||
      selectedGroupIds.boxIds[cellId]
  }, [selectedGroupIds]);

  const conflictedCells = useMemo(() => {
    const conflicted: BoolSet = {};

    // find all conflicted cells
    for (const cell of Object.values(cells)) {
      if (cell.value === EMPTY_CELL) continue;
      // for each cell, get all related group ids
      const groupIds = getGroupIds(cell.id);

      // get all groupIds, excluding current cell
      const ids = Object.values(groupIds).reduce((acc, curr) => {
        return [
          ...acc,
          ...Object.keys(curr).map(Number),
        ].filter((value, index, self) => {
          return self.indexOf(value) === index && value !== cell.id;
        });
      }, [] as number[]);

      for (let id of ids) {
        if (cells[id].value === cell.value) conflicted[id] = true;
      }
    }

    return conflicted;
  }, [cells])

  const getDistance = useCallback((cellId: number) => {
    const { row: r1, col: c1 } = cellIdToRowCol(selected);
    const { row: r2, col: c2 } = cellIdToRowCol(cellId);
    return get2dDistance(c1, r1, c2, r2);
  }, [selected])

  return (
    <div className="w-[100vw] max-w-[500px] min-w-[auto] md:max-w-[800px] md:min-w-[500px] md:w-[80vh] cursor-default">
      <div className="relative h-0 pb-[100%]">
        <div className="absolute top-0 left-0 right-0 bottom-0 ">
          <div
            style={{
              top: '5px',
              width: `${boardSize}px`,
              height: `${boardSize}px`
            }}
            className={`relative bg-[#959595] translate-x-[-50%] left-[50%] outline-[5px] outline outline-black`}>
            {Object.values(cells).map(cell => (
              <Cell key={cell.id}>
                <CellRenderer
                  cell={cell}
                  candidates={candidates[cell.id]}
                  isConflicted={conflictedCells[cell.id]}
                  isHighlighted={isInSelectedGroup(cell.id)}
                  distanceFromSelected={getDistance(cell.id)}
                />
              </Cell>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}