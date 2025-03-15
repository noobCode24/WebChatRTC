import express from "express";
import { StatusCodes } from "http-status-codes";
import { usersRoute } from "./usersRoute";
import { friendRequestsRoute } from "./friendRequestsRoute";
import { conversationsRoute } from "./conversationsRoute";
import { messagesRoute } from "./messagesRoute";
import { friendShipsRoute } from "./friendShipsRoute";

const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs v1 are ready to use" });
});

Router.use('/users', usersRoute)
Router.use('/friendships', friendShipsRoute)
Router.use('/friend-requests', friendRequestsRoute)
Router.use('/conversations', conversationsRoute)
Router.use('/messages', messagesRoute)


export const APIs_V1 = Router;
