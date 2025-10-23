const multer = require("multer");

const upload = multer({
  // Salva i file nella cartella "uploads/"
  dest: 'uploads/',
  // Limita dimensione: 2 MB
  limits: { fileSize: 2 * 1024 * 1024 },
  // Accetta solo immagini (image/*). Puoi ampliare a pdf, ecc.
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Tipo di file non supportato (consentite solo immagini)'));
  }
});

module.exports = upload;