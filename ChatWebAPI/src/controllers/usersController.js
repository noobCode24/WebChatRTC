import { StatusCodes } from "http-status-codes";
import { usersService } from "~/services/usersService";
import { JWTProvider } from "~/providers/jwtProvider";
import { env } from "~/config/environment";
import ms from 'ms'
import { usersModel } from "~/models/usersModel";
import { comparePassword } from "~/utils/algorithms";

const create = async (req, res) => {
  try {
    console.log('🚀 ~ create ~ req.body:', req.body)
    const users = await usersService.create(req.body);
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}

const login = async (req, res) => {
  try {
    const resLogin = await usersModel.findOneByEmail(req.body?.email)
    if (!resLogin) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Your email incorrect!' })
    }
    const password = req.body.password
    const hashedPassword = resLogin.password
    const resComparePassword = await comparePassword(password, hashedPassword)
    if (!resComparePassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Your password incorrect!' })
    }
    const userInfo = {
      _id: resLogin._id,
      username: resLogin.username,
      email: resLogin.email,
      name: resLogin.name,
      status: resLogin.status,
    }
    const accessToken = await JWTProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )
    const refreshToken = await JWTProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    await usersModel.update(userInfo._id, { status: "online" })

    return res.status(StatusCodes.OK).json({
      ...userInfo,
      status: "online",
      accessToken,
      refreshToken
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return res.status(StatusCodes.OK).json({ message: 'Logout success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies?.refreshToken

    const refreshTokenDecoded = await JWTProvider.verifyToken(
      refreshTokenFromCookie,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      _id: refreshTokenDecoded._id,
      displayName: refreshTokenDecoded.displayName,
      email: refreshTokenDecoded.email,
      avatar: refreshTokenDecoded.avatar
    }

    const accessToken = await JWTProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    return res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Refresh token failed')
  }
}

const access = async (req, res) => {
  try {
    const userInfo = {
      _id: req.jwtDecoded._id,
      displayName: req.jwtDecoded.displayName,
      email: req.jwtDecoded.email,
      avatar: req.jwtDecoded.avatar
    }
    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const getAll = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    throw error;
  }
}

const findOneById = async (req, res) => {
  try {
    const users = await usersModel.findOneById(req.params._id);
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    throw error;
  }
}

const update = async (req, res) => {
  try {
    const users = await usersService.update(req.params._id, req.body);
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    throw error;
  }
}

export const usersController = {
  create,
  login,
  logout,
  refreshToken,
  access,
  getAll,
  findOneById,
  update
};
