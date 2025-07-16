const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

// A rota de criação de usuários
usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    // Validação 1: Checa se os campos existem
    if (!username || !password) {
      return response.status(400).json({
        error: 'username and password are required'
      })
    }

    // Validação 2: Checa o comprimento dos campos
    if (username.length < 3) {
      return response.status(400).json({
        error: 'username must be at least 3 characters long'
      })
    }

    if (password.length < 3) {
      return response.status(400).json({
        error: 'password must be at least 3 characters long'
      })
    }

    // Se as validações manuais passaram, prossiga para salvar
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (exception) {
    // Se user.save() falhar (ex: username duplicado), o erro é enviado para o errorHandler
    next(exception)
  }
})

// Rota para ver todos os usuários (útil para debug)
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter
