import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import {setupListeners} from "@reduxjs/toolkit/query/react"
import authReducer from "../redux/state/authSlice"
import { emailApi } from './services/emailApi';
import { usersApi } from './services/usersApi';
import styleSlice from './state/styleSlice';
import emailSlice from './state/emailSlice';
import usersSlice from './state/usersSlice';
export const store = configureStore({
  reducer: {
    auth:authReducer,
    [authApi.reducerPath]:authApi.reducer,
    [emailApi.reducerPath]:emailApi.reducer,
    [usersApi.reducerPath]:usersApi.reducer,
    style: styleSlice,
    email:emailSlice,
    users:usersSlice


  },
  middleware:(curryGetDefaultMiddleware)=>curryGetDefaultMiddleware().concat(authApi.middleware,emailApi.middleware,usersApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);