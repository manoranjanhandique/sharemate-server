const mongoose=require("mongoose");
const MONGODB_URL="mongodb://127.0.0.1:27017/sharemate"

const connectDB=async()=>{
    await mongoose.connect(MONGODB_URL)
}

module.exports=connectDB;

