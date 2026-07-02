const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const {GoogleGenAI} = require("@google/genai");
require("dotenv").config();

const app = express();
const geminiBot = new GoogleGenAI({});

const chatHistory = [];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database Connected Successfully."))
.catch((e) => console.error("An error occured while connecting to the database.",e.message));

const ChatSchema = mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ["user", "model"]
    },
    text: {type: String, required: true}
});

const ChatSessionSchema = mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        default: "default-guest-user"
    },
    history: [ChatSchema]
},{timestamps: true});

const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);

app.get("/",(req,res)=>{
    res.send(`
        <h1>This is Home Page</h1>
        <br>
        <p>Enter your PROMPT here: </p>
        <br>
        <input type="text" id = "queryInput" name = "message">
        <button onclick="handleSubmit()"> ⬆️ </button>
        <button onclick="clearHistory()"> Clear History </button>
        <div id = "display"> </div>

        <script>
            const out = document.getElementById("display");

            const handleSubmit = async() => {
                out.innerHTML = "On your command. You can ask me anything. Literally ANYTHING.";

                const query = document.getElementById("queryInput").value;

                try{
                    const res = await fetch("/chat",{
                        method: "POST",
                        headers: {"Content-Type": 'application/json'},
                        body: JSON.stringify({ message: query })
                    })
                    out.innerHTML = await res.text();
                } catch(err){
                    out.innerHTML = "Sorry! An error occured while Fetching..";
                }
            }

            const clearHistory = async() => {
                out.innerHTML = "On your command..";
                const res = await fetch("/clear",{
                    method: "POST"
                })
                
                out.innerHTML = await res.text();
            }
        </script>
    `);
})

app.post("/chat",async (req,res)=>{
    try {
        const userQuery = req.body.message;
        if (!userQuery){
            return res.status(400).json({error : "Message is required"});
        }

        let session = await ChatSession.findOne({sessionId: "default-guest-user"});
        if(!session){
            session = new ChatSession({sessionId: "default-guest-user", history: []});
        }

        session.history.push({
            role: "user",
            text: userQuery
        })
        
        const geminiHistoryPayload = session.history.map(msg => ({
            role: msg.role,
            parts: [{text: msg.text}]
        }));

        const response = await geminiBot.models.generateContent({
            model: "gemini-2.5-flash",
            contents: geminiHistoryPayload,
            config: {
                systemInstruction: "This AI is always at your service. Be brief and contextual."
            }
        });
        
        const aiResponse = response.text;

        
        session.history.push({
            role: "model",
            text: aiResponse
        })

        await session.save();

        res.send(`${aiResponse}`);

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("An error occured while talking to Gemini.");
    }
});

app.post("/clear", async(req,res) => {
    try{
        await ChatSession.findOneAndUpdate(
            {sessionId: "default-guest-user"},
            {$set: { history: []}}
        );
        res.send("Chat history is cleared!");
    } catch(err){
        console.error(err.message);
        res.status(505).send("Failed to Clear the history from the database.");
    }
})

app.listen(3000,()=> console.log("Server is now running at http://localhost:3000"));