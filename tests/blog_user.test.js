const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test.helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

jest.setTimeout(20000)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        // Esta mensagem vem do seu errorHandler
        expect(result.body.error).toContain('expected `username` to be unique')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'ab',
            name: 'Short User',
            password: 'salainen'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        // Esta mensagem vem do controller
        expect(result.body.error).toContain('username must be at least 3 characters long')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'shortpw',
            name: 'Foo Bar',
            password: '12'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        // Esta mensagem vem do controller
        expect(result.body.error).toContain('password must be at least 3 characters long')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode if username is not provided', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            name: 'No Username',
            password: 'salainen'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        // Esta mensagem vem do controller
        expect(result.body.error).toContain('username and password are required')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode if password is not provided', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'nopassword',
            name: 'No Password User'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        // Esta mensagem vem do controller
        expect(result.body.error).toContain('username and password are required')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
