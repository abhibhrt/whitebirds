import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    clearProduct: (state) => {
      state.product = null;
    },
    updateProduct: (state: any, action) => {
      if (state.product) {
        state.product = { ...state.product, ...action.payload };
      }
    },
  },
});

export const { setProduct, clearProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer;