import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import faviconRoutes from "./routes/favicon.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express(); // ✅ agora exporta app

app.use(express.json());
app.use("/favicons", express.static(path.join(__dirname, "favicons")));
app.use("/api/favicons", faviconRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API ativa ✅" });
});
