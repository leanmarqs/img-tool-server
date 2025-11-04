import axios from "axios";
import fs from "fs";

export async function downloadFile(fileUrl, outputPath) {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

  if (response.status !== 200) {
    throw new Error(`Download falhou com status ${response.status}`);
  }

  fs.writeFileSync(outputPath, response.data);
}
