const express=require('express');
const router=express.Router();
const {group, getGroupDetails, addMembers,closedGroup}=require("../controllers/groupController")
const userAuth=require('../middlewares/auth') 

router.post('/create-group',userAuth,group);
router.get('/get-group-list',userAuth,getGroupDetails)
router.patch('/add-members/:id',userAuth,addMembers)
router.patch('/close-group/:id',userAuth,closedGroup)


module.exports=router