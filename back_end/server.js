const express = require("express");
const cors = require("cors");
const {GoogleGenAI} = require("@google/genai");
require("dotenv").config();

const app = express();
const geminiBot = new GoogleGenAI({});

const chatHistory = [];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

        chatHistory.push({
            role: "user",
            parts: [{text: userQuery}]
        })
        
        const response = await geminiBot.models.generateContent({
            model: "gemini-2.5-flash",
            contents: chatHistory,
            config: {
                systemInstruction: "This AI is always at your service. Be brief and contextual."
            }
        });
        
        const aiResponse = response.text;
        
        chatHistory.push({
            role: "user",
            parts: [{text: aiResponse}]
        })

        res.send(`${aiResponse}`);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("An error occured while talking to Gemini.");
    }
});

app.post("/clear", (req,res) => {
    chatHistory = [];
    res.send("Chat history is cleared!");
})

app.listen(3000,()=> console.log("Server is now running at http://localhost:3000"));