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

app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json());

// when someone visit your site for the first time index html is served
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if request actually contains username or password or not
	// if not throw an error and it handled by catch block  
    if (username === undefined || password === undefined) {
      throw new Error('Invalid credentials');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await User.create({
      username,
      password: hashedPassword,
    });

    console.log('User created successfully', response);
    res.json({ status: 'ok', user: response });
  } catch (error) {
    res.status(422).json({ message: error.message, status: 'error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
