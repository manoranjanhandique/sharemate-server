const express=require('express');
const router=express.Router();
const {group, getGroupDetails, addMembers}=require("../controllers/groupController")
const userAuth=require('../middlewares/auth') 

router.post('/create-group',group);
router.get('/get-group-list',userAuth,getGroupDetails)
router.patch('/add-members',userAuth,addMembers)


module.exports=router