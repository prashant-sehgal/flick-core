import { NextFunction, Request, Response } from 'express'

// Global error handling middleware for handling application-wide errors
export default function GlobalErrorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Set the status code based on the error object, defaulting to 500 for server errors
  const statusCode = error.statusCode || 500
  // Determine the error status message (fail for client errors, error for server errors)
  const status = error.status || 'error'

  // Send a JSON response with error details
  response.status(statusCode).json({
    status, // Status of the error response
    message: error.message, // Error message for debugging and user feedback
    name: process.env.NODE_ENV === 'development' ? error.name : undefined, // Include error name in development mode
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Include stack trace in development mode
  })
}
