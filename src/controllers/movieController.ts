import { NextFunction, Request, Response } from 'express'
import * as baseContoller from '../utils/BaseController'
import Movie from '../models/movieModel'

// Controller to get all movies using the base controller's getAll function
export const getAllMovies = baseContoller.getAll(Movie)

// Controller to create a new movie using the base controller's createOne function
export const createNewMovie = baseContoller.createOne(Movie)

// Controller to get a single movie by ID using the base controller's getOne function
export const getMovie = baseContoller.getOne(Movie)

// Controller to update an existing movie by ID using the base controller's updateOne function
export const updateMovie = baseContoller.updateOne(Movie)

// Controller to delete a movie by ID using the base controller's deleteOne function
export const deleteMovie = baseContoller.deleteOne(Movie)
