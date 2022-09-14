import { combineReducers } from "redux";
import pairSlice from "./pairSlice";

const rootReducer = combineReducers({
  pairs: pairSlice
});

export default rootReducer;