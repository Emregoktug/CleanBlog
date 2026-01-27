const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const app = express();

//Database Connection

mongoose
  .connect('mongodb://localhost:27017/cleanblog-test-db')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

//Vıew Engine

app.set('view engine', 'ejs');

//MIDDLEWARE

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get('/', async (req, res) => {
  const posts = await Post.find({}).sort({ dateCreated: -1 });
  res.render('index', { posts });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/post', (req, res) => {
  res.render('post');
});

app.post('/posts', async (req, res) => {
  await Post.create(req.body);
  res.redirect('/');
});

//PORT
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
