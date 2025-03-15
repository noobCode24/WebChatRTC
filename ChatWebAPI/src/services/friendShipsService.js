/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { friendShipsModel } from "~/models/friendShipsModel";

const create = async (reqBody) => {
  try {
    const resCreated = await friendShipsModel.create(reqBody);
    const friendships = await friendShipsModel.findOneById(resCreated.insertedId);
    return friendships;
  } catch (error) {
    throw error;
  }
};


const findOneByUserId = async (userId) => {
  try {
    const friendships = await friendShipsModel.findOneByUserId(userId);
    return friendships;
  } catch (error) {
    throw error;
  }
};

// const addFriend = async (data) => {
//   try {
//     const senderFriendShips = await friendShipsModel.findOneByUserId(data.userId);
//     const receiverFriendShips = await friendShipsModel.findOneByUserId(data.friendId);

//     const isExistSenderFriendShips = senderFriendShips?.friendsList?.some(friend => friend.friendId === data.friendId);
//     const isExistReceiverFriendShips = receiverFriendShips?.friendsList?.some(friend => friend.friendId === data.userId);

//     if (isExistReceiverFriendShips && isExistSenderFriendShips) {
//       return { message: "You are already friends with this user." };
//     }
//     const results = {};
//     if (!isExistReceiverFriendShips) {
//       const updatedReceiver = await friendShipsModel.addFriend({ userId: data.friendId, friendId: data.userId });
//       results.receiver = updatedReceiver
//     }
//     if (!isExistSenderFriendShips) {
//       const updatedSender = await friendShipsModel.addFriend(data);
//       results.sender = updatedSender
//     }
//     return results;
//   } catch (error) {
//     throw error;
//   }
// };


export const friendShipsService = {
  create,
  findOneByUserId,
  // addFriend,
};
