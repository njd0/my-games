import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sudokuReducer from './slices/sudoku/sudokuSlice';

export const store = configureStore({
  reducer: {
    sudoku: sudokuReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
