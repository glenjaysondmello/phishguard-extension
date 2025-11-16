import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

const initialState = {
  items: [],
  total: 0,
  page: 0,
  limit: 25,
  status: "idle",
  error: null,
};

interface Params {
  page?: number;
  limit?: number;
  status?: string;
}

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (
    { page = 0, limit = 25, status = "" }: Params,
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
      });

      const { data } = await api.get(`/report?${params.toString()}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchReports.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload.error;
      });
  },
});

export default reportsSlice.reducer;
