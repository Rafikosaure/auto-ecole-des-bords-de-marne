import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: undefined
};

export const printFileData = createSlice({
  name: 'printFileData',
  initialState,
  reducers: {
    saveData: (state, action) => {
      state.value = action.payload
    },
    reinitializeState: (state, action) => {
      state.value = undefined
    }
  }
});
  
export const { saveData, reinitializeState } = printFileData.actions;

export const selectPrintFileData = (state) => state.printFileData.value

export default printFileData.reducer;
  
  
