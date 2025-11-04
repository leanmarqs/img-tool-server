import express from "express";
import { FaviconController } from "../controllers/favicon.controller.js";

const router = express.Router();
const faviconController = new FaviconController();

router.post("/download", (req, res) => faviconController.download(req, res));

export default router;
