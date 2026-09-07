import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import ChatSession from "../models/ChatSession.js";

const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '1d'});
};

const register = async (req,res) => {
    try{
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "Email already registered!!" });
        
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Registration failed", error: e.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password, guestSessionId } = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(401).json({ message: "Invalid Credentials" });

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(401).json({ message: "Password Incorrect" });

        if(guestSessionId) {
            await ChatSession.updateOne(
                { sessionId: guestSessionId, userId: null },
                { userId: user._id }
            );
        }

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {id: user._id, username: user.username, email: user.email }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Problem occurred while connecting to database or generating token", error: e.message});
    }
}

export { register, login };