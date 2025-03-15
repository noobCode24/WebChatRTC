import { StatusCodes } from "http-status-codes";
import { friendRequestsService } from "~/services/friendRequestsService";
import { emitFriendRequest, emitReplyFriendRequest } from "~/socket/friendRequest.socket";

const create = async (req, res, next) => {
  try {
    const friendRequest = await friendRequestsService.create(req.body);
    if (!friendRequest) return res.status(StatusCodes.BAD_REQUEST).json({ message: "You have already sent a friend request to this user." });
    if (friendRequest?.message) return res.status(StatusCodes.BAD_REQUEST).json(friendRequest);
    console.log('🚀 ~ create ~ friendRequest:', friendRequest)
    emitFriendRequest(friendRequest.receiverId, friendRequest)
    return res.status(StatusCodes.CREATED).json(friendRequest);
  } catch (error) {
    next(error);
  }
};

const getAllByUserId = async (req, res, next) => {
  try {
    const friendRequests = await friendRequestsService.getAllByUserId(req.params.userId);
    return res.status(StatusCodes.OK).json(friendRequests);
  } catch (error) {
    next(error);
  }
};

const getAllByReceiverId = async (req, res, next) => {
  try {
    const friendRequests = await friendRequestsService.getAllByReceiverId(req.params.receiverId);
    return res.status(StatusCodes.OK).json(friendRequests);
  } catch (error) {
    next(error);
  }
};


// const addFriend = async (req, res, next) => {
//   try {
//     const data = { ...req.body, ...req.params }
//     const friends = await friendRequestsService.addFriend(data);
//     if (friends) {
//       emitFriendRequest(req.body.friendId, {
//         senderId: req.params.userId,
//         message: "Send friend request successfully!"
//       })
//       return res.status(StatusCodes.OK).json(friends);
//     }
//     return res.status(StatusCodes.NO_CONTENT).json({})
//   } catch (error) {
//     next(error);
//   }
// };

const update = async (req, res, next) => {
  try {
    const friendRequest = await friendRequestsService.update(req.params._id, req.body);
    if (friendRequest?.senderId) {
      emitReplyFriendRequest(friendRequest.senderId, friendRequest)
    }
    return res.status(StatusCodes.OK).json(friendRequest);
  } catch (error) {
    next(error);
  }
};


export const friendRequestsController = {
  create,
  getAllByUserId,
  getAllByReceiverId,
  update
};
