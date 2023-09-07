import { configureStore, createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import clidDialerReducer from "../features/clid-dialer/clidDialerSlice";

export const componentSlice = createSlice({
  name: "component",
  initialState: {
    name: "state",
  },
  reducers: {
    setComponent: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state = action.payload;
    },
  },
});

const allReducers = combineReducers({
  component: componentSlice.reducer,
  clidDialer: clidDialerReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }
  if (action.type === "RESET_COMPONENT") {
    state[action.payload.name] = undefined;
  }

  if (action.type == "SET_COMPONENT") {
    state.component = action.payload;
  }

  return allReducers(state, action);
};
export const store = configureStore({
  reducer: rootReducer,
});
