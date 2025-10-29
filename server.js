// Import e configurazioni

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
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const spec = YAML.load("./docs/openapi.yaml");

const authRoutes = require('./routes/auth.routes'); 
const taskRoutes = require('./routes/task.routes');
const adminRoutes = require("./routes/admin.routes");

const app = express();

//Connessione a MongoDb
connectDb();

// Middleware globali

app.use(helmet()); // Sicurezza HTTP headers

// Configurazione CORS
const allowed = [
  'http://127.0.0.1:5500',   // live server locale
  'http://localhost:5173',    // vite o altro dev server
  'https://task-manager-yyyj.onrender.com' // il tuo backend su Render
];

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



// Servire file statici

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // immagini task


// Rate limiter per autenticazione
app.set('trust proxy', 1);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100,                 // max 100 richieste/ IP / finestra
  standardHeaders: true,    
  legacyHeaders: false      
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));


// Rotte principali

app.use('/auth', authLimiter, authRoutes); // Rotte autenticazione con rate limiter
app.use('/tasks', taskRoutes);             // Rotte task
app.use("/admin", adminRoutes);            // Rotte admin



// Rotte di salute e root

app.get('/task/health', (req, res) => {
  res.json({ status: 'ok' }); 
});

app.get('/', (req, res) => {
  res.send('✅ Server online e funzionante!');
});


// Middleware 404

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


// Middleware gestione errori

app.use(errorHandler); // Deve avere 4 argomenti (err, req, res, next)


// Avvio server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
