import axios from "axios";

const LEONARDO_API_URL = "https://cloud.leonardo.ai/api/rest/v1";
const HEADERS = {
  Authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchGeneration = async (generationId: string) => {
  const res = await axios.get(
    `${LEONARDO_API_URL}/generations/${generationId}`,
    { headers: HEADERS }
  );
  console.log("fetchGeneration response", res.data);
  return res.data?.generations_by_pk;
};

const waitForImages = async (
  generationId: string,
  maxRetries: number,
  delay: number
): Promise<string[]> => {
  for (let i = 1; i <= maxRetries; i++) {
    console.log("maxRetries", maxRetries);

    const generation = await fetchGeneration(generationId);
    const images = generation?.generated_images || [];
    if (images.length) return images.map((img: any) => img.url);
    await sleep(delay);
  }

  throw new Error("Images not available even after generation completed.");
};

export const pollGenerationStatus = async (
  generationId: string,
  maxPollRetries = 10,
  delay = 2000,
  postCompleteRetries = 5
): Promise<string[]> => {
  for (let attempt = 1; attempt <= maxPollRetries; attempt++) {
    const generation = await fetchGeneration(generationId);
    console.log("generationgeneration", generation);
    if (!generation) throw new Error("Invalid generation response");

    const { status, generated_images = [] } = generation;
    console.log("statusstatus", status);

    if (status === "COMPLETE") {
      console.log("Generation completed with images:", generated_images.length);
      if (generated_images.length) {
        return generated_images.map((img: any) => img.url);
      }

      // Retry just images if status is complete but images not ready
      return await waitForImages(generationId, postCompleteRetries, delay);
    }

    await sleep(delay);
  }

  throw new Error("Image generation timed out.");
};

const supportsTransparency = (modelId: string) => {
  const transparentModels = [
    "aa77f04e-3eec-4034-9c07-d0f619684628", // replace with actual model IDs as you discover them
  ];
  return transparentModels.includes(modelId);
};

export const handleLeonardo = async (
  prompt: string,
  modelId: string
): Promise<{ provider: string; generationId: string; imageUrl: string }> => {
  try {
    const requestBody: any = {
      prompt,
      height: 512,
      width: 512,
      modelId,
      num_images: 1,
      enhancePrompt: true,
      transparency: "foreground_only",
elements: [
    {
      "akUUID": "5f3e58d8-7af3-4d5b-92e3-a3d04b9a3414",
      "weight": 0.5
    }
  ]
    };
    if (supportsTransparency(modelId)) {
      console.log("supportsTransparency")
      // requestBody.transparency = "foreground_only";
    }
    const { data } = await axios.post(
      `${LEONARDO_API_URL}/generations`,
      requestBody,
      { headers: HEADERS }
    );

    const generationId = data?.sdGenerationJob?.generationId;
    if (!generationId)
      throw new Error("Missing generation ID from Leonardo response.");

    console.log("✅ Generation ID:", generationId);

    const imageUrls = await pollGenerationStatus(generationId);

    console.log("✅ Images fetched:", imageUrls);

    return {
      provider: "Leonardo",
      generationId,
      imageUrl: imageUrls[0], // Return first image
    };
  } catch (err: any) {
    const error =
      err?.response?.data || err?.message || "Unknown Leonardo error";
    console.error("❌ Leonardo Error:", error);
    throw new Error("Failed to generate image with Leonardo.");
  }
};
