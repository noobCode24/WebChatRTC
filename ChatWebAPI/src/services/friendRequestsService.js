/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { conversationsModel } from "~/models/conversationsModel";
import { friendRequestsModel } from "~/models/friendRequestsModel";
import { friendShipsModel } from "~/models/friendShipsModel";
import { STATUS_FRIEND_REQUEST } from "~/utils/constants";

const create = async (reqBody) => {
  try {
    const isExist = await friendRequestsModel.checkIsExistFriendRequest(reqBody)
    if (isExist) {
      if (isExist.status === STATUS_FRIEND_REQUEST.REJECTED) {
        const updatedAt = isExist.updatedAt;
        const now = Date.now();

        const diffInMs = now - updatedAt;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        console.log('🚀 ~ create ~ diffInHours:', diffInHours)

        if (diffInHours <= 12) {
          return { message: `You need to wait ${diffInHours < 1 ? (diffInHours.toFixed(0) * 60).toString() + ' more minute(s)' : (diffInHours.toFixed(0)).toString() + ' more hour'} before sending another friend request` }
        }
      }
      return null
    }
    const resCreated = await friendRequestsModel.create(reqBody);
    const friendRequest = await friendRequestsModel.findOneById(resCreated.insertedId);
    return friendRequest;
  } catch (error) {
    throw error;
  }
};


const getAllByUserId = async (userId) => {
  try {
    const friendRequests = await friendRequestsModel.getAllByUserId(userId);
    return friendRequests;
  } catch (error) {
    throw error;
  }
};

const getAllByReceiverId = async (receiverId) => {
  try {
    const friendRequests = await friendRequestsModel.getAllByReceiverId(receiverId);
    return friendRequests;
  } catch (error) {
    throw error;
  }
};

const update = async (_id, updateData) => {
  console.log('🚀 ~ update ~ updateData:', updateData)
  /**
   * _id: friendRequest id
   * updataData: {
   *  status
   * }
   * friendRequest: {
   *  senderId: A
   *  receiverId: B
   * }
   */
  try {
    const friendRequest = await friendRequestsModel.findOneById(_id)
    console.log('🚀 ~ update ~ friendRequest:', friendRequest)
    if (friendRequest?.status === STATUS_FRIEND_REQUEST.ACCEPTED || friendRequest?.status === STATUS_FRIEND_REQUEST.REJECTED) {
      return { message: "This friend request has been accepted or rejected." };
    }
    if (updateData?.status) {
      if (updateData.status === STATUS_FRIEND_REQUEST.ACCEPTED) {
        const senderFriendShips = await friendShipsModel.findOneByUserId(friendRequest.senderId); // A
        const receiverFriendShips = await friendShipsModel.findOneByUserId(friendRequest.receiverId); // B

        // check A có trong friendships của B không
        const isExistReceiverFriendShips = receiverFriendShips?.friendsList?.some(friend => friend.friendId === friendRequest.senderId);
        // check B có trong friendships của A không
        const isExistSenderFriendShips = senderFriendShips?.friendsList?.some(friend => friend.friendId === friendRequest.receiverId);

        if (isExistReceiverFriendShips && isExistSenderFriendShips) {
          return { message: "You are already friends with this user." };
        }

        if (!isExistReceiverFriendShips) {
          await friendShipsModel.addFriend({ userId: friendRequest.receiverId, friendId: friendRequest.senderId });
        }
        if (!isExistSenderFriendShips) {
          await friendShipsModel.addFriend({ userId: friendRequest.senderId, friendId: friendRequest.receiverId });
        }

        const conversation = {
          participants: [
            { userId: (friendRequest.senderId).toString() },
            { userId: (friendRequest.receiverId).toString() }
          ],
          type: "personal"
        }
        console.log('🚀 ~ update ~ conversation:', conversation)
        await conversationsModel.create(conversation)
      }
    }
    updateData.updatedAt = Date.now()
    const res = await friendRequestsModel.update(_id, updateData);
    return res;
  } catch (error) {
    throw error;
  }
};

export const friendRequestsService = {
  create,
  getAllByUserId,
  getAllByReceiverId,
  update
};
