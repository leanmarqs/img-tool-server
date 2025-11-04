import sharp from "sharp";
import { Vibrant } from "node-vibrant/node";
import { Buffer } from "node:buffer";

/**
 * Converte cor HEX para RGBA com transparência.
 * @param {string} hex - Cor no formato #RRGGBB
 * @param {number} alpha - Opacidade entre 0 e 1
 * @returns {string} Cor no formato rgba(r, g, b, a)
 */
function hexToRgba(hex, alpha = 1) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Cria um canvas estilo ícone de iPhone com fundo na cor predominante
 * e a imagem original centralizada sobre ele.
 * @param {string} imagePath - Caminho da imagem original (.png)
 * @param {string} outputPath - Caminho de saída do ícone final
 */
export async function createIphoneStyleIcon(imagePath, outputPath) {
  try {
    // 1️⃣ Extrair cor predominante
    const palette = await Vibrant.from(imagePath).getPalette();
    const bgColor = palette.Vibrant?.hex || "#000000";
    const alpha = 0.65;
    const bgRgba = hexToRgba(bgColor, alpha);

    console.log("🎨 Cor predominante:", bgRgba);

    // 2️⃣ Metadados da imagem
    const inputImage = sharp(imagePath);
    const { width: imgWidth, height: imgHeight } = await inputImage.metadata();

    // 3️⃣ Tamanho do ícone
    const iconSize = Math.max(imgWidth, imgHeight) * 1.6;

    // 4️⃣ Centralização
    const left = Math.round((iconSize - imgWidth) / 2);
    const top = Math.round((iconSize - imgHeight) / 2);

    // 5️⃣ Canvas arredondado
    const cornerRadius = iconSize * 0.23;
    const backgroundSvg = Buffer.from(`
      <svg width="${iconSize}" height="${iconSize}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${iconSize}" height="${iconSize}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${bgRgba}"/>
      </svg>
    `);

    const background = await sharp(backgroundSvg).png().toBuffer();

    // 6️⃣ Sobreposição
    await sharp(background)
      .composite([{ input: await inputImage.toBuffer(), top, left }])
      .png()
      .toFile(outputPath);

    console.log(`✅ Ícone criado em: ${outputPath}`);
  } catch (err) {
    console.error("❌ Erro ao gerar ícone:", err.message);
    throw err;
  }
}
