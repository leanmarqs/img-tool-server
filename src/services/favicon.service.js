import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { downloadFile } from "../common/utils/downloadFile.js";
import { createIphoneStyleIcon } from "./thumb-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FaviconService {
  async downloadFavicon(siteUrl) {
    try {
      const url = new URL(siteUrl);
      const faviconUrl = `${url.origin}/favicon.ico`;

      const rawDir = path.join(__dirname, "..", "favicons", "raws");
      const editedDir = path.join(__dirname, "..", "favicons", "edited");
      const rawBase = path.join(rawDir, url.hostname);

      const rawIcoPath = `${rawBase}.ico`;
      const rawPngPath = `${rawBase}.png`;
      const editedPath = path.join(editedDir, `${url.hostname}.png`);

      if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
      if (!fs.existsSync(editedDir))
        fs.mkdirSync(editedDir, { recursive: true });

      let downloadSucceeded = false;

      // 1️⃣ Tenta baixar diretamente o favicon.ico
      try {
        console.log(`🔍 Tentando baixar favicon direto de ${faviconUrl}`);
        const response = await axios.get(faviconUrl, {
          responseType: "arraybuffer",
          validateStatus: () => true,
        });

        const contentType = response.headers["content-type"] || "";
        const buffer = Buffer.from(response.data);

        if (response.status === 200 && buffer.length > 0) {
          // Detecta formato
          let ext = ".ico";
          if (contentType.includes("png")) ext = ".png";
          else if (contentType.includes("jpeg")) ext = ".jpg";
          else if (contentType.includes("svg")) ext = ".svg";
          else if (contentType.includes("webp")) ext = ".webp";

          const tempPath = rawBase + ext;
          fs.writeFileSync(tempPath, buffer);

          // Tenta converter para PNG se possível
          try {
            console.log(`🔄 Convertendo ${ext} para PNG...`);
            await sharp(tempPath).png().toFile(rawPngPath);
            fs.unlinkSync(tempPath);
            downloadSucceeded = true;
          } catch (convertErr) {
            console.warn(`⚠️ Erro ao converter ${ext}: ${convertErr.message}`);
          }
        }
      } catch (err) {
        console.warn(`⚠️ Erro ao baixar favicon direto: ${err.message}`);
      }

      // 2️⃣ Fallback: usa o serviço do Google se falhou
      if (!downloadSucceeded || !fs.existsSync(rawPngPath)) {
        const googleFavicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
        console.log(`⚙️ Usando fallback do Google: ${googleFavicon}`);
        await downloadFile(googleFavicon, rawPngPath);
      }

      // 3️⃣ Gera o ícone estilizado
      console.log("🎨 Gerando ícone estilo iPhone...");
      await createIphoneStyleIcon(rawPngPath, editedPath);

      return { rawPath: rawPngPath, editedPath };
    } catch (err) {
      console.error("❌ Erro em FaviconService:", err.message);
      throw new Error("Falha ao processar o favicon");
    }
  }
}
