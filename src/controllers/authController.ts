import { NextFunction, Request, Response } from 'express'
import CatchAsync from '../utils/CatchAsync'
import AppError from '../utils/AppError'

export const authenticate = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!request.headers.authorization)
    return next(new AppError('Please provide authorization token', 401))

  const [format, appId, userEmail] = request.headers.authorization
    .toString()
    .split(' ')

  if (
    format !== 'Bearer' ||
    appId !== process.env.ORIGIN_CLIENT_APP_ID ||
    !userEmail
  )
    return next(
      new AppError('Please provide correct credentials in auth token', 401)
    )

  next()
})

export const authorized = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const [, , userEmail] = request.headers.authorization!.split(' ')

  if (userEmail !== process.env.ADMIN_USER)
    return next(
      new AppError('You are not authorized to access these routes', 401)
    )

  next()
})
