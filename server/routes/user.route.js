const router = require('express').Router();
const { 
    loginUser, 
    logoutUser, 
    registerUser,
    getCurrentUser
} = require("../controllers/user.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,  logoutUser);
router.route("/get-user").get(verifyJWT,  getCurrentUser);

module.exports = router;