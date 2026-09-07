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
            console.error(err);
        }
    };

    return (
        <div className="parentClass">
            <form className="container" onSubmit = {handleSubmit}>
                <label className = "header"><strong>REGISTER</strong></label>
                { error && <p style={{ color: "red" }}><strong>Error:</strong> &nbsp; {error} </p>}
                <label htmlFor="Username">Username</label> <br />
                <input type="text" value = {username} onChange = {(e) => setUsername(e.target.value)} required />
                <br />
                <label htmlFor="Email">Email:</label> <br />
                <input type="email" name="email" placeholder="example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                <br />
                <label htmlFor="Password">Password</label> <br />
                <input type="password" name="password" placeholder="Pass@123" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
                <br />
                <button className="clickMe" type="submit" disabled = {submitting}>{ submitting? "Registering in...": "Register"}</button>
                <br />
                <Link className="link" to="/login">Login</Link>
                <br />
                <Link className="link" to="/chat">Skip Login?</Link>
            </form>
        </div>
    );
};

export default Register;