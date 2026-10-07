import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import {useState} from "react";
import "../styling/ChatLayout.css";

const ChatLayout = () => {
    const { sessionId } = useParams();
    const { user, loading } = useAuth();
    const [ view, setView ] = useState(false);
    if (loading) return null;
    return (
        <div className="chat-layout">
            {user && (
                <div>
                    <button className="toggle-chats-btn" onClick = {() => setView(!view)}>
                        { view? "Hide Chats": "Show Chats" }
                    </button>
                    { view && <Sidebar />}
                </div>
            )}
            <div className="chat-main">
                <ChatWindow sessionId = { sessionId } />
            </div>
        </div>
    );
};

export default ChatLayout;