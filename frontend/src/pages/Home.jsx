import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to HOME page !!</h1>
            <button onClick = { () => navigate("/login") }>Login</button>
            <button onClick = { () => navigate("/register") }>Register</button>
            <button onClick = { () => navigate("/chat") }>Continue as Guest</button>
        </div>
    )
};

export default Home;