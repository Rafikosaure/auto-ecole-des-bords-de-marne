import { createSlice } from '@reduxjs/toolkit';
import data from '../../components/StudentCom/ConvocFormation/temporaryData'

const initialState = {
  value: data
}

export const documentDataSlice = createSlice({
  name: 'documentData',
  initialState,
  reducers: {
    saveData: (state, action) => {
      state.value = action.payload
    }
  }
});

export const { saveData } = documentDataSlice.actions;

export const selectDocumentData = (state) => state.documentData

export default documentDataSlice.reducer;