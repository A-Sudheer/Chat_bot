import {memo} from "react";

const MessageBubble = ({message}) => {
    return (
        <div
            style = {{
                display: "flex",
                justifyContent: message.role==="user"? "flex-end" : "flex-start",
                marginBottom: "12px"
            }}>
            <div
            style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: "12px",
                lineHeight: "1.4",
                backgroundColor: message.role==="user"? "#007bff" : "#88e369",
                color: message.role==="user"? "#fff" : "#005"
            }}
            >
            <strong>{message.role==="user"?"You : " : "Gemini : "}</strong>
            {message.text}
            </div>
        </div>
    )
};

export default memo(MessageBubble);