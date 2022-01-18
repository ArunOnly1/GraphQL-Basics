const Comment = {
  author(parent, args, { db: { userList } }, info) {
    return userList.find((user) => user.id === parent.authorId)
  },
  post(parent, args, { db: { postList } }, info) {
    return postList.find((post) => post.id === parent.postId)
  },
}

export { Comment as default }
