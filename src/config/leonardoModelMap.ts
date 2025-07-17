// src/config/leonardoModelMap.ts

export const LEONARDO_MODEL_MAP: Record<string, { name: string; id: string }> = {
  "T-shirt designs / Branding": {
    name: "Leonardo Creative", // model name as seen in Leonardo
    id: "eab32df3-f3f7-4c54-9b71-79f8e19d9e07", // example ID from models.json
  },
  "Anime / Stylized / Fantasy Art": {
    name: "DreamShaper v7",
    id: "d1cfb6a2-0cd8-46b6-96d2-1fbc1c65e7f6",
  },
  "Photorealistic Portraits": {
    name: "Absolute Reality v1.8",
    id: "7683e45e-378f-4036-89e0-fc132cf8d5c0",
  },
  "Concept art / Abstract ideas": {
    name: "Leonardo Vision XL",
    id: "ac614f96-1082-45bf-be59-70aa4b6a4e38",
  },
  "Cute / Pastel Anime": {
    name: "DucHaiten Diffusion",
    id: "af6d1c92-2027-46e2-bb6c-8d51d2c16f1b",
  },
  "3D / Realistic Product Mockups": {
    name: "3D Animation Style",
    id: "8e1e5227-9582-46b2-bb06-3eec1a68de45",
  },
  default: {
    name: "Leonardo Creative",
    id: "eab32df3-f3f7-4c54-9b71-79f8e19d9e07",
  },
};
