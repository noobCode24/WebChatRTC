/* eslint-disable no-console */
import Joi, { any } from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    friends: Joi.array().items(
      Joi.object({
        friendId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        createdAt: Joi.date().timestamp('javascript').default(Date.now())
      })
    ).default([]),
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

const findOneByUserId = async (req, res, next) => {
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

// const addFriend = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     userId: Joi.string()
//       .required()
//       .pattern(OBJECT_ID_RULE)
//       .message(OBJECT_ID_RULE_MESSAGE),
//     friendId: Joi.string()
//       .required()
//       .pattern(OBJECT_ID_RULE)
//       .message(OBJECT_ID_RULE_MESSAGE),
//   });
//   try {
//     await correctCondition.validateAsync({
//       ...req.body,
//       ...req.params
//     }, { abortEarly: false });
//     next();
//   } catch (error) {
//     next(
//       new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
//     );
//   }
// }

// const replyFriendRequest = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     userId: Joi.string()
//       .required()
//       .pattern(OBJECT_ID_RULE)
//       .message(OBJECT_ID_RULE_MESSAGE),
//     friendId: Joi.string()
//       .required()
//       .pattern(OBJECT_ID_RULE)
//       .message(OBJECT_ID_RULE_MESSAGE),
//     status: Joi.string().valid(STATUS_FRIEND_REQUEST.ACCEPTED, STATUS_FRIEND_REQUEST.REJECTED).required()
//   });
//   try {
//     await correctCondition.validateAsync({
//       ...req.body,
//       ...req.params
//     }, { abortEarly: false });
//     next();
//   } catch (error) {
//     next(
//       new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
//     );
//   }
// }

export const friendShipsValidation = {
  create,
  findOneByUserId,
  // addFriend,
  // replyFriendRequest
};
