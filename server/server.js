const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const dbConfig = require('./config/dbConfig');

app.use(express.json());

const usersRoutes = require('./routes/usersRoutes');
app.use('/api/users', usersRoutes)

app.listen(port, () => console.log(`Node JS Serer started at ${port}`))