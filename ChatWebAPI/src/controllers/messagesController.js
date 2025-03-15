import { StatusCodes } from "http-status-codes";
import { messagesModel } from "~/models/messagesModel";
import { messagesService } from "~/services/messagesService";

const create = async (req, res, next) => {
  try {
    const message = await messagesService.create(req.files ? JSON.parse(req.body.message) : req.body, req.files);
    if (!message) return res.status(StatusCodes.BAD_REQUEST).json({ status: "failed" });

    await messagesModel.updateSeenAllMessageInOneConversation({
      userId: message.senderId,
      conversationId: message.conversationId
    })
    return res.status(StatusCodes.CREATED).json(message);
  } catch (error) {
    next(error);
  }
};

const findOneById = async (req, res, next) => {
  try {
    const messages = await messagesService.findOneById(req.params._id);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
};

const findAllByConversationId = async (req, res, next) => {
  try {
    const messages = await messagesService.findAllByConversationId(req.params.conversationId);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
};

const findAllByUserId = async (req, res, next) => {
  try {
    const messages = await messagesService.findAllByUserId(req.params.userId);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
};

const updateSeenAllMessageInOneConversation = async (req, res, next) => {
  try {
    const messages = await messagesService.updateSeenAllMessageInOneConversation({
      ...req.params,
      ...req.body
    });
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const messages = await messagesService.update(req.params._id, req.body);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
}


const uploadFile = async (req, res, next) => {
  try {
    const messages = await messagesService.uploadFile(req.params._id, req.files);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
}


const updateMessageFiles = async (req, res, next) => {
  try {
    const messages = await messagesService.updateMessageFiles(req.params._id, req.body.files);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
}



export const messagesController = {
  create,
  findOneById,
  findAllByConversationId,
  findAllByUserId,
  updateSeenAllMessageInOneConversation,
  uploadFile,
  updateMessageFiles,
  update
};
