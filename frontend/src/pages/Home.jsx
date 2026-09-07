import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="parentClass">
            <div className="container">
                <h1>Welcome to HOME page !!</h1>
                <button className="clickMe"  onClick = { () => navigate("/login") }>Login</button> <br />
                <button className="clickMe" onClick = { () => navigate("/register") }>Register</button> <br />
                <button className="clickMe" onClick = { () => navigate("/chat") }>Continue as Guest</button> <br />
            </div>
        </div>
    )
};

export default Home;