import axios from "axios";

export const handleLeonardo = async (prompt: string) => {
  try {
    console.log("handleLeonardo")
    const response = await axios.post(
      "https://cloud.leonardo.ai/api/rest/v1/generations",
      {
        prompt,
        height: 512,
        width: 512,
        modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // replace with actual model ID
        num_images: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generationId = response.data.sdGenerationJob.generationId;
    // You can also poll for result using generationId, or return it to client to fetch later

    return {
      provider: "Leonardo",
      generationId,
    };
  } catch (error: any) {
    console.error("Leonardo API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate image with Leonardo");
  }
};
