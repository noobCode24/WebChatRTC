/* eslint-disable no-console */
import Joi, { any } from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { TYPE_CONVERSATION } from "~/utils/constants";

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    participants: Joi.array().min(2).items(
      Joi.object({
        userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      })
    ).required(),
    type: Joi.string().valid(TYPE_CONVERSATION.PERSONAL, TYPE_CONVERSATION.GROUP).required(),
    groupName: Joi.string().max(50),
    groupAvatar: Joi.string().uri(),
    createdAt: Joi.date().timestamp('javascript').default(() => Date.now())
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

const findOneById = async (req, res, next) => {
  const correctCondition = Joi.object({
    _id: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE).required()
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

const findAllByUserId = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE).required()
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

const findOneBetweenTwoUser = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId1: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    userId2: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  });

  try {
    await correctCondition.validateAsync(req.query, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};


export const conversationsValidation = {
  create,
  findOneById,
  findAllByUserId,
  findOneBetweenTwoUser
};
