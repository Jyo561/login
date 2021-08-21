const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/login-app-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();
const port = 3000;

app.use('/', express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  console.log(req.body);
  const { username, password: plainTextPassword } = req.body;

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
    });
    console.log('User created successfully', response);
  } catch (error) {
    console.log(error);
    res.json({ status: 'error' });
  }
  res.json({ status: 'ok' });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
