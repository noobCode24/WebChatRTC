/* eslint-disable no-console */
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const USERS_COLLECTION_NAME = "users";
const USERS_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  avatar: Joi.string().default(null),
  password: Joi.string().required(),
  status: Joi.string().valid('offline', 'online').default('offline'),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

// const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await USERS_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const getAll = async () => {
  try {
    const users = await GET_DB()
      .collection(USERS_COLLECTION_NAME)
      .find({})
      .toArray();
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (data) => {
  console.log('🚀 ~ create ~ data:', data)
  try {
    const validateData = await validateBeforeCreate(data);
    return await GET_DB()
      .collection(USERS_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};


const findOneById = async (_id) => {
  try {
    return await GET_DB()
      .collection(USERS_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(_id),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByUserName = async (username) => {
  try {
    return await GET_DB()
      .collection(USERS_COLLECTION_NAME)
      .findOne({
        username: username
      });
  } catch (error) {
    throw new Error(error);
  }
}
const findOneByEmail = async (email) => {
  try {
    return await GET_DB()
      .collection(USERS_COLLECTION_NAME)
      .findOne({
        email: email
      });
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (_id, updateData) => {
  try {
    return await GET_DB()
      .collection(USERS_COLLECTION_NAME)
      .findOneAndUpdate({
        _id: new ObjectId(_id),
      }, {
        $set: updateData,
      });
  } catch (error) {
    throw new Error(error);
  }
}

export const usersModel = {
  USERS_COLLECTION_NAME,
  USERS_COLLECTION_SCHEMA,
  create,
  findOneById,
  findOneByEmail,
  getAll,
  findOneByUserName,
  update
};
