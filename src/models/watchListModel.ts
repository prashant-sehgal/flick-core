import mongoose, { Document } from 'mongoose'

interface WatchListObject extends Document {
  email: string
  movies: string[]
}

const watchListSchema = new mongoose.Schema<WatchListObject>({
  email: {
    type: String,
    required: [true, 'Favorites must have an email'], // Email is mandatory
    trim: true, // Removes leading and trailing spaces
    lowercase: true, // Converts to lowercase
    index: true, // Creates an index for faster queries
  },
  movies: {
    // collection of ObjectIds reference to the Movies Model
    type: [mongoose.Types.ObjectId],
    ref: 'Movie',
    default: [],
  },
})

const WatchList = mongoose.model<WatchListObject>('WatchList', watchListSchema)
export default WatchList
