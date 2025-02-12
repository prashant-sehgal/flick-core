import { NextFunction, Request, Response } from 'express'
import CatchAsync from '../utils/CatchAsync'
import { mediaContainerClient } from '../lib/cloudProvider'
import AppError from '../utils/AppError'

export const getMediaStream = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!request.headers.range)
    return next(new AppError('Requires Range header', 400))

  // Get a block blob client
  const blockBlobClient = mediaContainerClient.getBlockBlobClient(
    request.params.media
  )

  // Retrieve blob properties to get the size
  const properties = await blockBlobClient.getProperties()
  const fileSize = properties.contentLength || 0

  const parts = request.headers.range.replace(/bytes=/, '').split('-')
  const start = parseInt(parts[0], 10)
  const end = Math.min(start + 1 * 1024 * 1024 - 1, fileSize - 1) // 1 MB chunk size
  const chunkSize = end - start + 1

  // Set response headers
  const head = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': properties.contentType,
  }

  response.writeHead(206, head)

  // Download the specified range of the blob
  const downloadBlockBlobResponse = await blockBlobClient.download(
    start,
    chunkSize
  )

  const stream = downloadBlockBlobResponse.readableStreamBody
  if (!stream) {
    return next(
      new AppError('Failed to get readable stream from Azure Blob', 500)
    )
  }

  // Download the specified range of the blob and pipe it to the response
  stream.pipe(response)
})
