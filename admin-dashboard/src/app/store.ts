import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import reportsReducer from '../features/reportsSlice';
import blacklistReducer from '../features/blacklistSlice';
import { injectStore } from "../services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
    blacklist: blacklistReducer
  },
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;