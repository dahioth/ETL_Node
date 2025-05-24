const express = require('express');
const { sequelize, testConnection } = require('./config/database');
const universityRoutes = require('./routes/universityRoutes');
const etlService = require('./services/etlService');
const schedulerService = require('./services/schedulerService');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/universities', universityRoutes);

// Home route
app.get('/', (req, res) => {
  res.send({
    message: 'University ETL API',
    endpoints: {
      universities: '/api/universities',
      download: '/api/universities/download'
    }
  });
});

const initializeApp = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database models
    await sequelize.sync();
    console.log('Database synchronized successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Start the application
initializeApp(); 