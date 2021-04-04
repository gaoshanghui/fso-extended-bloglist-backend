const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const responsedBlogs = await Blog.find({})
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

  const savedBlog = await blog.save()
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
