const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((acc, postObject) => acc + (postObject.likes), 0)
    return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((prev, curr) => {
    return (curr.likes > prev.likes) ? curr : prev
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxCount = 0

  for (const author in counts) {
    if (counts[author] > maxCount) {
      maxAuthor = author
      maxCount = counts[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likeCount = {}

  blogs.forEach(blog => {
    likeCount[blog.author] = (likeCount[blog.author] || 0) + blog.likes
  })

  let topAuthor = null
  let maxLikes = 0

  for (const author in likeCount) {
    if (likeCount[author] > maxLikes) {
      topAuthor = author
      maxLikes = likeCount[author]
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
} 
