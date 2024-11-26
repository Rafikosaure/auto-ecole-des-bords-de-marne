import { configureStore } from '@reduxjs/toolkit';
import printFileDataReducer from './slices/printFileDataSlice';


export const store = configureStore({
  reducer: {
    printFileData: printFileDataReducer,
  },
});
