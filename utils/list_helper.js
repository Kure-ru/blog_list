const _ = require('lodash');

const dummy = (blogs) => {
        return 1
  }
  
const totalLikes = (blogs) => {
let num = 0;
Object.values(blogs).forEach(blog => {
  num += blog.likes
})
return num
}

const favoriteBlog = (blogs) => {
let likes = blogs.map(blog => blog.likes)
let index = likes.indexOf(Math.max(...likes))
return { title: blogs[index].title,
author: blogs[index].author,
likes: blogs[index].likes
}
}

const mostBlogs = (blogs) => {
  
const max = _.maxBy(blogs, 'author')

// return author + publication num
return { author: max.author,}
  }

  const mostLikes = (blogs) => {

    const max = _.maxBy(blogs, 'likes')
    // return author + likes number
    return {
       author: max.author,
    }
      }


  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }