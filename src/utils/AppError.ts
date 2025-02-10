export default class AppError extends Error {
  public status: string // Indicates whether the error is a 'fail' (4xx) or 'error' (5xx)
  public isOperational: boolean // Identifies if the error is expected (operational) or unexpected

  constructor(message: string, statusCode: number) {
    super(message) // Calls the parent Error constructor with the provided message

    // Determines the error type based on the status code
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error'

    // Marks the error as operational, meaning it was anticipated and can be handled gracefully
    this.isOperational = true
  }
}
