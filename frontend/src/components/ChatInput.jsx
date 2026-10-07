import { Send } from "lucide-react";
import { useRef } from "react";
import "../styling/ChatInput.css";

const ChatInput = ({ sendMessage, loading }) => {
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = inputRef.current.value.trim();
        if (!text) return;
        sendMessage(text);
        inputRef.current.value = "";
    };

    return (
        <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
                className="chat-input-field"
                type="text"
                name="message"
                ref={inputRef}
                disabled={loading}
                placeholder="Type your message..."
            />
            <button className="chat-send-btn" type="submit" disabled={loading}>
                <Send size={18} />
            </button>
        </form>
    );
};

export default ChatInput;