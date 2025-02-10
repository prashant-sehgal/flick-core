// Import required modules
import mongoose from 'mongoose' // MongoDB ODM for handling database connections
import dotenv from 'dotenv' // dotenv for loading environment variables

// Load environment variables from the .env file
dotenv.config({ path: `${__dirname}/../.env` })

import app from './app' // Import the configured Express app

// Handle uncaught exceptions (synchronous errors that aren't caught anywhere)
process.on('uncaughtException', function (error) {
  console.error('[ERROR] Uncaught Exception:', error)
  process.exit(1) // Exit the process to avoid undefined behavior
})

// Connect to MongoDB using the connection URI from the environment variables
mongoose
  .connect(process.env.MONGODB_CONNECTION_URI!)
  .then(function () {
    console.log('[INFO] Database connected successfully...')
  })
  .catch(function (error) {
    console.error('[ERROR] Database connection failed:', error)
    process.exit(1) // Exit the process if the database connection fails
  })

// Start the server and listen on the specified port
const server = app.listen(process.env.PORT, function () {
  console.log(`[INFO] Server is running on port ${process.env.PORT}`)
})

// Handle unhandled promise rejections (e.g., failed async operations)
process.on('unhandledRejection', function (reason) {
  console.error('[ERROR] Unhandled Rejection:', reason)
  server.close(() => {
    process.exit(1) // Gracefully shut down the server before exiting
  })
})
