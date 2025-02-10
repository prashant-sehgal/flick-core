import { NextFunction, Request, Response } from 'express'

// A higher-order function to handle asynchronous errors in Express route handlers
export default function CatchAsync(
  fun: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<any> // The async function that needs error handling
) {
  return function (request: Request, response: Response, next: NextFunction) {
    // Calls the provided async function and ensures any errors are passed to Express error handling middleware
    fun(request, response, next).catch(next)
  }
}
