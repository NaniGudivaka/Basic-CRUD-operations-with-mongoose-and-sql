const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


// Connect MongoDB

const connectDB = async () =>{

  try{

  await mongoose.connect('mongodb://127.0.0.1:27017/studentDB');

  console.log('MongoDB connected successfully');
  }
  catch(error){

    console.log(error);

  }
};
connectDB();

//Schema in db ----------------------------------------

const studentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  password: String
});

//--------------Model------------------------

const Student = mongoose.model(
  'student',
  studentSchema
);

app.get('/', async (req, res) =>{

  try{

  const students = await Student.find();

  return res.json({
    students
  });
}
catch(error){
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
}
});

// Saving the students data into api

app.post('/students', async (req, res) =>{

  try{

  const {id, name, password } = req.body;

  //student details validation

  if(id === undefined || !name || !password){

    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  //checking student exists

  const existingStudent = await Student.findOne({
    id 
  });

  if(existingStudent){

    return res.status(409).json({

      success: false,
      message: 'This student already have an account'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  //Saving the data

  await Student.create({
    id,
    name,
    password: hashedPassword
  });
  res.status(201).json({
    success: true,
    message: 'Student details saved successfully',
    password: hashedPassword
  });
}
catch(error){
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
}


});

//Login in to students using api

app.post('/login', async (req, res) =>{

  try{

  const {name, password} = req.body;

      // VALIDATION

    if (!name || !password) {

      return res.status(400).json({

        success: false,

        message: 'Name and password are required'

      });

    }


  //Find the student in my data exist or not

  const studentExist = await Student.findOne({
    
    name: new RegExp(`^${name}$`, 'i')
  } );

  //checking student exists

  if(!studentExist){
    return res.status(404).json({
      success: false,
      message: 'Student does not exist'
    });
  }

  //checking the password

  const match = await bcrypt.compare(password, studentExist.password);

  if(!match){
    return res.status(401).json({
      success: false,
      message: 'Password is not matching'
    });
  }

  // Creating JWT token

  const token = jwt.sign(
    {
    id: studentExist.id,

    name: studentExist.name
  },

  'mysecretkey',
  {
    expiresIn: '1h'
  }
);

//response

res.json({
  success: true,
  message: 'Login successful',
  token
});
  }

  catch(error){
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }


});



app.listen(3000, () =>{
  console.log('If you see this message, Congrats Server is running');
});