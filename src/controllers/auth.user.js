import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { AsyncHandler } from "../utils/async-handler.js"
import { emailVerificationMailGen, sendEmail } from "../utils/mail.util.js"

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
        return {accessToken , RefreshToken};

    } catch (error) {
        throw new ApiError(
            500 , 
            "Something went wrong while generating the access token",
        );
    };
}

const registerUser = AsyncHandler(async(req,res)=>{
    console.log(req.body);
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

export {registerUser};