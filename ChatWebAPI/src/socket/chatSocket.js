// import { getIO } from "./socket";

// export const emitSendMessage = (receiverId, requestData) => {
//   try {
//     const io = getIO();
//     io.to(String(receiverId)).emit("receiveFriendRequest", requestData);
//     console.log(`Request successfully ${receiverId}`);
//   } catch (error) {
//     console.error("Request failed", error.message);
//   }
// };
