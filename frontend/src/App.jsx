import {useState} from 'react';
import {Send} from "lucide-react"

const App = () => {
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setLoading(true);
    const newMessages = [...messages,{role: "user", text: userQuery}];
    setMessages(newMessages);
    const currentQuery = userQuery;
    setUserQuery("");
    try {
      const res = await fetch("http://localhost:3000/chat",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: currentQuery})
      });

      const reply = await res.text();

      setMessages([...newMessages,{role: "model", text: reply}]);

    } catch (error) {
      console.error(error.message);
      setMessages([...newMessages,{role: "model", text:"An error occured while connecting to the server."}]);
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

  return (
    <div style={{ backgroundColor: "#339",color: "rgb(191, 198, 255)", maxWidth: "600px", margin: "0 auto", padding: "20px", fontfamily: "times-new-roman" }}>
      <h1>Enter Your Thoughts Here.<br></br> I will Guide with All the Knowledge I have</h1>
      <div style={{
        border: "1px solid #222",
        borderRadius: "8px",
        padding: "15px",
        height: "400px",
        overflowY: "auto",
        backgroundColor: "#4259bc",
        marginBottom: "20px"
      }}>
        { messages.length===0?(
          <p style={{
            color: "#888",
            textAlign: "center",
            marginTop: "170px"
          }}>Ask me anything! Your conversation history will display here.</p>
        ):(
          messages.map((m,idx)=>(
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: m.role==="user" ? "flex-end" : "flex-start",
                marginBottom: "12px"
              }}
            >
              <div style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: "12px",
                lineHeight: "1.4",
                backgroundColor: m.role==="user" ? "#007bff" : "#88e369",
                color: m.role==="user" ? "#fff" : "#005"
              }}>
                <strong>{m.role==="user" ? "You : ": "Gemini: "}</strong>
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="message"
          value={userQuery}
          onChange= {(e)=> setUserQuery(e.target.value)}
          disabled = {loading}
          style={{
            fontSize: "20px",
            width: "75%",
            height: "50px",
            borderRadius: "30px"
          }} />
        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          style={{
            marginLeft: "5px",
            padding: "10px 20px",
            fontSize: "20px",
            backgroundColor: "#8cef23",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        ><Send size = {18} /></button>
      </form>
      <br />
      <button onClick={clearHistory} style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer", textDecoration: "underline"}}>Clear History</button>
    </div>
  )
}

export default App;