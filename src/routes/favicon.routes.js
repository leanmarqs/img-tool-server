import { Router } from "express";
import { FaviconController } from "../controllers/favicon.controller.js";

const router = Router();
const controller = new FaviconController();

router.post("/download", (req, res) => controller.download(req, res));

export default router;
