/* eslint-disable no-console */
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { cloudinaryProvider } from "~/providers/cloudinary";
import { FOLDER_MESSAGE_IMAGES, TYPE_MESSAGE } from "~/utils/constants";
import { removeVietnameseDiacritics } from "~/utils/formatters";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const MESSAGES_COLLECTION_NAME = "messages";
const MESSAGES_COLLECTION_SCHEMA = Joi.object({
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
  createdAt: Joi.date().timestamp('javascript').default(() => Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
});

// const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await MESSAGES_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const create = async (data, hasFormData = false) => {
  try {
    const tmp = { ...data }
    let ok = true;
    if (tmp.content === "" && (data?.type === 'media' || data?.type === 'document')) {
      tmp.content = '_';
      ok = false;
    }
    const validateData = await validateBeforeCreate(tmp);
    if (!ok) {
      validateData.content = ""
    }
    validateData.senderId = new ObjectId(data.senderId);
    validateData.receiverIds = validateData?.receiverIds?.map(obj => ({ receiverId: new ObjectId(obj.receiverId) }))
    validateData.conversationId = new ObjectId(data.conversationId);
    return await GET_DB()
      .collection(MESSAGES_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (_id) => {
  try {
    return await GET_DB()
      .collection(MESSAGES_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(_id),
      });
  } catch (error) {
    throw new Error(error);
  }
};


const findAllByConversationId = async (conversationId) => {
  try {
    return await GET_DB()
      .collection(MESSAGES_COLLECTION_NAME)
      .find({ conversationId: new ObjectId(conversationId) })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const findAllByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(MESSAGES_COLLECTION_NAME)
      .find({
        $or: [
          { senderId: new ObjectId(userId) },
          { "receiverIds.receiverId": new ObjectId(userId) }
        ]
      })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};


const updateSeenAllMessageInOneConversation = async (data) => {
  try {
    return await GET_DB()
      .collection(MESSAGES_COLLECTION_NAME)
      .updateMany(
        {
          conversationId: new ObjectId(data.conversationId),
          "seenBy.userId": { $ne: new ObjectId(data.userId) }
        },
        {
          $push: {
            seenBy: {
              userId: new ObjectId(data.userId),
              seenAt: Date.now()
            }
          }
        }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (_id, updateData) => {
  try {
    if (updateData?.reactions) {
      updateData.reactions = updateData?.reactions?.map(r => ({
        ...r,
        userId: new ObjectId(r.userId)
      }))
    }
    return await GET_DB()
      .collection(MESSAGES_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const uploadFile = async (_id, files) => {
  try {
    let uploadedFiles = await cloudinaryProvider.uploadMultipleFiles(files, FOLDER_MESSAGE_IMAGES)
    console.log('🚀 ~ uploadFile ~ uploadedFiles:', uploadedFiles)
    uploadedFiles = uploadedFiles?.map((f, index) => ({
      url: f,
      type: files[index].mimetype,
      name: removeVietnameseDiacritics(files[index].originalname),
      size: files[index].size,
    }))
    return uploadedFiles
  } catch (error) {
    throw new Error(error);
  }
}

const updateDeletedByMessage = (_id, userId) => {
  try {
    return GET_DB()
      .collection(MESSAGES_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(_id) },
        {
          $push: {
            deletedBy: new ObjectId(userId)
          }
        }
      );
  } catch (error) {
    throw new Error(error);
  }
}

export const messagesModel = {
  MESSAGES_COLLECTION_NAME,
  MESSAGES_COLLECTION_SCHEMA,
  create,
  findOneById,
  findAllByConversationId,
  findAllByUserId,
  updateSeenAllMessageInOneConversation,
  uploadFile,
  update,
  updateDeletedByMessage
};
