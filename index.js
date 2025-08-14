const express = require('express');
const cors = require('cors');

const app = express();

// require("dotenv").config({path: "./env"});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connectMongoDB = require('./config/mongodbConfig');
const userRoutes = require('./routes/userRoutes');
// const authMiddleware = require('./middleware/auth');

connectMongoDB();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});