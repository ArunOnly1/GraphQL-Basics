const Query = {
  post() {
    return {
      body: 'I went to Fewa Lakes, Peace Stupa, Sarangkot',
      id: '123-abc',
      published: true,
      title: 'A good weekend in Pokhara',
    }
  },
  me() {
    return {
      id: '123-abcd',
      name: 'Arun Chapagain',
      age: 25,
    }
  },
  users(parent, args, { db: { userList } }, info) {
    const { query } = args
    if (query) {
      return userList.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      )
    }
    return userList
  },
  posts(parent, args, { db: { postList } }, info) {
    const { query } = args
    if (query)
      return postList.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      )
    return postList
  },
  comments(parent, args, { db: { commentList } }, info) {
    return commentList
  },
}

export { Query as default }
