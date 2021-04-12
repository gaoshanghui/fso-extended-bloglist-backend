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
  const userAuthenticated = request.user
  if (!token || !userAuthenticated.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(userAuthenticated.id)
  blog.user = user._id
  const savedBlog = await blog.save()
  
  // update author: update using 'save', because mongoose documents track changes, it will be converted into update operators. 
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()  

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const token = request.token
  const user = request.user
  if (!token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(blogId)
  if (!(blog.user.toString() === user.id)) {
    return response.status(401).json({ error: 'deleting a blog is possible only by the blog\'s creater' })
  }

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
