const express = require('express');

const app = express();

app.use(express.json());

const users = [
  {
    username: 'nani',
    password: '1234'
  },
  {
    username: 'john',
    password: 'abcd'
  }
];
const products = [{

    id: 1,
    name: 'iPhone 16',
    cost: 80000,
    rating: 4.5

}];
app.get('/products', (req, res) =>{
  console.log('This is products server');
  res.json({
    success: true,
    products: products
  })
});

app.post('/products', (req, res) =>{

  const {id, name, cost, rating} = req.body;

  if( id === undefined ||
     !name ||
      cost === undefined||
      rating === undefined){
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const existing = products.find((product) =>{
    return product.id === id;
  });
  if(existing){
    return res.status(409).json({
      success: false,
      message: 'Products are exist in data'
    });
  }

  // Add products

  products.push({
    id,
    name,
    cost,
    rating
  });
  res.status(201).json({
    success: true,
    message: 'Products added successfully',
    products: products
  });


});

//checking the product exists or not





// Home Route
app.get('/', (req, res) => {
  // res.send('Server Running Successfully');

  res.json({
    success: true,
    user: users
  });
});

//Signup Route
app.post('/signup', (req, res) =>{

  const {username, password} = req.body;

  //checking the empty fileds

  if(!username || !password){
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  //checking the existing user
  const existingUser = users.find((user) =>{
    return user.username === username;
  });

  if(existingUser){
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Adding new user

  users.push({
    username,
    password
  });
  res.status(201).json({
    success: true,
    message: 'User signup is success'
  });

  console.log(username, password);

});

// Login Route
app.post('/login', (req, res) => {

  const { username, password } = req.body;

  // Check empty fields
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and Password required'
    });
  }

  // Find user
  const foundUser = users.find((user) => {
    return user.username === username;
  });

  // User not found
  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Wrong password
  if (foundUser.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid password'
    });
  }

  // Success
  res.status(200).json({
    success: true,
    message: 'Login Success',
    user: {
      username: foundUser.username
    }
  });

});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});