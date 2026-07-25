import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
    role: {type: String, required: true, enum: ["user", "model"]},
    text: {type: String, required: true}
})

const ChatSessionSchema = mongoose.Schema({
    sessionId: {type: String, required: true, default: "default-guest-user"},
    history: [ChatSchema]
}, {timestamps: true});

export default mongoose.model("ChatSession", ChatSessionSchema);