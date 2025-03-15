/* eslint-disable no-console */
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { TYPE_CONVERSATION } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const CONVERSATIONS_COLLECTION_NAME = "conversations";
const CONVERSATIONS_COLLECTION_SCHEMA = Joi.object({
  participants: Joi.array().items(
    Joi.object({
      userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    })
  ).required(),
  type: Joi.string().valid(TYPE_CONVERSATION.PERSONAL, TYPE_CONVERSATION.GROUP).required(),
  groupName: Joi.string().max(50),
  groupAvatar: Joi.string().uri(),
  createdAt: Joi.date().timestamp('javascript').default(() => Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
});

// const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await CONVERSATIONS_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const create = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data);
    for (const user of validateData.participants) {
      user.userId = new ObjectId(user.userId);
    }
    return await GET_DB()
      .collection(CONVERSATIONS_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (_id) => {
  try {
    return await GET_DB()
      .collection(CONVERSATIONS_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(_id),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const findAllByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(CONVERSATIONS_COLLECTION_NAME)
      .find({ "participants.userId": new ObjectId(userId) })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const findOneBetweenTwoUser = async (userIds) => {
  try {
    const objectIds = userIds.map(id => new ObjectId(id));

    return await GET_DB()
      .collection(CONVERSATIONS_COLLECTION_NAME)
      .findOne({
        "participants.userId": { $all: objectIds }
      });
  } catch (error) {
    throw new Error(error);
  }
};


export const conversationsModel = {
  CONVERSATIONS_COLLECTION_NAME,
  CONVERSATIONS_COLLECTION_SCHEMA,
  create,
  findOneById,
  findAllByUserId,
  findOneBetweenTwoUser,
};
