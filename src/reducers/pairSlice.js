import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  uniswapV2Pairs: [],
  uniswapV3Pools: [],
  pancakePairs: [],
  pangolinPairs: [],
  traderJoePairs: []
}
const pairSlice = createSlice({
  name: 'pairs',
  initialState,
  extraReducers: {

  }
});

export default pairSlice.reducer;