import { useContext, useMemo } from "react";
import { CellRenderer } from "../Cell/CellRenderer";
import { Cell } from "../Cell/CellContext";
import { BoardContext } from "./BoardContext";
import { getGroupIds } from "@/utils/sudoku/sudoku";
import { useAppSelector } from "@/redux/useHook";

export const BoardRenderer = () => {
  const { selected, cells, candidates } = useAppSelector(state => state.sudoku);
  const { boardSize } = useContext(BoardContext);

  const highlightedCells = useMemo(() => {
    return getGroupIds(selected)
  }, [selected]);

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
                  isHighlighted={
                    highlightedCells.colIds[cell.id] ||
                    highlightedCells.rowIds[cell.id] ||
                    highlightedCells.boxIds[cell.id]
                  }
                />
              </Cell>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}