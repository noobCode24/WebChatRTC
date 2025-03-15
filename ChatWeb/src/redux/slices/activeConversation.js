import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const initialState = {
  activeConversation: null
}

export const activeConversationSlice = createSlice({
  name: 'activeConversation',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload
    }
  },
})

export const { setActiveConversation } = activeConversationSlice.actions

export const activeConversationSelector = (state) => state.activeConversation.activeConversation

export const userPersistConfig = {
  key: 'activeConversation',
  storage
}

export default activeConversationSlice.reducer