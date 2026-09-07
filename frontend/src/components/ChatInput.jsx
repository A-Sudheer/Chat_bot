import {Send} from "lucide-react";
import {useRef} from "react";

const ChatInput = ({sendMessage, loading}) => {
    const inputRef = useRef(null);
    const handleSubmit = (e) => {
      e.preventDefault();
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
    return (
        <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="message"
          ref={inputRef}
          disabled = {loading}
          style={{
            fontSize: "20px",
            width: "82.5%",
            height: "50px",
            borderRadius: "30px"
          }} />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginLeft: "5px",
            padding: "10px 20px",
            fontSize: "20px",
            backgroundColor: "#8cef23",
            borderRadius: "50%",
            cursor: "pointer"
          }}
        ><Send size = {18} /></button>
      </form>
    )
}

export default ChatInput;