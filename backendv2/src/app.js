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



// Rota POST
app.post('/api/verify', (req, res) => {
  console.log("1. receive request")
  const input = req.body;
  
  console.log("2. validate input")
  if (!input || !input.publicInputs || !input.proof || !input.vk) {
    return res.status(400).json({
      error: "Invalid proof data"
    });
  }

  console.log("3. show data")
  console.log(input)


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
