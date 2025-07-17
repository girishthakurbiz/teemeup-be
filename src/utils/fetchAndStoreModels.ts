import axios from "axios";
import fs from "fs";
import path from "path";
import { LEONARDO_MODEL_MAP } from "../config/leonardoModelMap";

export const fetchAndStoreModels = async () => {
  try {
    const response = await axios.get(
      "https://cloud.leonardo.ai/api/rest/v1/platformModels",
      {
        headers: {
          Authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    const models = response.data;

    if (!Array.isArray(models?.custom_models)) {
      console.error("❌ Unexpected response format from Leonardo API:", models);
      return;
    }

    const filePath = path.resolve(__dirname, "../data/models.json");
    fs.writeFileSync(filePath, JSON.stringify(models, null, 2));

    console.log(
      `✅ Fetched and saved ${models?.custom_models.length} models to models.json`
    );
  } catch (error: any) {
    console.error(
      "❌ Failed to fetch models:",
      error.response?.data || error.message
    );
  }
};

const modelsPath = path.resolve(__dirname, "../data/models.json");

// Load the model list once
const models = JSON.parse(fs.readFileSync(modelsPath, "utf-8")) as any;
export function getModelIdByName(modelName: string): string | undefined {
  const model = models?.custom_models?.find((m: any) => m.name === modelName);
  if (model) {
    return model.id;
  }
  const mappedEntry = Object.values(LEONARDO_MODEL_MAP).find(
    (entry) => entry.name === modelName
  );

  if (mappedEntry) {
    console.warn(`⚠️ Using fallback modelId for "${modelName}"`);
    return mappedEntry.id;
  }

  console.error(`❌ Model ID not found for "${modelName}"`);
  return undefined;
  //   const model = models?.custom_models?.find((m:any) => m.name.includes(modelName));
}
