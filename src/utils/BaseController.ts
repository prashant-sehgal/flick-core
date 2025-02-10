import { NextFunction, Request, Response } from 'express'
import CatchAsync from './CatchAsync'
import { Model } from 'mongoose'
import AppError from './AppError'
import APIFeatures from './APIFeatures'

// Function to retrieve all documents from a given model
export const getAll = function (Model: Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const apiFeatures = new APIFeatures(Model.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const documents = await apiFeatures.query // Fetch all documents

    return response.status(200).json({
      status: 'success',
      results: documents.length, // Number of documents returned
      data: {
        documents,
      },
    })
  })
}

// Function to create a new document in the given model
export const createOne = function (Model: Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const document = await Model.create(request.body) // Create a new document

    return response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })
}

// Function to retrieve a single document by ID
export const getOne = function (Model: Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const document = await Model.findById(request.params.id) // Find document by ID

    if (!document) {
      return next(new AppError('No document found with that ID', 404)) // Handle case where document is not found
    }

    return response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })
}

// Function to update an existing document by ID
export const updateOne = function (Model: Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const document = await Model.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true } // Return updated document and validate fields
    )

    if (!document) {
      return next(new AppError('No document found with that ID', 404)) // Handle case where document is not found
    }

    return response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })
}

// Function to delete a document by ID
export const deleteOne = function (Model: Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const document = await Model.findByIdAndDelete(request.params.id) // Delete document by ID

    if (!document) {
      return next(new AppError('No document found with that ID', 404)) // Handle case where document is not found
    }

    return response.status(204).json({
      // 204 No Content indicates successful deletion
      status: 'success',
      data: null,
    })
  })
}
