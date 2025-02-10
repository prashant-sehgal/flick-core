import { Router } from 'express'
import * as movieController from '../controllers/movieController'

const router = Router()

// Define routes for retrieving all movies and creating a new movie
router
  .route('/')
  .get(movieController.getAllMovies) // GET request to fetch all movies
  .post(movieController.createNewMovie) // POST request to create a new movie

// Define routes for retrieving, updating, and deleting a single movie by ID
router
  .route('/:id')
  .get(movieController.getMovie) // GET request to fetch a movie by ID
  .patch(movieController.updateMovie) // PATCH request to update a movie by ID
  .delete(movieController.deleteMovie) // DELETE request to remove a movie by ID

export default router
