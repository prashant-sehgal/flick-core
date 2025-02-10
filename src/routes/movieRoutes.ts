import { Router } from 'express'
import multer from 'multer'
import * as movieController from '../controllers/movieController'
import * as azureStorage from '../lib/azureStorage'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() }) // multer temprary memory storage
const fields: multer.Field[] = [
  { name: 'card', maxCount: 1 }, // Allows only 1 file for the 'card' field
  { name: 'poster', maxCount: 1 }, // Allows only 1 file for the 'poster' field
  { name: 'media', maxCount: 1 }, // Allows only 1 file for the 'media' field
]

// Define routes for retrieving all movies and creating a new movie
router
  .route('/')
  .get(movieController.getAllMovies) // GET request to fetch all movies
  .post(
    upload.fields(fields),
    azureStorage.uploadCard,
    azureStorage.uploadPoster,
    azureStorage.uploadMedia,
    movieController.createNewMovie
  ) // POST request to create a new movie

// Define routes for retrieving, updating, and deleting a single movie by ID
router
  .route('/:id')
  .get(movieController.getMovie) // GET request to fetch a movie by ID
  .patch(
    upload.fields(fields),
    azureStorage.uploadCard,
    azureStorage.uploadPoster,
    azureStorage.uploadMedia,
    movieController.updateMovie
  ) // PATCH request to update a movie by ID
  .delete(movieController.deleteMovie) // DELETE request to remove a movie by ID

export default router
