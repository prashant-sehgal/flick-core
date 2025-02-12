import { Router } from 'express'
import * as movieController from '../controllers/movieController'
import * as authController from '../controllers/authController'

const router = Router()

// middleware to authenticate routes specified below it
router.use(authController.authenticate)

router.route('/').get(movieController.getAllMovies) // GET request to fetch all movies
router.route('/:id').get(movieController.getMovie) // GET request to fetch a movie by ID

// middleware to authorized routes specified below it
router.use(authController.authorized)

// Define routes for retrieving all movies and creating a new movie
router
  .route('/')
  .post(
    movieController.upload.fields(movieController.fields),
    movieController.uploadContent,
    movieController.createNewMovie
  ) // POST request to create a new movie

// Define routes for retrieving, updating, and deleting a single movie by ID
router
  .route('/:id')
  .patch(
    movieController.upload.fields(movieController.fields),
    movieController.uploadContent,
    movieController.updateMovie
  ) // PATCH request to update a movie by ID
  .delete(movieController.deleteMovie) // DELETE request to remove a movie by ID

export default router
