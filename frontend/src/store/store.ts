import { configureStore } from "@reduxjs/toolkit";
import {authslice} from "./slices/authSlice";
import { journalSlice } from "./slices/journalSlice";

export const store = configureStore({
  reducer: {
    auth: authslice.reducer,
    journal: journalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
