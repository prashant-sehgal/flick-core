// Import necessary modules and types
import { BlobServiceClient } from '@azure/storage-blob' // Azure Blob Storage client
import { NextFunction, Request, Response } from 'express' // Express types
import sharp from 'sharp' // Image processing library
import CatchAsync from '../utils/CatchAsync' // Utility for handling async errors

// Define a type for the expected structure of uploaded files
type Files = {
  card: Express.Multer.File[] | undefined // Array of 'card' files or undefined
  poster: Express.Multer.File[] | undefined // Array of 'poster' files or undefined
  media: Express.Multer.File[] | undefined // Array of 'media' files or undefined
}

// Initialize the BlobServiceClient using the connection string from environment variables
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING!
)

// Middleware to handle 'card' image upload
export const uploadCard = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const files = request.files as Files // Cast uploaded files to the defined Files type
  if (!files || !files.card) return next() // If no 'card' file is uploaded, proceed to the next middleware

  const card = files.card[0] // Get the first 'card' file

  // Process the image using sharp: resize and convert to WebP format
  const buffer = await sharp(card.buffer)
    .resize(382, 566, { fit: sharp.fit.cover }) // Resize to 382x566 pixels
    .webp({ quality: 80 }) // Convert to WebP with 80% quality
    .toBuffer()

  // Generate a unique blob name for the 'card' image
  const blobName = `card-${Math.round(
    Math.random() * 1_000_000
  )}-${Date.now()}.webp`

  // Get a reference to the 'assets' container and the specific blob
  const containerClient = blobServiceClient.getContainerClient('assets')
  const blockBlobClient = containerClient.getBlockBlobClient(
    `cards/${blobName}`
  )

  // Upload the processed image to Azure Blob Storage
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'image/webp' }, // Set the MIME type to 'image/webp'
  })

  request.body.card = blobName // Attach the blob name to the request body for further processing
  next() // Proceed to the next middleware
})

// Middleware to handle 'poster' image upload
export const uploadPoster = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const files = request.files as Files // Cast uploaded files to the defined Files type
  if (!files || !files.poster) return next() // If no 'poster' file is uploaded, proceed to the next middleware

  const poster = files.poster[0] // Get the first 'poster' file

  // Process the image using sharp: resize and convert to WebP format
  const buffer = await sharp(poster.buffer)
    .resize(1920, 1080, { fit: sharp.fit.cover }) // Resize to 1920x1080 pixels
    .webp({ quality: 80 }) // Convert to WebP with 80% quality
    .toBuffer()

  // Generate a unique blob name for the 'poster' image
  const blobName = `poster-${Math.round(
    Math.random() * 1_000_000
  )}-${Date.now()}.webp`

  // Get a reference to the 'assets' container and the specific blob
  const containerClient = blobServiceClient.getContainerClient('assets')
  const blockBlobClient = containerClient.getBlockBlobClient(
    `posters/${blobName}`
  )

  // Upload the processed image to Azure Blob Storage
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'image/webp' }, // Set the MIME type to 'image/webp'
  })

  request.body.poster = blobName // Attach the blob name to the request body for further processing
  next() // Proceed to the next middleware
})

// Middleware to handle 'media' file upload
export const uploadMedia = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const files = request.files as Files // Cast uploaded files to the defined Files type
  if (!files || !files.media) return next() // If no 'media' file is uploaded, proceed to the next middleware

  const media = files.media[0] // Get the first 'media' file

  // Generate a unique blob name for the 'media' file
  const blobName = `media-${Math.round(
    Math.random() * 1_000_000
  )}-${Date.now()}.mp4`

  // Get a reference to the 'assets' container and the specific blob
  const containerClient = blobServiceClient.getContainerClient('assets')
  const blockBlobClient = containerClient.getBlockBlobClient(
    `media/${blobName}`
  )

  // Upload the media file to Azure Blob Storage
  await blockBlobClient.uploadData(media.buffer, {
    blobHTTPHeaders: { blobContentType: 'video/mp4' }, // Set the MIME type to 'video/mp4'
  })

  request.body.media = blobName // Attach the blob name to the request body for further processing
  next() // Proceed to the next middleware
})
