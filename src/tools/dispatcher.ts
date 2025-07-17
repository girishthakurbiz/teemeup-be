import { getModelIdByName } from "../utils/fetchAndStoreModels";
import { handleLeonardo } from "./handlers/leonardo";
import { CATEGORY_NAME_MAP, DEFAULT_MODEL_NAME, DEFAULT_MODEL_ID } from "./toolMap";

const toolHandlers: Record<
  string,
  (prompt: string, modelId: string) => Promise<any>
> = {
  leonardo: handleLeonardo,
  // other handlers can be added here later
};

export const dispatchToolByCategory = async (
  category: string,
  prompt: string
) => {
  console.log("categorycategory", category);
  const modelName = CATEGORY_NAME_MAP[category] || DEFAULT_MODEL_NAME;

  console.log("modelNamemodelName", modelName);
  const modelId = getModelIdByName(modelName) || DEFAULT_MODEL_ID;
  console.log("modelIdmodelId", modelId);

  if (!modelId) {
    throw new Error(`No modelId found for category: "${category}"`);
  }

  const selectedTool = "leonardo"; // For now, you're only using leonardo
  const handler = toolHandlers[selectedTool];

  if (!handler) {
    throw new Error(`No handler implemented for tool: ${selectedTool}`);
  }
  try {
    return await handler(prompt, modelId); // Send modelId to the handler
  } catch (error) {
    console.error(`❌ Error in tool handler (${selectedTool}):`, error);
    throw new Error("Failed to generate image.");
  }
};
