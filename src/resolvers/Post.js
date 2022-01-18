const Post = {
  author(parent, args, { db: { userList } }, info) {
    return userList.find((item) => item.id === parent.author)
  },
  comments(parent, args, { db: { commentList } }, info) {
    return commentList.filter((item) => item.postId === parent.id)
  },
}

export { Post as default }
