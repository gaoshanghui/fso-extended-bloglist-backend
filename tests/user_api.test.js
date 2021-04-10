const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app)


describe('when there is initially one user in database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordhash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'gaoshanghui', 
      name: 'Gao Shanghui',
      passwordHash: passwordhash
    })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'gaoshanghui', 
      name: 'Gao',
      password: 'testpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)  
  })
})


afterAll(() => {
  mongoose.connection.close()
})