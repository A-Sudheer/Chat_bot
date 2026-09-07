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
        <div>
            <h2 className="heading">Welcome to the Login Page</h2>
            <br />
            <div className="parentClass">
                <form className="container" onSubmit={handleSubmit}>
                    <label className="header"><strong>LOG IN</strong></label>
                    { error && <p style={{ color: "red" }}><strong>Error:</strong> &nbsp; {error} </p>}
                    <br />
                    <label htmlFor="Email">Email:</label> <br />
                    <input type="email" name="email" placeholder="example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                    <br />
                    <label htmlFor="Password">Password</label> <br />
                    <input type="password" name="password" placeholder="Pass@123" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
                    <br />
                    <button type="submit" className="clickMe" disabled = {submitting}>{ submitting? "Logging in...": "Login"}</button>
                    <br />
                    <Link to="/register" className="link">Register</Link>
                    <br />
                    <Link to="/chat" className="link">Skip Login?</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;