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

describe('API tests', () => {

  test('api get test', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('verify id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
      expect(blog.id).toBeDefined
    })
  })

  test('verify post', async () => {
    const blogBefore = await helper.blogsInDb()

    const newBlog = {
      title: 'Testando POST',
      author: 'Daniel',
      url: 'http://testepost.com',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfter = await helper.blogsInDb()

    expect(blogAfter).toHaveLength(blogBefore.length + 1)

    const titulos = blogAfter.map(b => b.title)
    expect(titulos).toContain('Testando POST')
  })
  test('default likes = 0', async () => {
    const novoBlog = {
      title: 'Sem likes',
      author: 'Anônimo',
      url: 'http://sem.likes.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(novoBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('verify missing title', async () => {
    const novoBlog = {
      author: 'Anônimo',
      url: 'http://faltou-title.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(novoBlog)
      .expect(400)
  })

  test('verify missing url', async () => {
    const novoBlog = {
      author: 'Anônimo',
      title: 'Faltando URL',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(novoBlog)
      .expect(400)
  })

  test('verify delete functionality', async () => {

    const novoBlog = {
      title: 'Blog a ser deletado',
      author: 'Deletador',
      url: 'http://delete.com',
      likes: 1
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(novoBlog)
      .expect(201)

    const idParaDeletar = postResponse.body.id

    const blogsAntes = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${idParaDeletar}`)
      .expect(204)

    const blogsDepois = await helper.blogsInDb()
    expect(blogsDepois).toHaveLength(blogsAntes.length - 1)

    const ids = blogsDepois.map(b => b.id)
    expect(ids).not.toContain(idParaDeletar)
  })
})

test('verify update functionality', async () => {
  const blogsAtuais = await helper.blogsInDb()
  const blogParaAtualizar = blogsAtuais[0]

  const novoLikes = blogParaAtualizar.likes + 10

  const response = await api
    .put(`/api/blogs/${blogParaAtualizar.id}`)
    .send({ likes: novoLikes })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(novoLikes)
})


afterAll(async () => {
  await mongoose.connection.close()
})