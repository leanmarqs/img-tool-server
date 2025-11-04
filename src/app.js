import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import faviconRoutes from "./routes/favicon.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(express.json());
app.use(morgan("dev"));

// 🔧 Torna a pasta "favicons" acessível publicamente
app.use("/favicons", express.static(path.join(__dirname, "favicons")));

// suas rotas da API
app.use("/api/favicons", faviconRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Favicon Downloader API" });
});
