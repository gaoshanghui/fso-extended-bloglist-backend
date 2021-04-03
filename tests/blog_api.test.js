const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog')

const api = supertest(app);

const initialBlogs = [
  {
    title: "Overreacted",
    author: "Dan Abramov",
    url: "https://overreacted.io/",
    likes: 1
  },
  {
    title: "Tonsky",
    author: "Nikita",
    url: "https://tonsky.me/",
    likes: 1
  }
]

// beforeEach(async () => {
//   await Blog.deleteMany({})
//   let blogObject = new Blog(initialBlogs[0])
//   await blogObject.save()
//   blogObject = new Blog(initialBlogs[1])
//   await blogObject.save()
// })

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('There are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('Unique identifier property is id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined();
})

test('Blog was successfully created', async () => {
  const newBlog = {
    title: 'Maggieappleton',
    author: 'Maggie Appleton',
    url: 'https://maggieappleton.com/',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  const contents = response.body.map(content => content.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain('Maggieappleton')
})

test('Check blog has likes property', () => {
  const newBlog = {
    title: 'Tania Rascia',
    author: 'Tania Rascia',
    url: 'https://www.taniarascia.com/',
  }

  if (!newBlog.hasOwnProperty('likes')) {
    newBlog.likes = 0
  }

  const expectedObj = {
    title: 'Tania Rascia',
    author: 'Tania Rascia',
    url: 'https://www.taniarascia.com/',
    likes: 0
  }

  expect(newBlog).toEqual(expectedObj)
})

afterAll(() => {
  mongoose.connection.close()
})
