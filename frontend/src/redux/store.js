import { configureStore } from '@reduxjs/toolkit'
import documentDataReducer from './slices/documentData'


export default configureStore({

  reducer: {
    documentData: documentDataReducer
  }
})
