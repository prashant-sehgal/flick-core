import { Query } from 'mongoose'

// Define a type for query parameters that may be used in API requests
// This includes sorting, field selection, pagination, and filtering options
type QueryObject = {
  sort?: string
  fields?: string
  page?: string
  limit?: string
}

// Class to handle advanced query features such as filtering, sorting, field limiting, and pagination
export default class APIFeatures {
  constructor(
    public query: Query<any[], any, {}, any, 'find', {}>, // Mongoose query object
    public queryObject: QueryObject // Object containing query parameters
  ) {}

  // Method to filter query results based on request parameters
  filter() {
    const queryObjectCopy: any = { ...this.queryObject }

    // Remove special fields that are not part of filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((field) => delete queryObjectCopy[field])

    // Convert filtering operators (gte, gt, lte, lt) into MongoDB format
    const filterObject = JSON.parse(
      JSON.stringify(queryObjectCopy).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    )

    this.query.find(filterObject) // Apply filtering criteria to the query
    return this
  }

  // Method to sort query results based on request parameters
  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.toString().split(',').join(' ')
      this.query.sort(sortBy)
    } else {
      this.query.sort('-createdAt') // Default sorting by newest entries
    }

    return this
  }

  // Method to limit the fields returned in query results
  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.toString().split(',').join(' ')
      this.query.select(fields)
    } else {
      this.query.select('-__v') // Exclude the internal MongoDB version field by default
    }
    return this
  }

  // Method to implement pagination by skipping and limiting results
  paginate() {
    const page = Number(this.queryObject.page) || 1
    const limit = Number(this.queryObject.limit) || 50
    const skip = (page - 1) * limit

    this.query.skip(skip).limit(limit)
    return this
  }
}
