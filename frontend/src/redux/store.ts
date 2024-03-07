import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import {setupListeners} from "@reduxjs/toolkit/query/react"
import authReducer from "../redux/state/authSlice"
import { emailApi } from './services/emailApi';
export const store = configureStore({
  reducer: {
    auth:authReducer,
    [authApi.reducerPath]:authApi.reducer,
    [emailApi.reducerPath]:emailApi.reducer

  },
  middleware:(curryGetDefaultMiddleware)=>curryGetDefaultMiddleware().concat(authApi.middleware,emailApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);