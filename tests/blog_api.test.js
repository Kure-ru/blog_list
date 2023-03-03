const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')




// describe('blogs are saved properly', () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({})
//     await Blog.insertMany(helper.initialBlogs)
//   })

//   test('all the blogs are returned', async () => {
//     const response = await api
//       .get('/api/blogs')
//       expect(response.body).toHaveLength(helper.initialBlogs.length)
//   }) 
  
//   test('identifier property of the blog poses is named id', async () => {
//     const response = await api.get('/api/blogs')
//     expect(response.body[0].id).toBeDefined()
//     })
// })

// describe('addition of a new blog', () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({})
//     await Blog.insertMany(helper.initialBlogs)
//   })

//   test('successfully create a new blog post', async () => {
    
//     const newBlog = {
//       title: "CSS for beginners",
//       author: "John Doe",
//       url: "http://learnCSS.html",
//        likes: 24
//       } 
    
//     await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)
    
//     const blogsAtEnd = await helper.blogsInDb()
//     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
//     })
    
//     test('a blog without likes count will have 0 likes', async () => {
//       const newBlog = {
//         title: "My journey into Fullstack development",
//         author: "Kostis Suzana",
//         url: "http://becomeadevelopper.html",
//         } 
      
//         const response = await api
//         .post('/api/blogs')
//         .send(newBlog)
    
//         expect(response.body.likes).toEqual(0)
//     })
    
    
//     test('blogs without title or url are not added', async () => {
//       const newBlog = {
//         author: "Valarie İlkay",
//         likes: 2
//         } 
      
//         await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(400)
    
//         const blogsAtEnd = await helper.blogsInDb()
    
//         expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
//     })
// })

// describe('blogs deletion', () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({})
//     await Blog.insertMany(helper.initialBlogs)
//   })

//   test('status code 204 if blog deleted', async () => {
//     const blogsAtStart = await helper.blogsInDb()
//     const blogToDelete = blogsAtStart[0]

//     await api
//     .delete(`/api/blogs/${blogToDelete.id}`)
//     .expect(204)

//     const blogsAtEnd = await helper.blogsInDb()

//     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
// })
// })

// describe('blogs modification', () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({})
//     await Blog.insertMany(helper.initialBlogs)
//   })

//   test('successfully updates blog', async () => {
//     const blogsAtStart = await helper.blogsInDb()
//     console.log(blogsAtStart)
//     const blogToUpdate = blogsAtStart[0]

//     await api
//     .put(`/api/blogs/${blogToUpdate.id}`)
//     .expect(204)
// })
// })

describe('when there is initially one user in DB', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username : 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'DominoPizza',
      name: 'Bobby Bob',
      password: 'love2eat'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  }) 

    test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})


afterAll(() => {
  mongoose.connection.close()
})