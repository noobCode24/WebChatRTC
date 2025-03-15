import { API_HOST } from "../config/constants"
import authorizedAxiosInstance from "../utils/authorizeAxios"


// Auth
export const loginAPI = async (data) => {
  return (await authorizedAxiosInstance.post(`${API_HOST}/v1/users/login`, data)).data
}

export const handleLogoutAPI = async () => {
  const response = await authorizedAxiosInstance.delete(`${API_HOST}/v1/users/logout`)
  return response.data
}

export const handleRefreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_HOST}/v1/users/refresh_token`, { refreshToken })
}
// Auth

// User

export const createUserAPI = async (data) => {
  return (await authorizedAxiosInstance.post(`${API_HOST}/v1/users/register`, data)).data
}

export const getUserByIdAPI = async (userId) => {
  return (await authorizedAxiosInstance.get(`${API_HOST}/v1/users/${userId}`)).data
}

export const getAllUsersAPI = async () => {
  return (await authorizedAxiosInstance.get(`${API_HOST}/v1/users`)).data
}

export const updateUserAPI = async (userId, updateData) => {
  return (await authorizedAxiosInstance.put(`${API_HOST}/v1/users/${userId}`, updateData)).data
}

// User


// Conversations

export const createConversationAPI = async (conversation) => {
  return (await authorizedAxiosInstance.post(`${API_HOST}/v1/conversations`, conversation)).data
}

export const getAllConversationsByUserId = async (userId) => {
  return (await authorizedAxiosInstance.get(`${API_HOST}/v1/conversations/by-user/${userId}`)).data
}

export const getOneConversationById = async (_id) => {
  return (await authorizedAxiosInstance.get(`${API_HOST}/v1/conversations/${_id}`)).data
}

export const getOneConversationBetweenTwoUsers = async (userIds) => {
  return (await authorizedAxiosInstance.get(`${API_HOST}/v1/conversations/between-two-users?userId1=${userIds[0]}&userId2=${userIds[1]}`)).data
}

// Conversations


// Messages

export const createMessageAPI = async (message, hasFormData = false, formData = null) => {
  return hasFormData ? (await authorizedAxiosInstance.post(`${API_HOST}/v1/messages`, formData,)).data
    :
    (await authorizedAxiosInstance.post(`${API_HOST}/v1/messages`, message)).data
}

export const getAllMessagesByConversationIdAPI = async (conversationId) => {
  return (await authorizedAxiosInstance.get(`${API_HOST}/v1/messages/by-conversation/${conversationId}`)).data
}

export const updateSeenMessagesAPI = async (conversationId, userId) => {
  return (await authorizedAxiosInstance.put(`${API_HOST}/v1/messages/seen/${conversationId}`, { userId })).data
}

export const uploadFileAPI = async (messageId, formData) => {
  return (await authorizedAxiosInstance.post(`${API_HOST}/v1/messages/${messageId}/uploadFile`, formData)).data;
}

export const updateMessageFilesAPI = async (messageId, files) => {
  return (await authorizedAxiosInstance.put(`${API_HOST}/v1/messages/${messageId}/update-message-files`, { files })).data
}

export const updateMessageAPI = async (_id, updateData) => {
  return (await authorizedAxiosInstance.put(`${API_HOST}/v1/messages/${_id}`, updateData)).data
}
// Messages

// Upload

