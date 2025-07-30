// app.js
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Validate proof data middleware
const validateProofData = (data) => {
  // Check if data exists and has required properties
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Validate publicInputs
  if (!data.publicInputs || !Array.isArray(data.publicInputs)) {
    return false;
  }

  // Validate proof
  if (!data.proof || !Array.isArray(data.proof)) {
    return false;
  }

  // Validate vk
  if (!data.vk || !Array.isArray(data.vk)) {
    return false;
  }

  return true;
};

// Rota POST
app.post('/api/verify', (req, res) => {
  const input = req.body;
  
  // Ensure input validation happens before any processing
  if (!input || !validateProofData(input)) {
    return res.status(400).json({
      error: "Invalid proof data"
    });
  }

  res.status(200).json({
    message: 'Data received successfully!',
    received: input
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
