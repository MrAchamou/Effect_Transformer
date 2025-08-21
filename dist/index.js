// server/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs/promises";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 5e3;
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? ["https://*.replit.app", "https://*.replit.dev"] : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
var storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), "uploads");
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/javascript" || file.mimetype === "text/javascript" || file.originalname.endsWith(".js")) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers JavaScript sont accept\xE9s"));
    }
  }
});
app.use((req, res, next) => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/", (req, res) => {
  res.json({
    message: "Code Enhancement Server",
    status: "Running",
    version: "1.0.0",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api", (req, res) => {
  res.json({
    message: "API Visual Effects Transformer",
    version: "1.0.0",
    endpoints: [
      "/api/health",
      "/api/transform",
      "/api/levels"
    ]
  });
});
app.get("/api/levels", (req, res) => {
  res.json({
    levels: {
      1: {
        name: "Standard",
        description: "Optimisations de base",
        modules: 7,
        price: "Gratuit"
      },
      2: {
        name: "Professionnel",
        description: "Am\xE9lioration avanc\xE9e avec IA",
        modules: 15,
        price: "Premium"
      },
      3: {
        name: "Enterprise",
        description: "Transformation compl\xE8te avec apprentissage",
        modules: 23,
        price: "Enterprise"
      }
    }
  });
});
app.post("/api/transform", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }
    const { level = "1" } = req.body;
    const filePath = req.file.path;
    console.log(`\u{1F504} Transformation niveau ${level} demand\xE9e pour: ${req.file.originalname}`);
    const content = await fs.readFile(filePath, "utf-8");
    const transformedCode = `// Code transform\xE9 (niveau ${level})
${content}`;
    await fs.unlink(filePath).catch(console.error);
    res.json({
      success: true,
      result: transformedCode,
      originalSize: content.length,
      newSize: transformedCode.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("\u274C Erreur de transformation:", error);
    res.status(500).json({
      error: "Erreur de transformation",
      message: error.message
    });
  }
});
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "dist", "public");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  const clientPath = path.join(__dirname, "..", "client");
  app.use(express.static(clientPath));
}
app.use((error, req, res, next) => {
  console.error("\u274C Erreur serveur:", error);
  res.status(500).json({
    error: "Erreur interne du serveur",
    message: process.env.NODE_ENV === "development" ? error.message : "Une erreur est survenue",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
var server = app.listen(PORT, "0.0.0.0", () => {
  console.log("\n\u{1F680} === SERVEUR D\xC9MARR\xC9 AVEC SUCC\xC8S ===");
  console.log(`\u{1F4E1} Port: ${PORT}`);
  console.log(`\u{1F310} URL locale: http://localhost:${PORT}`);
  console.log(`\u{1F517} URL Replit: https://${process.env.REPL_SLUG || "your-repl"}.${process.env.REPL_OWNER || "username"}.repl.co`);
  console.log(`\u2699\uFE0F Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log("\u2705 Pr\xEAt \xE0 recevoir des requ\xEAtes\n");
});
process.on("SIGTERM", () => {
  console.log("\u{1F6D1} Arr\xEAt du serveur...");
  server.close(() => {
    console.log("\u2705 Serveur arr\xEAt\xE9 proprement");
    process.exit(0);
  });
});
process.on("SIGINT", () => {
  console.log("\u{1F6D1} Interruption re\xE7ue, arr\xEAt du serveur...");
  server.close(() => {
    console.log("\u2705 Serveur arr\xEAt\xE9 proprement");
    process.exit(0);
  });
});
var index_default = app;
export {
  index_default as default
};
