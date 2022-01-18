import { v4 as uuidv4 } from 'uuid'

const Mutation = {
  createUser(parent, args, { db: { userList } }, info) {
    const emailTaken = userList.some((user) => user.email === args.data.email)
    if (emailTaken) {
      throw new Error('Email already taken.')
    }
    const newUser = {
      id: uuidv4(),
      ...args.data,
    }

    userList.push(newUser)
    return userList[userList.length - 1]
  },
  deleteUser(parent, args, { db: { userList, postList, commentList } }, info) {
    const { id } = args
    const userIndex = userList.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    const deletedUser = userList.splice(userIndex, 1)

    postList = postList.filter((post) => {
      const match = post.author === id
      if (match) {
        commentList = commentList.filter(
          (comment) => comment.postId !== post.id
        )
      }
      return !match
    })
    commentList = commentList.filter((comment) => comment.authorId !== id)
    // TODO:Ask pradeep dai about return type of User => post and comments as empty array
    // TODO:even though we have not set anything to it
    return { ...deletedUser[0] }
  },

  updateUser(parent, { id, data }, { db: { userList } }, info) {
    const user = userList.find((user) => user.id === id)
    if (!user) {
      throw new Error('User not found')
    }

    // Check if email has already been taken
    if (typeof data.email === 'string') {
      const emailTaken = userList.some((user) => user.email === data.email)
      if (emailTaken) {
        throw new Error('Email already taken')
      }
      user.email = data.email
    }

    if (typeof data.name === 'string') {
      user.name = data.name
    }
    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user
  },
  createPost(parent, args, { db: { userList, postList }, pubsub }, info) {
    const { title, body, published, author } = args.data
    const userExists = userList.some((user) => user.id === author)
    if (!userExists) {
      throw new Error('Author not found')
    }
    const post = {
      id: uuidv4(),
      title,
      body,
      published,
      author,
    }

    postList.push(post)
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      })
    }
    return post
  },

  deletePost(parent, args, { db: { postList, commentList }, pubsub }, info) {
    const { id: postId } = args

    const postIndex = postList.findIndex((post) => post.id === postId)

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const [post] = postList.splice(postIndex, 1)
    // console.log({ post })
    commentList = commentList.filter((comment) => comment.postId !== postId)
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      })
    }

    return post
  },

  updatePost(parent, { id, data }, { db: { postList }, pubsub }, info) {
    const post = postList.find((post) => post.id === id)
    const originalPost = { ...post }

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published
      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          },
        })
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        })
      }
    } else if (post.published) {
      // updated
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      })
    }

    return post
  },

  createComment(
    parent,
    args,
    { db: { userList, postList, commentList }, pubsub },
    info
  ) {
    const { postId, author } = args.data
    const userExists = userList.some((user) => user.id === author)
    if (!userExists) {
      throw new Error('User not found')
    }
    const postExists = postList.some(
      (post) => post.id === postId && post.published
    )
    if (!postExists) {
      throw new Error('Post not found')
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
      authorId: author,
    }

    commentList.push(comment)

    pubsub.publish(`comment ${postId}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    })
    return comment
  },
  deleteComment(parent, args, { db: { commentList }, pubsub }, info) {
    const { id: commentId } = args
    const commentIndex = commentList.findIndex(
      (comment) => comment.id === commentId
    )
    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    // *ya feri deletedComment ma author ra post detail aairako xa
    const [deletedComment] = commentList.splice(commentIndex, 1)
    // console.log({ deletedComment })

    pubsub.publish(`comment ${deletedComment.postId}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    })
    return deletedComment
  },

  updateComment(
    parent,
    { id, data: { text } },
    { db: { commentList }, pubsub },
    info
  ) {
    const comment = commentList.find((comment) => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof text === 'string') {
      comment.text = text
    }

    pubsub.publish(`comment ${comment.postId}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    })

    return comment
  },
}

export { Mutation as default }
