import { getIO } from "./socket";

export const emitFriendRequest = (receiverId, requestData) => {
  // console.log('🚀 ~ emitFriendRequest ~ receiverId:', receiverId)
  // console.log('🚀 ~ emitFriendRequest ~ requestData:', requestData)
  try {
    const io = getIO();
    console.log('🚀 ~ emitFriendRequest ~ io:', io)
    io.to(String(receiverId)).emit("receiveFriendRequest", requestData);
    console.log(`Request successfully ${receiverId}`);
  } catch (error) {
    console.error("Request failed", error.message);
  }
};


export const emitReplyFriendRequest = (receiverId, replyData) => {
  try {
    const io = getIO();
    io.to(String(receiverId)).emit("replyFriendRequest", replyData);
    console.log(`Reply request successfully ${receiverId}`);
  } catch (error) {
    console.error("Reply request failed", error.message);
  }
};
