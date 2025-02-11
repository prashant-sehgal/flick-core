// Importing the Azure BlobServiceClient to interact with Azure Blob Storage
import { BlobServiceClient } from '@azure/storage-blob'

// Creating an instance of BlobServiceClient using the connection string from environment variables
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING! // Ensure the connection string is set in environment variables
)

// Creating a client to interact with the 'media' container in Azure Blob Storage
export const mediaContainerClient =
  blobServiceClient.getContainerClient('media')

// Creating a client to interact with the 'assets' container in Azure Blob Storage
export const assetsContainerClient =
  blobServiceClient.getContainerClient('assets')
