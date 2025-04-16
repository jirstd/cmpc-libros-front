import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import bookReducer  from "./librosSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
