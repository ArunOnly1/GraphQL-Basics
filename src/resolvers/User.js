const User = {
  posts(parent, args, { db: { postList } }, info) {
    return postList.filter((post) => post.author === parent.id)
  },
  comments(parent, args, { db: { commentList } }, info) {
    return commentList.filter((comment) => comment.authorId === parent.id)
  },
}

export { User as default }
