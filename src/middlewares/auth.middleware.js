import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { AsyncHandler } from "../utils/async-handler.js";


export const verifyUser = AsyncHandler(async(req,res,next)=>{

    //get accessToken from the header of the request//

    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");

    if (!accessToken) {
        throw new ApiError(401,"unauthorized request")
    }

    try {
        
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

        const theUser = await User.findById(decoded?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExp")

        if (!theUser) {
            throw new ApiError(401 , "user is not present || invalid accessToken")
        }

        req.user = theUser //giving the next middleware/controller about who was the user was//
        next()

    } catch (error) {
        throw new ApiError(401 , "invalid accessToken");
    }

})
