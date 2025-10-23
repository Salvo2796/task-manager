// ==============================
// 1️⃣ Import e configurazioni
// ==============================
const express = require('express');
const connectDb = require("./config/db")
const cors = require('cors');
const path = require('path');
const env = require('./config/env');           // Variabili d'ambiente
const helmet = require("helmet");              // Sicurezza HTTP headers
const rateLimit = require("express-rate-limit"); 
const morgan = require("morgan");             // Logger richieste HTTP
const logger = require("./utils/logger");     
const errorHandler = require("./middleware/errorHandler"); // Middleware gestione errori

const authRoutes = require('./routes/auth.routes'); 
const taskRoutes = require('./routes/task.routes');

const app = express();

connectDb();
// ==============================
// 2️⃣ Middleware globali
// ==============================
app.use(helmet()); // Sicurezza HTTP headers

// Configurazione CORS
const allowed = ['https://tuo-frontend.it', 'http://localhost:5173'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json()); // Parse JSON nel body delle richieste

// Logger richieste HTTP con morgan e logger custom
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));


// ==============================
// 3️⃣ Servire file statici
// ==============================
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // immagini task


// ==============================
// 4️⃣ Rate limiter per autenticazione
// ==============================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100,                 // max 100 richieste/ IP / finestra
  standardHeaders: true,    
  legacyHeaders: false      
});


// ==============================
// 5️⃣ Rotte principali
// ==============================
app.use('/auth', authLimiter, authRoutes); // Rotte autenticazione con rate limiter
app.use('/tasks', taskRoutes);             // Rotte task


// ==============================
// 6️⃣ Rotte di salute e root
// ==============================
app.get('/task/health', (req, res) => {
  res.json({ status: 'ok' }); 
});

app.get('/', (req, res) => {
  res.send('✅ Server online e funzionante!');
});


// ==============================
// 7️⃣ Middleware 404
// ==============================
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


// ==============================
// 8️⃣ Middleware gestione errori
// ==============================
app.use(errorHandler); // Deve avere 4 argomenti (err, req, res, next)


// ==============================
// 9️⃣ Avvio server
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
