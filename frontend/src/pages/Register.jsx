import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styling/Login.css";

const Register = () => {
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ pwd, setPwd ] = useState("");
    const [ error, setError ] = useState("");
    const [ submitting, setSubmitting ] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const guestSessionId = localStorage.getItem("sessionId");
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password: pwd, guestSessionId })
            });

            const data = await res.json();
            if(!res.ok) {
                setError(data.message);
                setSubmitting(false);
                return ;
            }
            localStorage.removeItem("sessionId");
            login(data.user, data.token);
            navigate("/chat");
        } catch (err) {
            setError("Failed to Sign In. Please try again.");
            setSubmitting(false);
            console.error(err);
        }
    };

    return (
        <div className="login-page">
            <h2 className="login-heading">Create your account</h2>

            <form className="login-card" onSubmit={handleSubmit}>
                <span className="login-title">REGISTER</span>

                {error && (
                    <p className="login-error">
                        <strong>Error:</strong> {error}
                    </p>
                )}

                <div className="login-field">
                    <label className="login-label" htmlFor="username">Username</label>
                    <input
                        className="login-input"
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

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
                        placeholder="Enter your password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-btn" disabled={submitting}>
                    {submitting ? "Registering..." : "Register"}
                </button>

                <div className="login-links">
                    <Link to="/login" className="login-link">Login</Link>
                    <Link to="/chat" className="login-link">Skip Login?</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;