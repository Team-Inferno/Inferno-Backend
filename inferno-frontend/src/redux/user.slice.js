import { createSlice } from "@reduxjs/toolkit";
const isEmpty = require("is-empty");

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    uid: null,
    username: null,
    email: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.isLoggedIn = !isEmpty(action.payload);
      state.username = action.payload.username;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
