import { generateNewGameState } from './loader';
import sudokuReducer, {
  setDifficulty,
  SudokuState,
} from './sudokuSlice';

describe('counter reducer', () => {
  const initialState: SudokuState = generateNewGameState('easy');

  // it('should handle initial state', () => {
  //   expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
  //     value: 0,
  //     status: 'idle',
  //   });
  // });

  it('should handle difficult change', () => {
    const actual = sudokuReducer(initialState, setDifficulty('medium'));
    expect(actual.difficulty).toEqual('medium');
  });
});
