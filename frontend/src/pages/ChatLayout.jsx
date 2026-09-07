import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import {useState} from "react";

const ChatLayout = () => {
    const { sessionId } = useParams();
    const { user, loading } = useAuth();
    const [ view, setView ] = useState(false);
    if (loading) return null;
    return (
        <div style = {{ display: "flex", justifyContent: "center" }}>
            <button onClick = {() => setView(!view)}>{ view? "Hide Chats": "Show Chats"}</button>
            { user && view && <Sidebar />}
            <ChatWindow sessionId = { sessionId } />
        </div>
    );
};

export default ChatLayout;