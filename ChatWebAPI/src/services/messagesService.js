/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import { messagesModel } from "~/models/messagesModel";
import { cloudinaryProvider } from "~/providers/cloudinary";
import { getIO } from "~/socket/socket";
import ApiError from "~/utils/ApiError";
import { FOLDER_MESSAGE_IMAGES, TYPE_MESSAGE } from "~/utils/constants";

const create = async (reqBody, reqFiles = undefined) => {
  try {
    const resCreated = await messagesModel.create(reqBody, !!reqFiles);
    const message = await messagesModel.findOneById(resCreated.insertedId);
    let updatedMessage = { ...message }
    // if (message && reqFiles) {
    //   const uploadImages = await cloudinaryProvider.uploadMultipleFiles(reqFiles, FOLDER_MESSAGE_IMAGES)
    //   console.log('🚀 ~ create ~ uploadImages:', uploadImages)
    //   if (uploadImages?.length > 0) {
    //     const resUpdated = messagesModel.update(message._id, uploadImages)
    //     if (resUpdated) {
    //       updatedMessage = { ...updatedMessage }
    //     }
    //   }
    // }
    return updatedMessage;
  } catch (error) {
    throw error;
  }
};

const findOneById = async (_id) => {
  try {
    const message = await messagesModel.findOneById(_id);
    return message;
  } catch (error) {
    throw error;
  }
};


const findAllByConversationId = async (conversationId) => {
  try {
    const messages = await messagesModel.findAllByConversationId(conversationId);
    return messages;
  } catch (error) {
    throw error;
  }
};

const findAllByUserId = async (userId) => {
  try {
    const messages = await messagesModel.findAllByUserId(userId);
    return messages;
  } catch (error) {
    throw error;
  }
};

const updateSeenAllMessageInOneConversation = async (data) => {
  try {
    const result = await messagesModel.updateSeenAllMessageInOneConversation(data);
    return result;
  } catch (error) {
    throw error;
  }
}


const update = async (_id, updateData) => {
  console.log('🚀 ~ update ~ updateData:', updateData)
  try {
    if (updateData?.deletedBy) {
      const message = await messagesModel.findOneById(_id);
      const isExist = message?.notSeen?.map(uid => uid === updateData.deletedBy?.[0])
      console.log('🚀 ~ update ~ isExist:', isExist)
      if (!isExist) {
        const result = await messagesModel.updateDeletedByMessage(_id, updateData?.deletedBy?.[0])
        console.log('🚀 ~ update ~ result:', result)
        return result
      } else return null;
    } else {
      const result = await messagesModel.update(_id, updateData);
      return result;
    }
  } catch (error) {
    throw error;
  }
}

const uploadFile = async (_id, reqFiles) => {
  try {
    const result = await messagesModel.uploadFile(_id, reqFiles);
    if (result) {
      const resUpdated = await messagesModel.update(_id, { files: [...result] })

      const io = getIO();
      if (resUpdated) {
        console.log('🚀 ~ uploadFile ~ resUpdated:', resUpdated)
        const uploadStatus = true;
        io.to(String(resUpdated.conversationId)).emit("receiveUploadStatus", { uploadStatus, message: resUpdated });
        return resUpdated
      }
    }
    return null;
  } catch (error) {
    throw error;
  }
}

const updateMessageFiles = async (_id, files) => {
  try {
    const message = await messagesModel.findOneById(_id);
    if (!message) throw new ApiError(StatusCodes.NOT_FOUND, "NOT FOUND")
    if (message.type === TYPE_MESSAGE.CONTAIN_DOCUMENT) {
      message.files = message.files?.map((f, index) => ({
        ...f,
        name: files[index].name,
        size: files[index].size
      }))
    }

    const result = await messagesModel.update(_id, message);
    return result;
  } catch (error) {
    throw error;
  }
}

export const messagesService = {
  create,
  findOneById,
  findAllByConversationId,
  findAllByUserId,
  updateSeenAllMessageInOneConversation,
  uploadFile,
  updateMessageFiles,
  update
};
