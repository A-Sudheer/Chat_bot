import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

const ChatLayout = () => {
    const { sessionId } = useParams();
    const { user, loading } = useAuth();
    if (loading) return null;
    return (
        <div style = {{ display: "flex" }}>
            { user && <Sidebar /> }
            <ChatWindow sessionId = { sessionId } />
        </div>
    );
};

export default ChatLayout;