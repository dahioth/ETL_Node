const express = require('express');
const universityRoutes = require('./routes/universityRoutes');

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
