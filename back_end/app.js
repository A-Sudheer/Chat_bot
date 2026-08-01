import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import path from "path"
import connectDB from "./config/db.js"
import chatRoutes from "./routes/chatRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("./", "public")));
app.use("/api", chatRoutes);

export default app;