import { Server } from "socket.io";
import { messagesModel } from "~/models/messagesModel";

let io;
const initSocket = (server, corsOptions) => {
  io = new Server(server, { cors: corsOptions });
  const userSockets = new Map();
  const conversationRooms = new Map();

  io.on("connection", (socket) => {
    // console.log(`User connected: ${socket.id}`);

    socket.on("registerUser", (userId) => {
      if (!socket.rooms.has(userId)) {
        socket.join(userId);
        // console.log(`User ${userId} joined room with userId:  ${userId}`);
        userSockets.set(socket.id, userId);
      }
    });

    socket.on("joinConversation", async ({ userId, conversationId }) => {
      if (!socket.rooms.has(conversationId)) {
        socket.join(conversationId);
        // console.log(`User ${userId} joined conversation room with conversationId:  ${conversationId}`);
        io.in(conversationId)
          .allSockets()
          .then((sockets) => {
            const socketInRoom = Array.from(sockets);
            // console.log("🚀 ~ io.in ~ user registered:", socketInRoom);
            socketInRoom.forEach((socketId) => {
              conversationRooms.set(userId, socketId);
            });
            // console.log("🚀 ~ socketInRoom.forEach ~ conversationRooms and participants: ", conversationRooms);
          });
      }
    });

    socket.on("sendMessage", async ({ conversationId, message, type, receiverFilesBuffer = undefined, senderFiles }) => {
      // console.log('🚀 ~ socket.on ~ receiverFilesBuffer:', receiverFilesBuffer)
      // console.log('🚀 ~ socket.on ~ message:', message)
      const res = await messagesModel.findOneById(message?._id);
      if (res) {
        res._id = res._id.toString();
        res.conversationId = res.conversationId.toString();
        res.senderId = res.senderId.toString();
        res.receiverIds = res.receiverIds.map(item => ({ receiverId: item.receiverId.toString() }))
        res.seenBy = res?.seenBy?.map(item => ({
          ...item,
          userId: item?.userId.toString()
        }))
      }
      if (receiverFilesBuffer) {
        console.log('🚀 ~ socket.on ~ conversationId:', conversationId)
        io.to(conversationId).emit("receiveMessage", { conversationId, message: res, type, receiverFilesBuffer, senderFiles });
      } else {
        console.log('🚀 ~ socket.on ~ conversationId:', conversationId)
        io.to(conversationId).emit("receiveMessage", { conversationId, message, type });
      }
      // }
    });


    // socket.on('sendSignalSeenMessage', ({ senderId, receiverId, conversationId, message, senderFiles = [] }) => {
    //   console.log('🚀 ~ socket.on ~ message:', message)
    //   // console.log("================================")
    //   // console.log('🚀 ~ socket.on ~ conversationId:', conversationId)
    //   // console.log('🚀 ~ socket.on ~ receiverId:', receiverId)
    //   // console.log('🚀 ~ socket.on ~ senderId:', senderId)
    //   // console.log("================================\n")
    //   // senderId = senderId.toString()
    //   // receiverId = receiverId.toString()
    //   // conversationId = conversationId.toString()
    //   if (message) {
    //     message.seenBy = message.seenBy?.map(item => ({
    //       ...item,
    //       userId: item?.userId.toString()
    //     }))
    //   }
    //   io.to(receiverId).emit("receiveSignalSeenMessage", { senderId, receiverId, conversationId, message, senderFiles });
    //   io.to(senderId).emit("receiveSignalSeenMessage", { senderId, receiverId, conversationId, message, senderFiles });
    // });

    // socket.on('sendReaction', ({ messageSocket, selectedReactionsSocket }) => {
    //   console.log('🚀 ~ socket.on ~ messageSocket:', messageSocket)
    //   console.log('🚀 ~ socket.on ~ selectedReactionsSocket:', selectedReactionsSocket)
    //   io.to(messageSocket?.conversationId).emit('receiveReaction', { messageSocket, selectedReactionsSocket });
    // })

    // socket.on('sendRecallMessageForAll', ({ messageRecallForAll }) => {
    //   console.log('🚀 ~ socket.on ~ messageRecallForAll:', messageRecallForAll)
    //   io.to(messageRecallForAll?.conversationId).emit('receiveRecallMessageForAll', { messageRecallForAll })
    // })

    socket.on("disconnect", () => {
      // console.log(`User disconnected: ${socket.id}`);
      socket.rooms.forEach((room) => {
        socket.leave(room);
        // console.log(`User left room ${room}`);
      });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được init");
  }
  return io;
};

export { initSocket, getIO };
