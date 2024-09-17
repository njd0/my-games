export const EmptyCell = 0

export const GenerateEmptyBoard = () =>
  Array.from({ length: 9 }, () => (
    Array.from({ length: 9 }, () => EmptyCell)
  ))

export const GenerateEmptyCellBoard = () =>
  Array.from({ length: 9 }, () => (
    Array.from({ length: 9 }, () => ({
      value: EmptyCell,
      candidates: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, false])),
    }))
  ))

export const BoardRender = {
  Cell: {
    Desktop: 64,
    Mobile: 52,
  },
  Gap: 5,
}