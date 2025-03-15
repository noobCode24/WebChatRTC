/* eslint-disable no-console */
import Joi, { any } from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { STATUS_FRIEND_REQUEST } from "~/utils/constants";

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    senderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    receiverId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    status: Joi.number().valid(
      STATUS_FRIEND_REQUEST.ACCEPTED,
      STATUS_FRIEND_REQUEST.PENDING,
      STATUS_FRIEND_REQUEST.REJECTED)
      .default(STATUS_FRIEND_REQUEST.PENDING),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const getAllByUserId = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });
  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const getAllByReceiverId = async (req, res, next) => {
  const correctCondition = Joi.object({
    receiverId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });
  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};


const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    status: Joi.number().valid(
      STATUS_FRIEND_REQUEST.ACCEPTED,
      STATUS_FRIEND_REQUEST.REJECTED).required()
  });
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
}

export const friendRequestsValidation = {
  create,
  getAllByUserId,
  getAllByReceiverId,
  update
};
