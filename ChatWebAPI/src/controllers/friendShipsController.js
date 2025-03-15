import { StatusCodes } from "http-status-codes";
import { friendShipsService } from "~/services/friendShipsService";

const create = async (req, res, next) => {
  try {
    const friends = await friendShipsService.create(req.body);
    res.status(StatusCodes.CREATED).json(friends);
  } catch (error) {
    next(error);
  }
};

const findOneByUserId = async (req, res, next) => {
  try {
    const friends = await friendShipsService.findOneByUserId(req.params.userId);
    return res.status(StatusCodes.OK).json(friends);
  } catch (error) {
    next(error);
  }
};


// const addFriend = async (req, res, next) => {
//   try {
//     const data = { ...req.body, ...req.params }
//     const resAccepted = await friendShipsService.addFriend(data);
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




export const friendShipsController = {
  create,
  findOneByUserId,
  // addFriend,
};
