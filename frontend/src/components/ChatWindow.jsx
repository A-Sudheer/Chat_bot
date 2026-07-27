import MessageBubble from "./MessageBubble";

const ChatWindow = ({messages}) => {
    return (
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
    )
};

export default ChatWindow;