// socket.ts
import { Server, Socket } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.emit("botMessage", "Welcome to Teemeup!");

    socket.on("sendIdea", (idea: string) => {
      console.log("📥 Received idea:", idea);
      socket.emit("botMessage", `That's an awesome idea! Want me to refine it or generate an image?`);
    });

    socket.on("refineIdea", (idea: string) => {
      console.log("🔁 Refining idea:", idea);
      socket.emit("botMessage", `Here's a refined version of: ${idea}`);
    });

    socket.on("generateImage", (idea: string) => {
      console.log("🖼 Generating image for:", idea);
      const mockImageUrl = `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(idea)}`;
      socket.emit("imageGenerated", mockImageUrl);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
