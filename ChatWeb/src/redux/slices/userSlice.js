import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const initialState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload
    }
  },
})

export const { setUserInfo } = userSlice.actions

export const userSelector = (state) => state.user.user

export const userPersistConfig = {
  key: 'user',
  storage
}

export default userSlice.reducer