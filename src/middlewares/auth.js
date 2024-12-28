const jwt=require('jsonwebtoken');
const User = require("../models/users");

const userAuth=async (req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const decodeObj= await jwt.verify(token,"mysecreatetoken")
        const {_id }=decodeObj;
        const user= await User.findById(_id);
        if(!user){
            return res.status(401).json({message:"User Not Found!"});
        }

        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}
module.exports=userAuth;