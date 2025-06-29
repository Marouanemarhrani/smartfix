const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');

// Import routes
const userRoute = require('./routes/userRoute');
const repairRoute = require('./routes/repairRoute');
const quoteRoute = require('./routes/quoteRoute');
const chatRoute = require('./routes/chatRoute');

// Configure environment variables
dotenv.config();

// Connect to the database
connectDB();

// Create Express app
const app = express();

// Augmenter la taille limite de la requête
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));*/

// Route handling
app.use('/api/users', userRoute);
app.use('/api/repairs', repairRoute);
app.use('/api/quotes', quoteRoute);
app.use('/api/chats', chatRoute);

// Define port
const PORT = process.env.PORT || 8080;

// Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  }

module.exports = app;