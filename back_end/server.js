const express = require("express");
const cors = require("cors");
const {GoogleGenAI} = require("@google/genai");
require("dotenv").config();

const app = express();
const geminiBot = new GoogleGenAI({});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.send(`
        <h1>This is Home Page</h1>
        <br>
        <form method="POST" action="/chat">
            <p>Enter your PROMPT here: </p>
            <br>
            <input type="text" name = "message">
            <button type = "submit"> ⬆️ </button>
        </form>
    `);
})

app.post("/chat",async (req,res)=>{
    try {
        const userQuery = req.body.message;
        if (!userQuery){
            return res.status(400).json({error : "Message is required"});
        }
        const response = await geminiBot.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: "This AI is always at your service."
            }
        });

        const aiResponse = response.text;

        res.send(`${aiResponse}`);

        // res.json({reply: aiResponse });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("An error occured while talking to Gemini.");
    }
});

app.listen(3000,()=> console.log("Server is now running at http://localhost:3000"));