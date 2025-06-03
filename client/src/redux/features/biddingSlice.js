import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import biddingService from "../services/bidService";
import { toast } from "react-toastify";
import { BIDDING_URL } from "../../utils/url";
import axios from "axios";

const initialState = {
  history: [],
  bidding: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const placebid = createAsyncThunk(
  "bid/create",
  async ({ price, productId }, thunkAPI) => {
    try {
      return await biddingService.placebid({ price, productId });
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const validateBid = createAsyncThunk(
  "bid/validate",
  async ({ productId, price }, thunkAPI) => {
    try {
      return await biddingService.validateBid({ productId, price });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const fetchBiddingHistory = createAsyncThunk(
  "bid/getHistory",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`${BIDDING_URL}/history/${productId}`);
      console.log('API Response:', response.data); // Debug
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const sellproductsbyuser = createAsyncThunk("bid/sell", async ( {productId}, thunkAPI) => {
    try {
      return await biddingService.sellproductsbyuser(productId);
    } catch (error) {
      const errorMessage =  (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const biddingSlice = createSlice({
  name: "bidding",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    }
  },
  extraReducers: (builder) => {
        builder
            .addCase(placebid.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(placebid.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = action.message;
            toast.success("Амжилттай");
          })
          .addCase(placebid.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          }) 
          
           .addCase(sellproductsbyuser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(sellproductsbyuser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = action.message; // ✅ this line was missing
          })

          .addCase(sellproductsbyuser.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = action.payload;
          })
           .addCase(fetchBiddingHistory.pending, (state) => {
            state.isLoading = true;
          })
        .addCase(fetchBiddingHistory.fulfilled, (state, action) => {
            console.log('Fetched history:', action.payload); // Debug
            state.history = Array.isArray(action.payload) ? action.payload : [];
            state.isLoading = false;
            state.isSuccess = true;
          })
            .addCase(fetchBiddingHistory.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          });
          
          
    },
});
export const { reset } = biddingSlice.actions;
export default biddingSlice.reducer;
