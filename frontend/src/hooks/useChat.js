import {useState} from "react"

const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async(queryText) => {
        if (!queryText.trim()) return;
        setLoading(true);
        const newMessages = [...messages, {role: "user", text: queryText }];
        setMessages(newMessages);
        try {
            const res = await fetch("http://localhost:3000/chat",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: queryText})
            });

            const reply = await res.json().reply;
            setMessages([...newMessages, {role: "model", text: reply }]);

        } catch (error) {
            console.error(error.message);
            setMessages([...newMessages,{role: "model", text:"An error occurred while connecting to the server."}]);
        } finally {
            setLoading(false);
        }
    }

    const clearHistory = async() => {
        try {
            const res = await fetch("http://localhost:3000/clear",{
                method: "POST"
            });
            
            const msg = await res.text();

            setMessages([]);
        } catch (error) {
            console.error(error.message);
            alert("Failed to clear History.");
        }
    }

    return {
        messages, loading, sendMessage, clearHistory
    }
}

export default useChat;