// scripts/upload-server.cjs
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4001;

// Ruta donde se guardarán los archivos
const UPLOADS_DIR = path.join(__dirname, "../public/uploads/libros");

app.use(cors());
app.use(express.static("public"));

// Asegurarse que exista la carpeta
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "Imagen guardada", file: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`🟢 Upload server corriendo en http://localhost:${PORT}`);
});
