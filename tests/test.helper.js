const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement',
    author: 'Dijkstra',
    url: 'http://example.com/go-to',
    likes: 5,
  },
  {
    title: 'Canonical String Reduction',
    author: 'Edsger',
    url: 'http://example.com/canonical',
    likes: 12,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb}