import { NextFunction } from 'express'
import mongoose, { Document } from 'mongoose'

// Define an interface for the Movie document, extending Mongoose's Document
export interface MovieObject extends Document {
  title: string
  description: string
  genres: string[]
  duration: number
  imdbRating: number
  releasedYear: number
  card: string
  poster: string
  media: string
  createdAt: Date
  updatedAt: Date
}

// Define the movie schema with validation rules
const movieSchema = new mongoose.Schema<MovieObject>(
  {
    title: {
      type: String,
      required: [true, 'Movie must have a title'], // Title is mandatory
      trim: true, // Removes leading and trailing spaces
      lowercase: true, // Converts to lowercase
      index: true, // Creates an index for faster queries
    },
    description: {
      type: String,
      required: [true, 'Movie must have a description'], // Description is mandatory
      trim: true,
      lowercase: true,
    },
    genres: {
      type: [String], // Array of genre strings
      required: [true, 'Movie must have genres'], // At least one genre is required
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string[]) => v.length > 0, // Ensures array is not empty
        message: 'At least one genre is required',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Movie must have a duration'], // Duration is mandatory
      trim: true,
      lowercase: true,
    },
    imdbRating: {
      type: Number,
      required: [true, 'Movie must have an IMDB rating'], // IMDB rating is mandatory
      min: [0, 'IMDB rating cannot be less than 0'], // Minimum value constraint
      max: [10, 'IMDB rating cannot be more than 10'], // Maximum value constraint
    },
    releasedYear: {
      type: Number,
      required: [true, 'Movie must have a release year'], // Release date is mandatory
    },
    card: {
      type: String,
      required: [true, 'Movie must have a card'], // Card image is mandatory
    },
    poster: {
      type: String,
      required: [true, 'Movie must have a poster'], // Poster image is mandatory
    },
    media: {
      type: String,
      required: [true, 'Movie must have media'], // Media file is mandatory
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

movieSchema.virtual('cardUrl').get(function (this: MovieObject) {
  return `${process.env.AZURE_STORAGE_ASSETS_READ_URL}`.replace(
    '<blobName>',
    `cards/${this.card}`
  )
})

movieSchema.virtual('posterUrl').get(function (this: MovieObject) {
  return `${process.env.AZURE_STORAGE_ASSETS_READ_URL}`.replace(
    '<blobName>',
    `posters/${this.poster}`
  )
})

// Pre-save middleware to convert all genres to lowercase before saving the movie document
movieSchema.pre('save', function (this) {
  this.genres = this.genres.map((genre) => genre.toLowerCase())
})

// Pre-save middleware to convert all genres to lowercase before saving the movie document
movieSchema.pre('findOneAndUpdate', function (this) {
  const updates: any = this.getUpdate()

  if (updates.genres)
    updates.genres = updates.genres.map((genre: string) => genre.toLowerCase())
})

// Create and export the Movie model based on the schema
const Movie = mongoose.model<MovieObject>('Movie', movieSchema)

export default Movie
