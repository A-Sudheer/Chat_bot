import express from "express";
import { sendMessage, getSession, getUserSessions, clearHistory } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();
router.post("/chat", optionalAuth, sendMessage);
router.post("/chat/:sessionId", optionalAuth, sendMessage);
router.get("/chat/:sessionId", getSession);
router.get("/sessions", authMiddleware, getUserSessions);
router.delete("/clear/:sessionId/history", clearHistory);

export default router;