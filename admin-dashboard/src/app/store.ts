import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import reportsReducer from '../features/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
  },
});