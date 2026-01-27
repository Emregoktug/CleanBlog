const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const path = require('path');

const Post = require('./models/Post');

const app = express();

/* ======================
   DATABASE
====================== */
mongoose
  .connect('mongodb://localhost:27017/cleanblog-test-db')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

/* ======================
   VIEW ENGINE
====================== */
app.set('view engine', 'ejs');

/* ======================
   GLOBAL LOCALS
====================== */
// currentPage her zaman tanımlı olsun (navbar için)
app.use((req, res, next) => {
  res.locals.currentPage = '';
  next();
});

/* ======================
   MIDDLEWARE
====================== */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method'));

/* ======================
   ROUTES
====================== */

// HOME
app.get('/', async (req, res) => {
  const posts = await Post.find({}).sort({ dateCreated: -1 });
  res.locals.currentPage = 'home';
  res.render('index', { posts });
});

// ABOUT
app.get('/about', (req, res) => {
  res.locals.currentPage = 'about';
  res.render('about');
});

// ADD NEW POST PAGE
app.get('/add', (req, res) => {
  res.locals.currentPage = 'add';
  res.render('add');
});

// SINGLE POST PAGE
app.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post', { post });
});

// CREATE POST (WITH IMAGE)
app.post('/posts', async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.redirect('/add');
  }

  const uploadDir = path.join(__dirname, 'public/uploads');

  const imageFile = req.files.image;
  const imageName = Date.now() + '-' + imageFile.name;
  const imagePath = '/uploads/' + imageName;

  await imageFile.mv(path.join(uploadDir, imageName));

  await Post.create({
    title: req.body.title,
    detail: req.body.detail,
    image: imagePath,
  });

  res.redirect('/');
});

// DELETE POST
app.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// EDIT PAGE
app.get('/posts/edit/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.locals.currentPage = 'add';
  res.render('edit', { post });
});

// UPDATE POST
app.put('/posts/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    detail: req.body.detail,
  });
  res.redirect('/');
});

/* ======================
   SERVER
====================== */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
