import { Router } from 'express'
import * as watchListController from '../controllers/watchListController'

const router = Router()

// Define routes for retrieving all watchlists and creating a new watchlist
router
  .route('/')
  .get(watchListController.getAllWatchLists) // GET request to fetch all watchlists
  .post(watchListController.createNewWatchList) // POST request to create a new watchlist

// Define routes for retrieving, updating, and deleting a single watchlist by ID
router
  .route('/:id')
  .get(watchListController.getWatchList) // GET request to fetch a watchlist by ID
  .patch(watchListController.updateWatchList) // PATCH request to update a watchlist by ID
  .delete(watchListController.deleteWatchList) // DELETE request to remove a watchlist by ID

export default router
