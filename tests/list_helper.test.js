const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
    {
      _id: "1",
      title: "Post 1",
      author: "Author 1",
      url: "http://example.com/1",
      likes: 3,
      __v: 0
    },
    {
      _id: "2",
      title: "Post 2",
      author: "Author 2",
      url: "http://example.com/2",
      likes: 7,
      __v: 0
    },
    {
      _id: "3",
      title: "Post 3",
      author: "Author 3",
      url: "http://example.com/3",
      likes: 0,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list is empty, return 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has many blogs, return total sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(10)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { title: "A", author: "X", likes: 3 },
    { title: "B", author: "Y", likes: 12 },
    { title: "C", author: "Z", likes: 5 }
  ]

  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "B",
      author: "Y",
      likes: 12
    })
  })

  test('returns null when list is empty', () => {
    expect(listHelper.favoriteBlog([])).toBeNull()
  })
})

describe('author with most blogs', () => {
  const blogs = [
    { title: "A", author: "X", likes: 3 },
    { title: "B", author: "Y", likes: 12 },
    { title: "C", author: "Y", likes: 5 },
    { title: "D", author: "X", likes: 1 },
    { title: "E", author: "Y", likes: 8 },
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: "Y",
      blogs: 3
    })
  })

  test('returns null for empty list', () => {
    expect(listHelper.mostBlogs([])).toBeNull()
  })
})

describe('author with most likes', () => {
  const blogs = [
    { title: "A", author: "X", likes: 3 },
    { title: "B", author: "Y", likes: 12 },
    { title: "C", author: "Y", likes: 5 },
    { title: "D", author: "X", likes: 1 },
    { title: "E", author: "Z", likes: 20 },
  ]

  test('returns author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: "Z",
      likes: 20
    })
  })

  test('returns null for empty list', () => {
    expect(listHelper.mostLikes([])).toBeNull()
  })
})
