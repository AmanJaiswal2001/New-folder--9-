const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../Controller/users.js");

router.route("/signup")

.get(userController.sign)
.post( 
    wrapasync (userController.signUp));


router.route("/login")
.get(userController.loginForm)

.post(
    
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
  userController.login); 

// router.get("/signup",userController.sign);

// router.post("/signup" ,
//     wrapasync (userController.signUp));

// router.get("/login",userController.loginForm);
// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect:"/login",
//         failureFlash:true,
//     }),
//   userController.login); 

//logout//
router.get("/logout", userController.logout);

module.exports=router;