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

  // setting the first user found in database as this blog's creator
  const users = await User.find({})
  const userId = users[0]._id
  blog.user = userId
  // save blog
  const savedBlog = await blog.save()
  
  // update author: update using 'save', because mongoose documents track changes, it will be converted into update operators. 
  users[0].blogs = users[0].blogs.concat(savedBlog._id)
  await users[0].save()  

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
