const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogPosts) => {
  return blogPosts.reduce((result, item) => {
    result = result + item.likes
    return result
  }, 0)
}

const favoriteBlog = (blogs) => {
  let index = 0;
  let maxValue = 0;

  blogs
    .map((blog) => blog.likes)
    .forEach((currentValue, currentIndex) => {
      if (currentValue > maxValue) {
        index = currentIndex
        maxValue = currentValue
      }
    })
  
  return blogs[index]
}

const mostBlogs = (blogs) => {
  const authorsObj = _.countBy(blogs, 'author')
  
  let maxValue = 0
  let authorName = ''
  const mostBlog = _.forEach(authorsObj, (value, key) => {
    if (value > maxValue) {
      authorName = key
      maxValue = value
    }
  })

  return {
    author: authorName,
    blogs: maxValue
  }
}

// Sample datas
const listWithOneBlog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const mostLikes = (blogs) => {
  // create a authors object.
  const authorLikesArr = {};
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i]['author'] in authorLikesArr) {
      authorLikesArr[blogs[i]['author']]['likes'] += blogs[i]['likes']
    } else {
      authorLikesArr[blogs[i]['author']] = {
        likes: blogs[i]['likes']
      }
    }
  }

  // find most likes in the authors object.
  let currentMaxLikes = 0;
  let currentAuthor = '';
  _.forEach(authorLikesArr, (value, key) => {
    if (value.likes > currentMaxLikes) {
      currentMaxLikes = value.likes
      currentAuthor = key
    }
  })

  return {author: currentAuthor, likes: currentMaxLikes}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
