/* eslint-disable no-console */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { TYPE_MESSAGE } from "~/utils/constants";

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    conversationId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    senderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    receiverIds: Joi.array().items(
      Joi.object({
        receiverId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      })
    ),
    content: Joi.string().min(1).max(1000).required(),
    type: Joi.string().valid(TYPE_MESSAGE.TEXT, TYPE_MESSAGE.MEDIA, TYPE_MESSAGE.DOCUMENT).required(),
    seenBy: Joi.array().items(
      Joi.object({
        userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
        seenAt: Joi.date().timestamp('javascript').default(null),
      })
    ).default([]),
    files: Joi.array().items(
      Joi.object(
        {
          url: Joi.string(),
          type: Joi.string(),
          name: Joi.string(),
          size: Joi.string(),
        }
      )
    ).default([]),
    reactions: Joi.array().items(
      Joi.object({
        userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
        reaction: Joi.string().required(),
        createdAt: Joi.date().timestamp('javascript').default(() => Date.now()),
        updatedAt: Joi.date().timestamp('javascript').default(null),
      })
    ).default([]),
    deletedBy: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    ).default([]),
    isDestroy: Joi.boolean().default(false),
  });

  try {
    if (req.body.type === 'text') {
      await correctCondition.validateAsync(req.body, { abortEarly: false });
    } else {
      // const message = JSON.parse(req.body.message);
      // if (message.content.trim() === "") message.content = '_'
      const tmp = { ...req.body, content: '.' }
      await correctCondition.validateAsync(tmp, { abortEarly: false });
    };
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

const findAllByConversationId = async (req, res, next) => {
  const correctCondition = Joi.object({
    conversationId: Joi.string()
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

// const findOneBetweenTwoUser = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     userId1: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
//     userId2: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
//   });

//   try {
//     await correctCondition.validateAsync(req.query, { abortEarly: false });
//     next();
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
//   }
// };

const updateSeenAllMessageInOneConversation = async (req, res, next) => {
  const correctCondition = Joi.object({
    conversationId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  });
  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    reactions: Joi.array().items(
      Joi.object({
        userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
        reaction: Joi.string().required(),
        createdAt: Joi.date().timestamp('javascript').default(() => Date.now()),
        updatedAt: Joi.date().timestamp('javascript').default(null),
      })
    ).default([]),
    deletedBy: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    ),
    isDestroy: Joi.boolean(),
  });
  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}


const uploadFile = async (req, res, next) => {
  const correctCondition = Joi.object({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  });
  try {
    await correctCondition.validateAsync({ ...req.params }, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}

const updateMessageFiles = async (req, res, next) => {
  const correctCondition = Joi.object({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    files: Joi.array().items(
      Joi.object({
        url: Joi.string(),
        type: Joi.string(),
        name: Joi.string(),
        size: Joi.number(),
      }
      )
    )
  });
  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}

export const messagesValidation = {
  create,
  findOneById,
  findAllByConversationId,
  findAllByUserId,
  updateSeenAllMessageInOneConversation,
  uploadFile,
  updateMessageFiles,
  update
};
