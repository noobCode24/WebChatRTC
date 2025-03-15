import express from "express";
import { friendShipsController } from "~/controllers/friendShipsController";
import { friendShipsValidation } from "~/validations/friendShipsValidation";

const Router = express.Router();

Router.route('/')
  .post(friendShipsValidation.create, friendShipsController.create)

Router.route('/by-user/:userId')
  .get(friendShipsValidation.findOneByUserId, friendShipsController.findOneByUserId)


export const friendShipsRoute = Router;
