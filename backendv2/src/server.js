// server.js
import dotenv from "dotenv";
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});