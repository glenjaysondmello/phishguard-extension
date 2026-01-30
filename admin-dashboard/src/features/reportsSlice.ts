import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { ReportItem } from "../types/report.types";

const initialState = {
  items: [] as ReportItem[],
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
    { rejectWithValue },
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
  },
);

export const removeReport = createAsyncThunk(
  "reports/removeReport",
  async (reportId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/report/${reportId}`);
      return reportId;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateReportStatus = createAsyncThunk(
  "reports/updateStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      await api.patch(`/report/${id}/status`, {
        status,
      });
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  },
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
      })
      .addCase(removeReport.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (report) => report._id !== action.payload,
        );
      })
      .addCase(removeReport.rejected, (state, action: any) => {
        state.error = action.payload.error;
      })
      // .addCase(updateReportStatus.pending, (state, action) => {
      //   const { id, status } = action.meta.arg;
      //   const report = state.items.find((r) => r._id === id);

      //   if (report) report.status = status;
      // })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const report = state.items.find((r) => r._id === id);

        if (report) report.status = status;
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.error = action.payload as any;
      });
  },
});

export default reportsSlice.reducer;
