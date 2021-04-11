const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const responsedBlogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(responsedBlogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!request.body.hasOwnProperty('title') || !request.body.hasOwnProperty('url')) {
    return response.status(400).end()
  }

  if (!request.body.hasOwnProperty('likes')) {
    blog.likes = 0
  }

  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const userId = user._id
  blog.user = userId
  const savedBlog = await blog.save()
  
  // update author: update using 'save', because mongoose documents track changes, it will be converted into update operators. 
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()  

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newBlogData = {
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlogData, {new: true})
  response.json(updatedBlog)
})

module.exports = blogsRouter
