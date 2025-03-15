/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { usersModel } from "~/models/usersModel";
import { hashPassword } from "~/utils/algorithms";

const create = async (reqBody) => {
  console.log('🚀 ~ create ~ reqBody:', reqBody)
  try {
    if (reqBody?.email) {
      const isExist = await usersModel.findOneByEmail(reqBody?.email)
      if (isExist) return { message: "Email already exists" }
    }

    if (reqBody?.password) {
      const hashedPassword = await hashPassword(reqBody?.password)
      reqBody.password = hashedPassword
    }

    const resCreated = await usersModel.create(reqBody);
    const user = await usersModel.findOneById(resCreated.insertedId);
    return user;
  } catch (error) {
    throw error;
  }
};

const getAll = async () => {
  try {
    const res = await usersModel.getAll();
    return res;
  } catch (error) {
    throw error;
  }
};

const update = async (_id, updateData) => {
  try {
    const res = await usersModel.update(_id, updateData);
    return res;
  } catch (error) {
    throw error;
  }
}


export const usersService = {
  create,
  getAll,
  update
};
