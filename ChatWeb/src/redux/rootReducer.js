import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"

// slices
import appReducer from './slices/app'
import userReducer from './slices/userSlice'
import activeConversationReducer from './slices/activeConversation'

const rootPersistConfig = {
  key: "root",
  storage,
  keyprefix: "redux-"
}

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  activeConversation: activeConversationReducer
})

export { rootPersistConfig, rootReducer }
