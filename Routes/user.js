const userCtrl = require('../controllers/userCtrl')
const multerConfig = require('../middleware/multer')
const authcheck = require('../middleware/authCheck')
const isAdminCheck = require('../middleware/isAdmin')
const express = require('express');
const router = express.Router();
const passport = require('passport')
const passportConfig = require("../passport");

// Open Your Profile
router.get("/profile", authcheck, userCtrl.profile);

// Authentiction User "Sign In"
router.post('/authuser', userCtrl.logIn);

// Register New User
router.post('/register', multerConfig, userCtrl.rgister);

// Register New User by Google
router.post(
    "/Oauth/google",
    passport.authenticate("googleToken", { session: false }),
    userCtrl.Oauth
);

// Register New User by Facebook
router.post(
    "/Oauth/facebook",
    passport.authenticate("facebookToken", { session: false }),
    userCtrl.Oauth
);

// Change your Password
router.post("/changePassword", authcheck, userCtrl.changePassword);

// Send Code Verify
router.post("/sendCode", userCtrl.sendCode);

// Code Verifing
router.post("/verifyCode", userCtrl.codeVerifing);

// Forget Your Password
router.post("/forgetPassword", userCtrl.forgetPassword);

// Edit Profile (Update)
router.put("/edit",  authcheck, multerConfig, userCtrl.editProfile);

// Delete Account
router.delete("/delete", authcheck, isAdminCheck, userCtrl.deleteAccount);


module.exports = router; 