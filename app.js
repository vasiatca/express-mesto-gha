const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6106c11cca1a1a788449d783',
  };

  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on http://localhost:${port}`);
});
