const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());


const users = [];

app.get('/', (req, res) =>{
  res.json({
    success: true,
    message: users
  });
});

app.post('/user', async (req, res) =>{

  const {username, password} = req.body;

  if(!username || !password){
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const existingUser = users.find((user) =>{
    return user.username === username;
  });

  if(existingUser){
    return res.status(409).json({
      success: false,
      message: "User already have an account"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  users.push({
    username,
    password: hashedPassword
  });
  res.status(201).json({
  success: true,
  message: "User created successfully",
  password: hashedPassword
});


});

app.listen(3000, () =>{
  console.log('Server Line : Message comes from server');
})