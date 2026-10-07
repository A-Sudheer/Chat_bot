import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styling/Sidebar.css";

const Sidebar = () => {
    const [ sessions, setSessions ] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();
    const { sessionId } = useParams();

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
        <div className="sidebar">
            <button className="clickMe" onClick = {() => navigate("/chat")}> New Chat</button>
            <h3 className="sidebar-title">Your Chats</h3>
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