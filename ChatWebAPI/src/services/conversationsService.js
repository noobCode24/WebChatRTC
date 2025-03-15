/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { ObjectId } from "mongodb";
import { conversationsModel } from "~/models/conversationsModel";
import { TYPE_CONVERSATION } from "~/utils/constants";

const create = async (reqBody) => {
  try {
    if (reqBody.type === TYPE_CONVERSATION.PERSONAL) {
      const ids = reqBody?.participants.map(part => new ObjectId(part.userId))
      const isExist = await conversationsModel.findOneBetweenTwoUser(ids)
      if (isExist) return { message: "Conversation already exists" };
    }
    const resCreated = await conversationsModel.create(reqBody);
    const conversation = await conversationsModel.findOneById(resCreated.insertedId);
    return conversation;
  } catch (error) {
    throw error;
  }
};

const findOneById = async (_id) => {
  try {
    const conversation = await conversationsModel.findOneById(_id);
    return conversation;
  } catch (error) {
    throw error;
  }
};

const findAllByUserId = async (userId) => {
  try {
    const conversations = await conversationsModel.findAllByUserId(userId);
    return conversations;
  } catch (error) {
    throw error;
  }
};

const findOneBetweenTwoUser = async (userIds) => {
  try {
    const conversation = await conversationsModel.findOneBetweenTwoUser(userIds);
    return conversation;
  } catch (error) {
    throw error;
  }
};

export const conversationsService = {
  create,
  findOneById,
  findAllByUserId,
  findOneBetweenTwoUser
};
