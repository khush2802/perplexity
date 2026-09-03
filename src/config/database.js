import mongoose from "mongoose";

const connectToDB = async()=>{
     const connect = await mongoose.connect(process.env.MONGO_URI);
     console.log(`MongoDB connected`);
}

export default connectToDB;