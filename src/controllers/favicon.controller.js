import { FaviconService } from "../services/favicon.service.js";

const faviconService = new FaviconService();

export class FaviconController {
  async download(req, res) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL é obrigatória" });
      }

      const result = await faviconService.downloadFavicon(url);

      // ✅ Retorna JSON completo com os caminhos
      return res.json({
        message: "Favicon processado com sucesso!",
        rawPath: result.rawPath,
        editedPath: result.editedPath,
      });
    } catch (error) {
      console.error("❌ Erro no controller:", error);
      return res
        .status(500)
        .json({ error: "Falha ao processar o favicon no servidor." });
    }
  }
}
