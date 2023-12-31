
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');

const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({success:false, message:"Unauthorized request",data:null});
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return res.status(401).json({success:false, message:"Invalid Access Token",data:null}); 
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error - verifyJwt",data:null});
    }
}

module.exports = {
    verifyJWT
};