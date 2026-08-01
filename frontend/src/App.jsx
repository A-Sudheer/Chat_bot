import { Routes, Route } from "react-router-dom";
import ChatLayout from "./pages/ChatLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const App = () => {

  return (
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/login" element = { <Login /> } />
      <Route path = "/register" element = { <Register /> } />
      <Route path = "/chat" element = { <ChatLayout /> } />
      <Route path = "/chat/:sessionId" element = { <ChatLayout /> } />
    </Routes>
  )
}

export default App;