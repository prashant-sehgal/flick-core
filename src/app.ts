// Import required modules
import express from 'express' // Express framework for handling server routes
import cors from 'cors' // CORS middleware to handle cross-origin requests
import morgan from 'morgan' // Morgan middleware for logging HTTP requests

import GlobalErrorHandler from './utils/GlobalErrorHandler' //  global error handling middleware to manage application-wide errors

// Import route handlers for different resources
import movieRouter from './routes/movieRoutes'
import streamRouter from './routes/streamRoutes'
import watchListRouter from './routes/watchListRoutes'

const app = express() // Initialize Express application

// Enable CORS with specific configurations
app.use(
  cors({
    origin: process.env.ORIGIN_CLIENT, // Allow only this origin to access resources
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies and authorization headers in requests
  })
)

// Middleware to parse incoming JSON requests
app.use(express.json())

// Middleware to parse URL-encoded data (for form submissions, etc.)
app.use(express.urlencoded({ extended: true }))

// Enable HTTP request logging only in non-production environments
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// Middleware to mount various route handlers for different API resources
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/streams', streamRouter)
app.use('/api/v1/watchList', watchListRouter)

// Global error handling middleware to manage application-wide errors
app.use(GlobalErrorHandler)

export default app // Export the configured app for use in other files
