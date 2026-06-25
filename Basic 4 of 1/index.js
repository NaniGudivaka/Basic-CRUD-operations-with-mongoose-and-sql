const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());  
app.use(cors());

const users = [];

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) return res.status(400).send('Username and password are required');

    if (users.find(u => u.username === username)) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');

    const token = jwt.sign({ username: user.username }, 'secret_key');
    res.send({ token });
});
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied'); 

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        res.send('This is a protected route');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});