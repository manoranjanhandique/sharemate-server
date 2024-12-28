const User=require("../models/users");
const Group=require("../models/groups")
const group=async (req,res)=>{
    try {
        const {groupname, groupdetails, email}=req.body
        const members=[]
        let user=await User.findOne({email});
        if(!user){
            return res.status(404).json({ message: `User with email ${email} not found` });
        }
        members.push({
            userId: user._id, 
            balance: 0, 
        })
    
        const newGroup = new Group({
            group_name:groupname,
            group_details:groupdetails,
            members:members,
          });
      
          // Save the new group to the database
          await newGroup.save();
      
          // Return the created group data
          res.status(201).json(newGroup);
    
    
    } catch (error) {
        console.log(error)
        res.json(error.message)
    }

}
module.exports={group}