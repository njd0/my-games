export const EMPTY_CELL = 0;

export const EMPTY_CANDIDATES = () => Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, false]))

export const GRID_SIZE = 9;
export const SUBGRID_SIZE = 3;

export const BoardRender = {
  Cell: {
    Desktop: 64,
    Mobile: 52,
  },
  Gap: 5,
}