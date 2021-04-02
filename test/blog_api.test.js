const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('Blogs are returned as json', () => {
  api
    .get('/')
    .expect(200)
})