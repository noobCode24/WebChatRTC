// các host đc phép truy cập vào host của BE
export const WHITELIST_DOMAINS = [
  'http://localhost:5173',
  'http://localhost:5174',
]


export const STATUS_FRIEND_REQUEST = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}


export const TYPE_CONVERSATION = {
  PERSONAL: 'personal',
  GROUP: 'group'
}


export const TYPE_MESSAGE = {
  TEXT: 'text',
  MEDIA: 'media',
  DOCUMENT: "document"
}


export const FOLDER_MESSAGE_IMAGES = 'ChatWeb/MessageImages'