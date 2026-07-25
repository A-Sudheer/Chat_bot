import mongoose from "mongoose";

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully.");
    } catch (e) {
        console.error("An error occurred while connecting to the database.",e.message);
    }
};

export default connectDB;