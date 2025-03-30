require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Sequelize } = require('sequelize');
const errorHandler = require('./utils/errorHandler');
const config = require('./config/config');

const app = express();

// Database Configuration
const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, dialect } = config[env];
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: env === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

// Routes
app.use('/api/v1/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/v1/placement-cell', require('./routes/placementCell.routes'));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Database Sync and Server Start
const PORT = process.env.PORT || 3000;

// Initialize Models and Start Server
const db = require('./models');
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return db.sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${env}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = app;