import dotenv from "dotenv"
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

app.listen(3000,()=> console.log("Server is now running at http://localhost:3000"));