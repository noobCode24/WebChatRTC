/* eslint-disable no-console */
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const FRIENDS_COLLECTION_NAME = "friendships";
const FRIENDS_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  friendsList: Joi.array().items(
    Joi.object({
      friendId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      createdAt: Joi.date().timestamp('javascript').default(Date.now())
    })
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
});

// const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await FRIENDS_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

// const getAll = async () => {
//   try {
//     const products = await GET_DB()
//       .collection(FRIENDS_COLLECTION_NAME)
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
    validateData.userId = new ObjectId(validateData.userId);
    return await GET_DB()
      .collection(FRIENDS_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (_id) => {
  try {
    return await GET_DB()
      .collection(FRIENDS_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(_id),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(FRIENDS_COLLECTION_NAME)
      .findOne({
        userId: new ObjectId(userId),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const addFriend = async (data) => {
  try {
    return await GET_DB()
      .collection(FRIENDS_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          userId: new ObjectId(data.userId),
        },
        {
          $push: {
            friendsList: {
              friendId: new ObjectId(data.friendId),
              createdAt: Date.now()
            }
          }
        },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
}



export const friendShipsModel = {
  FRIENDS_COLLECTION_NAME,
  FRIENDS_COLLECTION_SCHEMA,
  create,
  findOneById,
  findOneByUserId,
  addFriend,
};
