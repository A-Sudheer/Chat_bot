import ChatSession from "../models/ChatSession.js";
import geminiBot from "../config/geminiBot.js";
import mongoose from "mongoose";

const sendMessage = async (req, res) => {
    try {
        let sessionId = req.params.sessionId;
        if(!sessionId) sessionId = new mongoose.Types.ObjectId().toString();

        const userQuery = req.body.message;
        if(!userQuery) return res.status(400).json({error: "Message is required"});

        let session = await ChatSession.findOne({sessionId});
        if(!session) session = new ChatSession({sessionId, userId: req.user?.id || null, history: []});

        session.history.push({ role: "user", text: userQuery });

        const geminiHistoryPayload = session.history.map( i => ({ role: i.role, parts: [{ text: i.text }]}));

        const response = await geminiBot.models.generateContent({
            model: "gemini-2.5-flash",
            contents: geminiHistoryPayload,
            config: {systemInstruction: "This AI is always at your service. Be brief and contextual."}
        });

        const aiResponse = response.text;
        session.history.push({role: "model", text: aiResponse });
        await session.save();

        res.status(200).json({ sessionId, reply: aiResponse });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("An error occurred while talking to Gemini.");
    }
};

const getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await ChatSession.findOne({ sessionId });
        if(!session) return res.status(404).json({ message: "Session not found" });

        res.status(200).json(session);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch session", error: err.message });
    }
}

const getUserSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const allSessions = await User.find({ userId })
            .sort({ updatedAt: -1 })
            .select("sessionId history.0 createdAt updatedAt");
        
        res.status(200).json(sessions);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user sessions", error: err.message });
    }
};

const clearHistory = async (req, res) => {
    try{
        const { sessionId } = req.params;

        const result = await ChatSession.findOneAndUpdate(
            { sessionId },
            { $set: {history: [] } }
        );

        if(result.matchedCount === 0) return res.status(404).json({ message: "Session not found" });
        res.send("Chat history cleared successfully.");
    } catch (err) {
        res.status(505).json({ message: "Failed to clear the history from the database.", error: err.message});
    }
};

export { sendMessage, getSession, getUserSessions, clearHistory };