jest.setTimeout(20000)

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // app sem .listen()
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test.helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test.only('api get test', async () => {
   const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
     expect(response.body).toHaveLength(helper.initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})