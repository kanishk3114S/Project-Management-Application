import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";


export const verifyUser = AsyncHandler(async(req,res,next)=>{

    //get accessToken from the header of the request//

    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");

    if (!accessToken) {
        throw new ApiError(401,"unauthorized request")
    }

    try {
        
        const decoded = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET);

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

export const permissionValidator = (role = []) => {

    //expecting an array//

    return AsyncHandler(async(req,res,next)=>{
        //if any user is coming to do something with the projectId then it will bring the projectId with himself//
        const {projectId} = req.params

        if (!projectId) {
            throw new ApiError(400 , "project id is missing")
        } 

        const projectMember = await ProjectMember.findOne({
            project : new mongoose.Types.ObjectId(projectId),
            user : new mongoose.Types.ObjectId(req.user._id)
        })

        if (!projectMember) {
            throw new ApiError(403 , "You are not a member of this project")
        } 

        const givenRole = projectMember?.role

        req.user.role = givenRole

        //basically we will pass this middleware with some role and if the dbRole != givenRole then we will throw an error that this is not valid//

        if (!role.includes(givenRole)) {
            throw new ApiError(403 , "You do not have permission to perform this action")
        }

        next();
    })

}