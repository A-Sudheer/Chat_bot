import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styling/Login.css";

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
                body: JSON.stringify({ email, password: pwd, guestSessionId })
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
        <div className="login-page">
            <h2 className="login-heading">Welcome to the Login Page</h2>
            <form className="login-card" onSubmit={handleSubmit}>
                <span className="login-title">LOG IN</span>
                {error && (
                    <p className="login-error">
                        <strong>Error:</strong> {error}
                    </p>
                )}
                <div className="login-field">
                    <label className="login-label" htmlFor="email">Email</label>
                    <input
                        className="login-input"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="login-field">
                    <label className="login-label" htmlFor="password">Password</label>
                    <input
                        className="login-input"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Pass@123"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-btn" disabled={submitting}>
                    {submitting ? "Logging in..." : "Login"}
                </button>
                <div className="login-links">
                    <Link to="/register" className="login-link">Register</Link>
                    <Link to="/chat" className="login-link">Skip Login?</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;