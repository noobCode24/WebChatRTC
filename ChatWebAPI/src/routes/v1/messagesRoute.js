import express from "express";
import { messagesController } from "~/controllers/messagesController";
import { multerUploadMiddleWare } from "~/middlewares/multerUploadMiddleware";
import { messagesValidation } from "~/validations/messagesValidation";

const Router = express.Router();

Router.route('/')
  .post(
    multerUploadMiddleWare.upload.array('fileChat', 10),
    messagesValidation.create,
    messagesController.create
  )

Router.route('/by-user/:userId')
  .get(messagesValidation.findAllByUserId, messagesController.findAllByUserId)

Router.route('/by-conversation/:conversationId')
  .get(messagesValidation.findAllByConversationId, messagesController.findAllByConversationId)

Router.route('/seen/:conversationId')
  .put(messagesValidation.updateSeenAllMessageInOneConversation, messagesController.updateSeenAllMessageInOneConversation)

Router.route('/:_id/uploadFile')
  .post(
    multerUploadMiddleWare.upload.array('fileChat', 10),
    messagesValidation.uploadFile,
    messagesController.uploadFile
  )

Router.route('/:_id/update-message-files')
  .put(messagesValidation.updateMessageFiles, messagesController.updateMessageFiles)

Router.route('/:_id')
  .get(messagesValidation.findOneById, messagesController.findOneById)
  .put(messagesValidation.update, messagesController.update)


export const messagesRoute = Router;
