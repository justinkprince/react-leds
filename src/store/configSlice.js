import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../data/test-config";

export const fetchConfig = createAsyncThunk("leds/fetchConfig", async () => {
  return config;
});

export const saveConfig = createAsyncThunk(
  "leds/saveConfig",
  async (config, { dispatch }) => {}
);

export const configSlice = createSlice({
  name: "leds",
  initialState: {
    error: null,
    status: "idle",
    leds: [],
    shelves: [],
  },
  reducers: {
    // updateActiveSubmissionGuid: (state, action) => {
    //   state.activeSubmissionGuid = action.payload;
    // },
  },
  extraReducers: {
    [fetchConfig.pending]: (state) => {
      state.status = "fetch.loading";
    },
    [fetchConfig.fulfilled]: (state, action) => {
      state.status = "fetch.succeeded";
      state.leds = action.payload.leds;
      state.shelves = action.payload.shelves;
    },
    [fetchConfig.rejected]: (state, action) => {
      state.status = "fetch.failed";
      state.error = action.error.message;
      console.error(action.error.message);
    },
    [saveConfig.pending]: (state) => {
      state.status = "save.loading";
    },
    [saveConfig.fulfilled]: (state, action) => {
      state.status = "save.succeeded";
      state.leds = action.payload;
    },
    [saveConfig.rejected]: (state, action) => {
      state.status = "save.failed";
      state.error = action.error.message;
      console.error(action.error.message);
    },
  },
});

// export const { updateActiveSubmissionGuid } = ledsSlice.actions;

export const selectLeds = (state) => state.config.leds;

export const selectShelves = (state) => state.config.shelves;

export default configSlice.reducer;
