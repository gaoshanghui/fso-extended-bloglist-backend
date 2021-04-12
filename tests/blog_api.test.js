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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

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

  const res = await api.post('/api/login')
    .send({
      username: 'gaoshanghui', 
      password: 'testpassword'
    })
  const token = res.body.token
  
  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  const contents = response.body.map(content => content.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain('Maggieappleton')
})

test('Check blog has likes property', async () => {
  const newBlog = {
    title: 'Tania Rascia',
    author: 'Tania Rascia',
    url: 'https://www.taniarascia.com/',
  }

  const expectedObj = {
    title: 'Tania Rascia',
    author: 'Tania Rascia',
    url: 'https://www.taniarascia.com/',
    likes: 0,
    user: {
      id: "607402e0acf98f17207e7108",
      name: "Gao Shanghui",
      username: "gaoshanghui",
    },
  }

  const res = await api.post('/api/login')
    .send({
      username: 'gaoshanghui', 
      password: 'testpassword'
    })
  const token = res.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const testContent = response.body[2]
  delete testContent.id
  
  expect(testContent).toEqual(expectedObj)
})

test('Blog can not be added without token', async () => {
  const newBlog = {
    title: 'Tania Rascia',
    author: 'Tania Rascia',
    url: 'https://www.taniarascia.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('Check blog has title and url properties', async () => {
  const newBlog = {
    title: 'Tania Rascia',
    author: 'Tania Rascia',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})