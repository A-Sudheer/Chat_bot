import {useState} from 'react';

const App = () => {
  const [userQuery, setUserQuery] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setLoading(true);
    setReply("Thinking...");
    try {
      const res = await fetch("http://localhost:3000/chat",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: userQuery})
      });

      const message = await res.text();

      setReply(message);
      setUserQuery("");

    } catch (error) {
      console.error(error.message);
      setReply("An error occured while connecting to the server.");
    } finally{
      setLoading(false);
    }
  }

  const clearHistory = async() => {
    setReply("Clearing History...");
    try {
      const res = await fetch("http://localhost:3000/clear",{
        method: "POST"
      });
      
      const msg = await res.text();

      setReply(msg);
    } catch (error) {
      console.error(error.message);
      setReply("Failed to clear History.")
    }
  }

  return (
    <div>
      <h1>Enter Your Thoughts Here. I will Guide with All the Knowledge I have</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" value={userQuery} onChange= {(e)=> setUserQuery(e.target.value)} disabled = {loading} />
        <button type="submit" disabled = {loading}>⬆️</button>
        <p>{!reply? "Give me something.": reply}</p>
        <button onClick={clearHistory}>Clear History</button>
      </form>
    </div>
  )
}

export default App;