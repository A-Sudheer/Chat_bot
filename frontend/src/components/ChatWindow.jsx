import MessageBubble from "./MessageBubble";
import useChat from "../hooks/useChat.js";
import ChatInput from "./ChatInput.jsx";

const ChatWindow = ({ sessionId }) => {

    const { messages, sendMessage, loading } = useChat(sessionId);
    return (
        <div>
            <div style={{
                border: "1px solid #222",
                borderRadius: "8px",
                padding: "15px",
                height: "400px",
                overflowY: "auto",
                backgroundColor: "#4259bc",
                marginBottom: "20px"
            }}>
                {messages.length===0? (
                    <p style={{
                        color: "#888",
                        textAlign: "center",
                        marginTop: "170px"
                    }}>Ask me anything! Your conversation history will display here.</p>
                ) : (
                    messages.map((m,idx) => <MessageBubble key ={idx} message = {m} />)
                )
                }
            </div>
            <ChatInput sendMessage = {sendMessage} loading = {loading} />
        </div>
    );
};

export default ChatWindow;