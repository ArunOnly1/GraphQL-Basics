const userList = [
  {
    id: '1',
    name: 'Rajeev',
    age: 24,
    email: 'rajeev@example.com',
  },
  {
    id: '2',
    name: 'Salon',
    age: 18,
    email: 'salon@gmail.com',
  },
]

const postList = [
  {
    body: 'I went to Fewa Lakes, Peace Stupa, Sarangkot',
    id: '123-abc',
    published: true,
    title: 'Awesome Pokhara',
    author: '1',
  },
  {
    body: 'I went to Dakshinkali and GorakhNath Temple',
    id: '123-abcd',
    published: false,
    title: 'Cool Pharping',
    author: '1',
  },
  {
    body: 'I went to Times Square',
    id: '123-abcde',
    published: true,
    title: 'Exciting New York',
    author: '2',
  },
]

const commentList = [
  {
    id: 'cmt-1',
    text: 'It was a nice vacation at Pharping',
    authorId: '1',
    postId: '123-abc',
  },
  {
    id: 'cmt-2',
    text: 'Life time best moment at New York with my family',
    authorId: '2',
    postId: '123-abcd',
  },
  {
    id: 'cmt-3',
    text: 'I feel fresh at Pokhara',
    authorId: '1',
    postId: '123-abcd',
  },
  {
    id: 'cmt-4',
    text: 'The weather is kind of hot with humidity here at Pokhara',
    authorId: '2',
    postId: '123-abcde',
  },
]

const db = {
  userList,
  commentList,
  postList,
}

export { db as default }
