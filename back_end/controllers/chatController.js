import ChatSession from "../models/ChatSession.js";
import geminiBot from "../config/geminiBot.js";

const sendMessage = async (req, res) => {
    try {
        const userQuery = req.body.message;
        if(!userQuery) return res.status(400).json({error: "Message is required"});

        let session = await ChatSession.findOne({sessionId: "default-guest-user"});
        if(!session) session = new ChatSession({sessionId: "default-guest-user", history: []});

        session.history.push({ role: "user", text: userQuery });

        const geminiHistoryPayload = session.history.map( i => ({ role: i.role, parts: [{ text: i.text }]}));

        const response = await geminiBot.models.generateContent({
            model: "gemini-2.5-flash",
            content: geminiHistoryPayload,
            config: {systemInstruction: "This AI is always at your service. Be brief and contextual."}
        });

        const aiResponse = response.text;
        session.history.push({role: "model", text: aiResponse });
        await session.save();

        res.send(`${aiResponse}`);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("An error occurred while talking to Gemini.");
    }
};

const clearHistory = async (req, res) => {
    try{
        await ChatSession.findOneAndUpdate(
            { sessionId: "default-guest-user" },
            { $set: {history: [] } }
        );
        res.send("Chat history cleared successfully.");
    } catch (error) {
        console.error("Error occurred while clearing the data.", error.message);
        res.status(505).send("Failed to clear the history from the database.");
    }
};

export { sendMessage, clearHistory };