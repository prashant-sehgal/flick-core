import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import Movie from '../models/movieModel'
import * as baseContoller from '../utils/BaseController'
import CatchAsync from '../utils/CatchAsync'
import sharp from 'sharp'
import {
  assetsContainerClient,
  mediaContainerClient,
} from '../lib/cloudProvider'

type RequestFiles = {
  card: Express.Multer.File[] | undefined
  poster: Express.Multer.File[] | undefined
  media: Express.Multer.File[] | undefined
}

export const upload = multer({ storage: multer.memoryStorage() }) // multer temprary memory storage
export const fields: multer.Field[] = [
  { name: 'card', maxCount: 1 }, // Allows only 1 file for the 'card' field
  { name: 'poster', maxCount: 1 }, // Allows only 1 file for the 'poster' field
  { name: 'media', maxCount: 1 }, // Allows only 1 file for the 'media' field
]

// upload field content such as card, poster and media on azure
export const uploadContent = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const files = request.files as RequestFiles
  if (!files || Object.keys(files).length === 0) return next()

  if (files.card) {
    const buffer = await sharp(files.card[0].buffer)
      .resize(382, 566, { fit: sharp.fit.cover }) // Resize to 382x566 pixels
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toBuffer()

    const blobName = `card-${Math.round(
      Math.random() * 1_000_000
    )}-${Date.now()}.webp`

    const blockBlobClient = assetsContainerClient.getBlockBlobClient(
      `cards/${blobName}`
    )

    // Upload the processed image to Azure Blob Storage
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'image/webp' }, // Set the MIME type to 'image/webp'
    })

    request.body.card = blobName
  }

  if (files.poster) {
    const buffer = await sharp(files.poster[0].buffer)
      .resize(1920, 1080, { fit: sharp.fit.cover }) // Resize to 382x566 pixels
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toBuffer()

    const blobName = `poster-${Math.round(
      Math.random() * 1_000_000
    )}-${Date.now()}.webp`

    const blockBlobClient = assetsContainerClient.getBlockBlobClient(
      `posters/${blobName}`
    )

    // Upload the processed image to Azure Blob Storage
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'image/webp' }, // Set the MIME type to 'image/webp'
    })

    request.body.poster = blobName
  }

  if (files.media) {
    const blobName = `media-${Math.round(
      Math.random() * 1_000_000
    )}-${Date.now()}.mp4`

    const blockBlobClient = mediaContainerClient.getBlockBlobClient(blobName)

    // Upload media to Azure Blob Storage
    await blockBlobClient.uploadData(files.media[0].buffer, {
      blobHTTPHeaders: { blobContentType: 'video/mp4' }, // Set the MIME type to 'video/mp4'
    })

    request.body.media = blobName
  }

  next()
})

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
