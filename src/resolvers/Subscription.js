const Subscription = {
  comment: {
    subscribe(parent, { postId }, { pubsub, db: { postList } }, info) {
      const post = postList.find((post) => post.id === postId && post.published)
      if (!post) {
        throw new Error(' found')
      }

      return pubsub.asyncIterator(`comment ${postId}`)
    },
  },

  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    },
  },
}

export { Subscription as default }
