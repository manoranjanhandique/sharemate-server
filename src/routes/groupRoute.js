const express=require('express');
const router=express.Router();
const {group}=require("../controllers/groupController")
const userAuth=require('../middlewares/auth') 

router.post('/create-group',group)

module.exports=router