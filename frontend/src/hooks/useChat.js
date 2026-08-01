import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const useChat = (initialSessionId) => {
    const [sessionId, setSessionId] = useState(initialSessionId || null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect( () => {
        if ( !sessionId ) {
            setMessages([]);
            return ;
        }
        const loadSession = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/chat/${sessionId}`);
                if(res.ok) {
                    const data = await res.json();
                    setMessages(data.history || []);
                } else {
                    setError("Session not found");
                }
            } catch (err) {
                setError("Failed to load session");
            } finally {
                setLoading(false);
            }
        };
        loadSession();
    }, [sessionId]);

    const sendMessage = useCallback(async(queryText) => {
        if (!queryText.trim()) return;
        setLoading(true);
        setError(null);
        const headers = {"Content-Type": "application/json"};
        const newMessages = [...messages, {role: "user", text: queryText }];
        setMessages(newMessages);
        try {
            const url = sessionId ? `/api/chat/${sessionId}` : "/api/chat";
            if (token) headers.Authorization = `Bearer ${token}`; 
            const res = await fetch(url,{
                method: "POST",
                headers,
                body: JSON.stringify({message: queryText})
            });
            if (!res.ok) throw new Error("Failed to send message");
            const data = await res.json();
            const reply = data.reply;
            setMessages([...newMessages, {role: "model", text: reply }]);
            if (!sessionId) {
                setSessionId(data.sessionId);
                navigate(`/chat/${data.sessionId}`, { replace: true });
            }
        } catch (error) {
            console.error(error.message);
            setMessages([...newMessages,{role: "model", text:"An error occurred while connecting to the server."}]);
        } finally {
            setLoading(false);
        }
    }, [sessionId, token, navigate]);

    const clearHistory = async() => {
        try {
            const res = await fetch("/clear",{
                method: "DELETE"
            });
            
            const msg = await res.text();

            setMessages([]);
        } catch (error) {
            console.error(error.message);
            alert("Failed to clear History.");
        }
    }

    return {
        messages, loading, sendMessage, clearHistory, error, sessionId
    };
};

export default useChat;