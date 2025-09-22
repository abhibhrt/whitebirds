import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  productId: number;
  publicId: string;
}

interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  feedback: string;
  createdAt: string;
}

interface ProductHighlight {
  id: number;
  key: string;
  value: string;
  productId: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: string;
  sizes: string;
  delivery: number;
  shipCharge: number;
  returnable: number;
  createdAt: string;
  images?: ProductImage[];
  reviews?: ProductReview[];
  highlights?: ProductHighlight[];
}

// Redux slice state
interface ProductState {
  product: Product | null;
}

const initialState: ProductState = {
  product: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<Product | null>) => {
      state.product = action.payload;
    },
    clearProduct: (state) => {
      state.product = null;
    },
    updateProduct: (state, action: PayloadAction<Partial<Product>>) => {
      if (state.product) {
        state.product = { ...state.product, ...action.payload };
      }
    },
  },
});

export const { setProduct, clearProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer;