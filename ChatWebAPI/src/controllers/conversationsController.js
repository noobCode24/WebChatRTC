import { StatusCodes } from "http-status-codes";
import { conversationsService } from "~/services/conversationsService";

const create = async (req, res, next) => {
  try {
    const conversation = await conversationsService.create(req.body);
    res.status(StatusCodes.CREATED).json(conversation);
  } catch (error) {
    next(error);
  }
};

const findOneById = async (req, res, next) => {
  try {
    const conversation = await conversationsService.findOneById(req.params._id);
    return res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    next(error);
  }
};

const findAllByUserId = async (req, res, next) => {
  try {
    const conversation = await conversationsService.findAllByUserId(req.params.userId);
    return res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    next(error);
  }
};

const findOneBetweenTwoUser = async (req, res, next) => {
  try {
    const userIds = [req.query.userId1, req.query.userId2]
    const conversation = await conversationsService.findOneBetweenTwoUser(userIds);
    return res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const conversationsController = {
  create,
  findOneById,
  findAllByUserId,
  findOneBetweenTwoUser
};
