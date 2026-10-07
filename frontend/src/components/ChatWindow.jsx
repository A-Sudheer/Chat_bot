import MessageBubble from "./MessageBubble";
import useChat from "../hooks/useChat.js";
import ChatInput from "./ChatInput.jsx";
import "../styling/ChatWindow.css";

const ChatWindow = ({ sessionId }) => {
    const { messages, sendMessage, loading } = useChat(sessionId);
    const isEmpty = messages.length === 0;
    return (
        <div className="chat-window">
            <div className={`chat-messages ${isEmpty ? "is-empty" : ""}`}>
                {isEmpty ? (
                    <p className="chat-empty">
                        Ask me anything! Your conversation history will display here.
                    </p>
                ) : (
                    messages.map((m, idx) => <MessageBubble key={idx} message={m} />)
                )}
            </div>
            <ChatInput sendMessage={sendMessage} loading={loading} />
        </div>
    );
};

export default ChatWindow;