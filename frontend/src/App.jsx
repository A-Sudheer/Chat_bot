import useChat from "./hooks/useChat";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  const { messages, loading, sendMessage, clearHistory } = useChat();

  return (
    <div style={{ backgroundColor: "#339",color: "rgb(191, 198, 255)", maxWidth: "600px", margin: "0 auto", padding: "20px", fontfamily: "times-new-roman" }}>
      <h1>Enter Your Thoughts Here.<br></br> I will Guide with All the Knowledge I have</h1>
      <ChatWindow messages = {messages} />
      <ChatInput sendMessage = {sendMessage} loading = {loading} />
      <br />
      <button onClick={clearHistory} style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer", textDecoration: "underline"}}>Clear History</button>
    </div>
  )
}

export default App;