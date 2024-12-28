const express=require('express');
const router=express.Router();
const {userSignUp, userSignIn, refreshAccessToken,logout,getUser}=require('../controllers/userAuth')
const userAuth=require('../middlewares/auth')

//[**Log In**]

router.post('/signup', userSignUp);
router.post('/signin', userSignIn);
router.get('/getuser',userAuth,getUser)
router.get('/refresh',refreshAccessToken)
router.post('/logout',logout)

module.exports=router