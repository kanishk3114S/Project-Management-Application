import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { AsyncHandler } from "../utils/async-handler.js"
import { emailVerificationMailGen, forgotPassMailGen, sendEmail } from "../utils/mail.util.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"

//because of assync handler we dont want to wrtie the try-catch every time//

/*
Js destructing ----> instead of const email = req.body.email ,
const username = req.body.username , 
const password = req.body.password 

we normally write cosnt {username , email , role , password} = req.body

*/

//"User" is the mongoose utility//

const genAccessAndRefreshToken = async (userId) => { //means we have userId of the user registered in the mongoDb
    try {
        const theUser = await User.findById(userId); //we go the same user by querying our db to get the id//
        const accessToken = theUser.generateAccessToken()
        const RefreshToken = theUser.generateRefreshToken()

        theUser.refreshToken = RefreshToken;
        await theUser.save({ validateBeforeSave : false});
            return {accessToken , refreshToken: RefreshToken};

    } catch (error) {
        throw new ApiError(
            500 , 
            "Something went wrong while generating the access token",
        );
    };
}

const registerUser = AsyncHandler(async(req,res)=>{
    // console.log(req.body);
    const {email , username , password , role} = req.body

   const existingUser = await User.findOne({ //because database is always in another continent..//
        $or : [{username} , {email}]
    })

    if(existingUser) {
        throw new ApiError(409 , "User with this email/username already exists" , []);
    }

    const theUser = await User.create({ //create the user  -- DB operation//
        email , 
        password , 
        username , 
        isEmailVerified : false,
    })

    const {unHashedToken , hashedToken , tokenExpiry} = theUser.generateTempToken(); //we haave generated the temp token for the user that we have just registered//

    //fill the remaining two fields//

    theUser.emailVerificationExp = tokenExpiry;
    theUser.emailVerificationToken = hashedToken;

    await theUser.save({ validateBeforeSave: false });

    await sendEmail({
        email: theUser?.email,
        subject: "Please verify your email",
        mailGenContent : emailVerificationMailGen(
            theUser.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    })

    const createdUser = await User.findById(theUser._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExp")

    if (!createdUser) {
        throw new ApiError(500,"Sommething went wrong while registering a user")
    }

    //now send the responce back to the user//

    return res.status(201).json(
        new ApiResponse(
            200,
            {user: createdUser},
            "User Registered successfully and verification email has been sent on your email",
        )
    )
})

const newAccessAndRefreshToken = AsyncHandler(async(req,res)=>{

    //we have taken the existing refreshToken//

    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken 

    if (!refreshToken) {
        throw new ApiError(401 , "Refresh token is missing")
    }

    //founded the User with that existingRefreshToken//

    const theUser = await User.findOne({refreshToken});

    if (!theUser) {
        throw new ApiError(401 , "Refresh token is invalid")
    }

    try {

        //decoded contains the refreshToken//

        const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded?._id)

        if (!user) {
            throw new ApiError(401 , "user is invalid")
        }

        if (user.refreshToken !== refreshToken) {
            throw new ApiError(401 , "Refresh token is invalid")
        }

        const {accessToken , refreshToken: newRefreshToken} = await genAccessAndRefreshToken(user._id);

        //assign the new refresh and accessToken send to cookies and save the refresh token in the user Model itself//

        user.refreshToken = newRefreshToken;
        user.accessToken = accessToken;

        await user.save({validateBeforeSave : false});

        const options = {
            httpOnly : true,
            secure : true, sameSite: "none"
        }
            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .json(
                    new ApiResponse(
                        200,
                        {
                            accessToken,
                            refreshToken: newRefreshToken
                        },
                        "New access and refresh token has been generated successfully"
                    )
                )

    } catch (error) {
        throw new ApiError(401 , "Refresh token is invalid")
    }

})

const Login = AsyncHandler(async(req,res)=>{
    const {email , username , password} = req.body; //take only these 3 paramters from the req//

    if (!email && !username) { //if we found email/username not-valid just throw the error//
        throw new ApiError(400 , "Please enter email or username")
    }

    const user = await User.findOne({
        $or: [{ email: email || "" }, { username: username || "" }]
    });

    if(!user) {
        throw new ApiError(400 , "User not found");       
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400 , "Invalid credentials");
    }

    const {accessToken , refreshToken} = await genAccessAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExp")

    //creating a option-opbejct//

    const options = { //create the secure cookies//
        httpOnly : true,
        secure : true, sameSite: "none"
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(
            200 , 
            {
                user : loggedinUser,
                accessToken,
                refreshToken
            },
            "User Logged in successfully"
        )
    )
})

const Logout = AsyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(req.user._id , {

        $set: {
            refreshToken: ""
        }

    }, {
        new: true
    });

    const options = {
        httpOnly : true,
        secure : true, sameSite: "none"
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "user logged out"))


})


/* /GET/currentUser */

const currUser = AsyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200, {user: req.user}, "Current user fetched successfully")
    )
})

const verifyEmail = AsyncHandler(async(req,res)=>{

    const {verificationToken} = req.params;

    if (!verificationToken) {
        throw new ApiError(400 , "Email verification token is missing")
    }

    let hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExp: {$gt: Date.now()}
    })

    if (!user) {
        throw new ApiError(400, "Invalid verification token or token expired");
    }

    //cleanUp//

    user.emailVerificationExp = undefined
    user.emailVerificationToken = undefined

    user.isEmailVerified = true;

    await user.save({validateBeforeSave : false});

    //user ko find karo phir use save kardo//

    return res.status(200).json(
        new ApiResponse(200 , {} , "email is being verified")
    )

})


const resendVerificationEmail = AsyncHandler(async(req,res)=>{

    //giving user the new token so that he can verify his email//

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404 , "user not found");
    }  

    const {unHashedToken , hashedToken , tokenExpiry} = user.generateTempToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExp = tokenExpiry;

    await user.save({validateBeforeSave : false});

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailGenContent : emailVerificationMailGen(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    })

    return res.status(200).json(
        new ApiResponse(200 , {} , "Verification email has been sent successfully")
    )

})

export const forgotPasswordRequest = AsyncHandler(async(req,res)=>{

    const {email} = req.body;

    if (!email) { //email is not there in the body
        throw new ApiError(401 , "the email is not valid , change ur email and try again")
    }
    const user = await User.findOne({
        email: email
    })

    if (!user) {
        throw new ApiError(404 , "user does not exist" , [])
    }   

    const {unHashedToken , hashedToken , tokenExpiry} = user.generateTempToken(); //model utility that's why we are calling this with 

    user.forgotPasswordToken = hashedToken;
    user.forgotPassExp = tokenExpiry;

    await user.save({validateBeforeSave : false});

    await sendEmail({
        email: user?.email,
        subject: "Password Reset Request",
        mailGenContent : forgotPassMailGen(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL || "http://localhost:3000/forgot-password"}/${unHashedToken}`,
        ),  
    });

    return res.status(200).json(
        new ApiResponse(200 , {} , "Password resent mail has been sent on your email")
    )
    

})

export const resetForgotPassword = AsyncHandler(async(req,res)=>{

    //that means user in the database but it got logged out .... so the user is requesting for the resetForgotPassword//
    //first the ForgotPasswordRequest came------> gave him the token of the forgotPassword//
    //now we recieve the token (from the forgotpassreq) + email via this request ...//

    const {resetToken} = req.params
    const {newPassword} = req.body

    if (!resetToken) {
        throw new ApiError(401 , "input field is Invalid")
    }

    //hashedToken is the token u just stored via previous request and fetching by confirming it//

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    const user = await User.findOne({
        forgotPasswordToken : hashedToken,
        forgotPassExp : {$gt : Date.now()}
    })

    if (!user) {
        throw new ApiError(403 , "user is not found or token has expired")
    }

    user.forgotPassExp = undefined;
    user.forgotPasswordToken = undefined;

    //tokens arre removd ... obv//

    user.password = newPassword //our preHook will hash it instantly so no worries about 

    await user.save()

    return res.status(200).json(
        new ApiResponse(
            200 , {} , "Password reset successfully"
        )
    )




})

export const changeCurrentPassword = AsyncHandler(async(req,res)=>{

    const {oldPassword , newPassword} = req.body

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(401 , "user not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400 , "Invalid old password")
    }

    if (oldPassword === newPassword) {
        throw new ApiError(401 , "new password can not be equal to the old password")
    }

    user.password = newPassword
    await user.save()

    return res.status(200).json(
        new ApiResponse(200 , {} , "the user password has been changed successfully")
    )

})





export {registerUser , Login , Logout , currUser , verifyEmail , resendVerificationEmail , newAccessAndRefreshToken};

export const updateAccountDetails = AsyncHandler(async(req, res) => {
    const { fullName, username } = req.body;
    
    if (!fullName && !username) {
        throw new ApiError(400, "Please provide fullName or username to update");
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (fullName) {
        user.fullName = fullName;
    }
    
    if (username) {
        const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
        if (existingUser) {
            throw new ApiError(409, "Username is already taken");
        }
        user.username = username;
    }

    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExp");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Account details updated successfully")
    );
});

export const getAllUsers = AsyncHandler(async(req, res) => {
    // Fetch all users to populate dropdowns, excluding sensitive information
    const users = await User.find({}).select("_id username fullName email avatar");
    
    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
});
