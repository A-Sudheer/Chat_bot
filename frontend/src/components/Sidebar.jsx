import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
    const [ sessions, setSessions ] = useState([]);
    const [ view, setView ] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/sessions",{
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                setSessions(data);
            } catch (err) {
                console.error("Failed to load sessions", err);
            }
        };

        if (token) fetchSessions();
    },[token]);

    return (
        <div style = {{ width: "200px", borderRight: "1px solid #ccc" }}>
            <button className="clickMe" onClick = {() => navigate("/chat")}> New Chat</button>
            <h3>Your Chats</h3>
            { sessions.map((s) => (
                <div
                    key = {s.sessionId}
                    onClick = {()=> navigate(`/chat/${s.sessionId}`)}
                    style = {{ cursor: 'pointer', padding: "8px" }}
                >
                    {s.history?.[0]?.text?.slice(0,30) || "New Chat" }
                </div>
            ))}
        </div>
    );
};

export default Sidebar;