import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./private/userSlice";
import productReducer from "./private/productSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
  }
});