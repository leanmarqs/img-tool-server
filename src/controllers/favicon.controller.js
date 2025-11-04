import { FaviconService } from "../services/favicon.service.js";

export class FaviconController {
  constructor() {
    this.faviconService = new FaviconService();
  }

  async download(req, res) {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "URL is required" });

      const { rawPath, editedPath } = await this.faviconService.downloadFavicon(
        url
      );
      if (!rawPath || !editedPath) {
        return res.status(500).json({ error: "Erro ao processar favicon" });
      }

      res.json({
        message: "Favicon processado com sucesso!",
        rawPath,
        editedPath,
      });
    } catch (error) {
      console.error("Error downloading favicon:", error);
      res.status(500).json({ error: "Falha ao processar favicon" });
    }
  }
}
