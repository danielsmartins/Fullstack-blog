const mongoose = require('mongoose')

// Schema e Model
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  url: String,
  likes: {
    type: Number,
    default: 0
  },
   user:   {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
