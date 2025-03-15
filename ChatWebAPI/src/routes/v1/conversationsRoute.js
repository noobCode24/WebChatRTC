import express from "express";
import { conversationsController } from "~/controllers/conversationsController";
import { conversationsValidation } from "~/validations/converationsValidation";

const Router = express.Router();

Router.route('/')
  .post(conversationsValidation.create, conversationsController.create)

Router.route('/between-two-users')
  .get(conversationsValidation.findOneBetweenTwoUser, conversationsController.findOneBetweenTwoUser)

Router.route('/by-user/:userId')
  .get(conversationsValidation.findAllByUserId, conversationsController.findAllByUserId)

Router.route('/:_id')
  .get(conversationsValidation.findOneById, conversationsController.findOneById)

export const conversationsRoute = Router;
