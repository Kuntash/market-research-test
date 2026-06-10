import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database setup
let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Connected to the SQLite database.');
})();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Market Research API is running' });
});

// Basic notes API
app.get('/api/notes/:ticker', async (req, res) => {
  try {
    const notes = await db.all('SELECT * FROM notes WHERE ticker = ? ORDER BY created_at DESC', [req.params.ticker]);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', async (req, res) => {
  const { ticker, content } = req.body;
  try {
    const result = await db.run('INSERT INTO notes (ticker, content) VALUES (?, ?)', [ticker, content]);
    res.json({ id: result.lastID, ticker, content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
