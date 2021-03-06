import { combineReducers } from "@reduxjs/toolkit";

import configReducer from "./configSlice";

export default combineReducers({
  config: configReducer,
});
