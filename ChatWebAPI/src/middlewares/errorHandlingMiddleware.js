/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {

  // Nếu thiếu statusCode => mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: err.statusCode,
    // Nếu lỗi mà không có message thì lấy ReasonPhrases
    // chuẩn theo mã Status Code
    message: err.message || StatusCodes[err.statusCode], 
    stack: err.stack
  }
  // console.error(responseError)

  // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, 
  // còn không thì xóa đi.
  // console.log(env.BUILD_MODE)
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file,
  // bắn thông báo lỗi vào group Slack, Telegram, Email...vv
  // Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.

  // console.error(responseError)

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError)
}