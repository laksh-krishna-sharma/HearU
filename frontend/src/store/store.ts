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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

