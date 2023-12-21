const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
const {options} = require('../utils/constants');


const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong while generating refresh and access token");
    }
}

const registerUser = async (req, res) => {

    const {email, username, password } = req.body;

    if (
        [email, username, password].some((field) => field?.trim() === "")
    ) {
        return res.status(400).json({success:false, message:"All fields are required",data:null}); 
    }

    try {
        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })
    
        if (existedUser) {
            return res.status(409).json({success:false, message:"User is already registered with given name or email, kindly login",data:null});
        }
    
        const user = await User.create({
            email, 
            password,
            username: username.toLowerCase()
        });
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );
    
        if (!createdUser) {
            return res.status(500).json({success:false, message:"Something went wrong while registering the user",data:null});
        }
    
        return res
            .status(201)
            .json({
                success:true,
                message:"User registration successful",
                data:createdUser
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error while registering user", data:null});
    }

}

const loginUser = async (req, res) =>{
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, message:"Email and Password are required", data:null});
    }

    try {
        const user = await User.findOne({
            $or: [{email}]
        });
    
        if (!user) {
            return res.status(404).json({success: false, message:"User does not exist", data:null});
        }
    
       const isPasswordValid = await user.isPasswordCorrect(password)
    
       if (!isPasswordValid) {
        return res.status(401).json({success: false, message:"Invalid user credentials", data:null});
        }
    
       const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true, 
            message:"User logged in successfully", 
            data:loggedInUser,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error while logging user", data:null});
    }
}

const logoutUser = async(req, res) => {
    try {

        const user = req.user;
        if(!user || !user._id){
            return res.status(401).json({success:false, message:"User not authenticated",data:null});
        }

        const loggedOutUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success:true,
            data: loggedOutUser,
            message: "User logged Out"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error logging out user", data:null});
    }
}

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({success: false, message:"Unauthorized Request", data:null});
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            return res.status(401).json({success: false, message:"Invalid refresh token", data:null});
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({success: false, message:"Refresh token is expired", data:null});
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            success:true,
            data:{accessToken, refreshToken:newRefreshToken},
            message:"Refresh token generated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Invalid refresh token", data:null});
    }

}

const getCurrentUser = async(req, res) => {
    return res
    .status(200)
    .json({
        success: true,
        data: req.user,
        message:"User fetched successfully"
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
}