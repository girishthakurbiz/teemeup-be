import { handleLeonardo } from "./handlers/leonardo";
// import { handleReplciate } from "./handlers/artsmart";
// add others...

import { categoryToolMap } from "./toolMap";

const toolHandlers: Record<string, (prompt: string) => Promise<any>> = {
  leonardo: handleLeonardo,
  // more tools here...
};

export const dispatchToolByCategory = async (
  category: string,
  prompt: string
) => {
  const tools = categoryToolMap[category] ?? [];

  // Always use the first available tool, or fallback to "leonardo"
  const selectedTool = tools[0] || "leonardo";
  const handler = toolHandlers[selectedTool];
  console.log("handler", handler);

  if (!handler) {
    throw new Error(`No handler implemented for tool: ${selectedTool}`);
  }

  try {
    return await handler(prompt);
  } catch (error) {
    console.error(`Error in tool handler (${selectedTool}):`, error);
    throw new Error("Failed to generate image.");
  }
};
