/* eslint-disable no-console */
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { STATUS_FRIEND_REQUEST } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const FRIEND_REQUESTS_COLLECTION_NAME = "friend_requests";
const FRIEND_REQUESTS_COLLECTION_SCHEMA = Joi.object({
  senderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  receiverId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  status: Joi.number().valid(
    STATUS_FRIEND_REQUEST.ACCEPTED,
    STATUS_FRIEND_REQUEST.PENDING,
    STATUS_FRIEND_REQUEST.REJECTED)
    .default(STATUS_FRIEND_REQUEST.PENDING),
  createdAt: Joi.date().timestamp('javascript').default(() => Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
});

// const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await FRIEND_REQUESTS_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

// const getAll = async () => {
//   try {
//     const products = await GET_DB()
//       .collection(FRIEND_REQUESTS_COLLECTION_NAME)
//       .find({})
//       .toArray();
//     return products;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const create = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data);
    validateData.senderId = new ObjectId(validateData.senderId);
    validateData.receiverId = new ObjectId(validateData.receiverId);
    return await GET_DB()
      .collection(FRIEND_REQUESTS_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (_id) => {
  try {
    return await GET_DB()
      .collection(FRIEND_REQUESTS_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(_id),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(FRIEND_REQUESTS_COLLECTION_NAME)
      .find({
        $or: [
          { senderId: new ObjectId(userId) },
          { receiverId: new ObjectId(userId) },
        ],
      }).toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const checkIsExistFriendRequest = async (ids) => {
  try {
    return await GET_DB()
      .collection(FRIEND_REQUESTS_COLLECTION_NAME)
      .findOne({
        senderId: new ObjectId(ids.senderId),
        receiverId: new ObjectId(ids.receiverId),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllByReceiverId = async (receiverId) => {
  try {
    return await GET_DB()
      .collection(FRIEND_REQUESTS_COLLECTION_NAME)
      .find({
        receiverId: new ObjectId(receiverId)
      }).toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (_id, updateData) => {
  try {
    return await GET_DB()
      .collection(FRIEND_REQUESTS_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(_id),
        },
        {
          $set: updateData,
        },
        { returnDocument: "after" }
      );
  } catch (error) {
    throw new Error(error);
  }
}


export const friendRequestsModel = {
  FRIEND_REQUESTS_COLLECTION_NAME,
  FRIEND_REQUESTS_COLLECTION_SCHEMA,
  create,
  findOneById,
  getAllByUserId,
  getAllByReceiverId,
  update,
  checkIsExistFriendRequest
};
