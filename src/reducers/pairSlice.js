import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pair, tokenContract } from "../utils/ethers.util";

export const getV2Pair = createAsyncThunk('pairs/getV2Pair', async (pairAddress) => {
  const token0 = await pair(97, pairAddress).token0();
  const token1 = await pair(97, pairAddress).token1();
  const symbol0 = await tokenContract(97, token0).symbol();
  const symbol1 = await tokenContract(97, token1).symbol();
  return {
    address: pairAddress,
    symbol1: symbol0,
    symbol2: symbol1
  }
});


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
    [getV2Pair.fulfilled]: (state, action) => {
      console.log(action.payload)
      state.uniswapV2Pairs.push(action.payload);
    }
  }
});

export default pairSlice.reducer;