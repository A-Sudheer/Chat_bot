import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        }
    };

    return (
        <form onSubmit = {handleSubmit}>
            <h2>Register</h2>
            { error && <p style={{ color: "red" }}> {error} </p>}
            <label htmlFor="Username">Username</label>
            <input type="text" value = {username} onChange = {(e) => setUsername(e.target.value)} required />
            <br />
            <label htmlFor="Email">Email:</label>
            <input type="email" name="email" placeholder="example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />
            <br />
            <label htmlFor="Password">Password</label>
            <input type="password" name="password" placeholder="Pass@123" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
            <br />
            <button type="submit" disabled = {submitting}>{ submitting? "Logging in...": "Login"}</button>
            <br />
            <Link to="/login">Login</Link>
            <br />
            <Link to="/chat">Skip Login?</Link>
        </form>
    );
};

export default Register;