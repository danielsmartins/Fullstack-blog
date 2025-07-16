const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// POST (ALTERADO: requer autenticação)
blogsRouter.post('/', async (req, res, next) => {
  const { title, author, url, likes } = req.body

  try {
   
    const user = req.user

    if (!user) {
      return res.status(401).json({ error: 'token inválido ou ausente' })
    }
    if (!title || !url) {
      return res.status(400).json({ error: 'título e url são obrigatórios' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes ?? 0,
      user: user.id, // 2. Associa o blog ao usuário autenticado
    })

    const savedBlog = await blog.save()

    // 3. Adiciona o blog na lista de blogs do usuário
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    // Popula o usuário para retornar na resposta
    await savedBlog.populate('user', { username: 1, name: 1 })
    res.status(201).json(savedBlog)

  } catch (error) {
    next(error)
  }
})

// DELETE 
blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    // 1. Pega o usuário autenticado
    const user = req.user

    if (!user) {
      return res.status(401).json({ error: 'token inválido ou ausente' })
    }

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'blog não encontrado' })
    }

    // 2. Verifica se o usuário autenticado é o criador do blog
    if (blog.user.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'operação não autorizada: você não é o criador deste blog' })
    }

    // 3. Procede com a exclusão
    await blog.remove()

    // Opcional: remove a referência do blog no documento do usuário
    user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)
    await user.save()

    res.status(204).end()

  } catch (error) {
    next(error)
  }
})


blogsRouter.put('/:id', async (req, res, next) => {
  const { likes } = req.body
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
      res.json(updatedBlog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter