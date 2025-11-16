import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../services/api";

interface BlacklistItem {
  _id: string;
  domain: string;
  reason: string;
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const initialState = {
  items: [] as BlacklistItem[],
  status: "idle",
  error: null,
};

export const fetchBlacklist = createAsyncThunk(
  "blacklist/fetchBlacklist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/blacklist");
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBlacklistDomain = createAsyncThunk(
  "blacklist/addBlacklistDomain",
  async (
    { domain, reason }: { domain: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post("/blacklist", { domain, reason });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeBlacklistDomain = createAsyncThunk(
  "blacklist/removeBlacklistDomain",
  async (domain, { rejectWithValue }) => {
    try {
      await api.delete(`/blacklist/${domain}`);
      return domain;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const blacklistSlice = createSlice({
  name: "blacklist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlacklist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlacklist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBlacklist.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(
        addBlacklistDomain.fulfilled,
        (state, action: PayloadAction<BlacklistItem>) => {
          state.items.unshift(action.payload);
        }
      )
      .addCase(removeBlacklistDomain.fulfilled, (state, action: any) => {
        state.items = state.items.filter(
          (item) => item.domain !== action.payload
        );
      });
  },
});

export default blacklistSlice.reducer;
