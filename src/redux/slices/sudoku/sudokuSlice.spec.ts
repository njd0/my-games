import { GenerateEmptyCellBoard } from '../../../components/Sudoku/config';
import sudokuReducer, {
  // resetBoard,
  setSelectDifficulty,
  SudokuState,
} from './sudokuSlice';

describe('counter reducer', () => {
  const initialState: SudokuState = {
    board: GenerateEmptyCellBoard(),
    difficulty: 'easy',
    selectedCell: undefined,
  };

  // it('should handle initial state', () => {
  //   expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
  //     value: 0,
  //     status: 'idle',
  //   });
  // });

  it('should handle difficult change', () => {
    const actual = sudokuReducer(initialState, setSelectDifficulty('medium'));
    expect(actual.difficulty).toEqual('medium');
  });
});
