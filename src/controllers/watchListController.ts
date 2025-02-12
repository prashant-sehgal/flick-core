import * as baseController from '../utils/BaseController'
import WatchList from '../models/watchListModel'

// Controller to get all watchlists using the base controller's getAll function
export const getAllWatchLists = baseController.getAll(WatchList)

// Controller to create a new watchlist using the base controller's createOne function
export const createNewWatchList = baseController.createOne(WatchList)

// Controller to get a single watchlist by ID using the base controller's getOne function
export const getWatchList = baseController.getOne(WatchList)

// Controller to update an existing watchlist by ID using the base controller's updateOne function
export const updateWatchList = baseController.updateOne(WatchList)

// Controller to delete a watchlist by ID using the base controller's deleteOne function
export const deleteWatchList = baseController.deleteOne(WatchList)
