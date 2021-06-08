import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/user.slice";
import errorReducer from "./redux/error.slice";

export default configureStore({
  reducer: {
      userReducer,
      errorReducer,
  },
});
