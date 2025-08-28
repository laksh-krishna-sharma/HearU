import { configureStore } from "@reduxjs/toolkit";
import {authslice} from "./slices/authSlice";
import { journalSlice } from "./slices/journalSlice";
import { eveSlice } from "./slices/eveSlice"; 

export const store = configureStore({
  reducer: {
    auth: authslice.reducer,
    journal: journalSlice.reducer,
    eve: eveSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
