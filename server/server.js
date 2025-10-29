import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import shipNominationRoutes from './routes/shipNominations.js';
import dropdownRoutes from './routes/dropdowns.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚢 AmSpec Backend API',
    version: '1.0.0',
    endpoints: {
      shipNominations: '/api/ship-nominations',
      agents: '/api/dropdowns/agents',
      berths: '/api/dropdowns/berths',
      chemists: '/api/dropdowns/chemists',
      samplers: '/api/dropdowns/samplers',
      surveyors: '/api/dropdowns/surveyors',
      terminals: '/api/dropdowns/terminals',
    },
  });
});

app.use('/api/ship-nominations', shipNominationRoutes);
app.use('/api/dropdowns', dropdownRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
