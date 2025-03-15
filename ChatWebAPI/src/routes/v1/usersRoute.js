import express from "express";
import { usersController } from "~/controllers/usersController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { usersValidation } from "~/validations/usersValidation";

const Router = express.Router();

Router.route('/register')
  .post(usersValidation.create, usersController.create)

Router.route('/login')
  .post(usersValidation.login, usersController.login)

Router.route('/logout')
  .delete(usersController.logout)

Router.route('/refresh_token')
  .put(usersController.refreshToken)

Router.route('/access')
  .get(authMiddleware.isAuthorized, usersController.access)

Router.route('/')
  .get(usersController.getAll)

Router.route('/:_id')
  .get(usersValidation.findOneById, usersController.findOneById)
  .put(usersValidation.update, usersController.update)


export const usersRoute = Router;
