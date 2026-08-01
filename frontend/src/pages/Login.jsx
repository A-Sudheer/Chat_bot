import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [ error, setError ] = useState("");
    const [ submitting, setSubmitting ] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const guestSessionId = localStorage.getItem( "sessionId" );
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, pwd, guestSessionId })
            });

            const data = await res.json();
            if(!res.ok) {
                setError(data.message || "Login failed" );
                setSubmitting(false);
                return ;
            }
            login(data.user, data.token);
            navigate("/chat");
            localStorage.removeItem( "sessionId" );
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            { error && <p style={{ color: "red" }}> {error} </p>}
            <label htmlFor="Email">Email:</label>
            <input type="email" name="email" placeholder="example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />
            <br />
            <label htmlFor="Password">Password</label>
            <input type="password" name="password" placeholder="Pass@123" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
            <br />
            <button type="submit" disabled = {submitting}>{ submitting? "Logging in...": "Login"}</button>
            <br />
            <Link to="/register">Register</Link>
            <br />
            <Link to="/chat">Skip Login?</Link>
        </form>
    );
}

export default Login;