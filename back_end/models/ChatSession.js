import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
    role: {type: String, required: true, enum: ["user", "model"]},
    text: {type: String, required: true}
})

const ChatSessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true,
        index: true
    },
    history: [ChatSchema]
}, {timestamps: true});

export default mongoose.model("ChatSession", ChatSessionSchema);