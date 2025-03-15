import express from "express";
import { friendRequestsController } from "~/controllers/friendRequestsController ";
import { friendRequestsValidation } from "~/validations/friendRequestValidation";

const Router = express.Router();

Router.route('/')
  .post(friendRequestsValidation.create, friendRequestsController.create)

Router.route('/by-user/:userId')
  .get(friendRequestsValidation.getAllByUserId, friendRequestsController.getAllByUserId)

Router.route('/by-receiver/:receiverId')
  .get(friendRequestsValidation.getAllByReceiverId, friendRequestsController.getAllByReceiverId)

Router.route('/:_id')
  .put(friendRequestsValidation.update, friendRequestsController.update)

export const friendRequestsRoute = Router;
