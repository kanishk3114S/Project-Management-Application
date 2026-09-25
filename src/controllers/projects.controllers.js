import { User } from "../models/user.models.js"
import { Project } from "../models/project.models.js"
import { ProjectMember } from "../models/projectmember.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { AsyncHandler } from "../utils/async-handler.js"
import mongoose from "mongoose"
import { AvailableUserRole, userRoleEnum } from "../utils/constants.js"

//boiler-plate structure//

// we use new mongoose.Types.ObjectId() only when we are referencing a filed from other Models//

const getProjects = AsyncHandler(async (req, res) => {

    // we list all the projects for the user given
    //  for the user (with member count and role info via aggregation pipeline)//

    const projects = await ProjectMember.aggregate([

        // 1. Find all ProjectMember documents belonging to this user
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id)
            }
        },

        // 2. Get the actual Project document
        {
            $lookup: {
                from: "projects", //go to project collection//
                localField: "project", //take the project field from that//
                foreignField: "_id",
                as: "project",

                // 3. For each project, get all its members
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "project",
                            foreignField: "project",
                            as: "projectmembers"
                        }
                    },

                    // 4. Count the members of this project
                    {
                        $addFields: {
                            members: {
                                $size: "$projectmembers"
                            }
                        }
                    }
                ]
            }
        },

        // 5. Convert project array → project object
        {
            $unwind: "$project"
        },

        // 6. Return only the fields we need
        {
            $project: {
                project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    members: 1,
                    createdAt: 1,
                    createdBy: 1
                },
                role: 1,
                _id: 0
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            projects,
            "Projects fetched successfully"
        )
    );
});


const getProjectbyId = AsyncHandler(async(req,res)=>{
    
    //we give the projectId------> backend gives the Project Model {name , description , id , createdby}//

    const {projectId} = req.params
    const project = await Project.findById(projectId) //found the project

    if (!project) {
        throw new ApiError(404 , "Project not found")
    }

    return res.status(200).json(
        new ApiResponse(200 , project , "project fetched successfuly")
    )

})

const createProject = AsyncHandler(async(req,res)=>{
    //we are assuming the user is Logged in , and any request that is coming from the user is authenticated and verified by our middleware//

    //verifyUser() is our Auth Middleware//

    //handling the request//

    const {name , description} = req.body; //now its totally up to u what u want to expect from the user//

    //.create() is a method which takes up the project which take an Object : {}//

    const createdProject = await Project.create({
        name,
        description,
        createdBy : new mongoose.Types.ObjectId(req.user._id) //converts the req.user_id to the actual mongoose type id that is stored in the mongoDB  
        //we want a mongoose id//
    })

    //WE want that "user" should be roled as "admin" of this project

    await ProjectMember.create(
        {
            user: new mongoose.Types.ObjectId(req.user._id),
            project : new mongoose.Types.ObjectId(createdProject._id),
            role : userRoleEnum.ADMIN
        }
    )

    return res
        .status(201).json(
            new ApiResponse(201, createdProject, "Project has been successfuly created")
        )

})

const UpdateProject = AsyncHandler(async(req,res)=>{
    
    //now we will update the project , we will get the {name,description} from body and the projectId from req.params//

    const {name , description} = req.body
    const {projectId} = req.params

    //we findIdAndUpdate(id , {update the user})//

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name , 
            description
        } , 
        {new: true}
    )

    if (!project) {
        throw new ApiError(404 , "project not found");
    }

    return res.status(200).json(
        new ApiResponse(200 , project , "project has been updated")
    )

})

const deleteProject = AsyncHandler(async(req,res)=>{
    
    const {projectId} = req.params

    const project = await Project.findByIdAndDelete(projectId)

    if (!project) {
        throw new ApiError(404 , "Project not found")
    }

    return res.status(200).json(
        new ApiResponse(200 , {} , "Project deleted SUCCESSFULLY")
    )

})

const AddMemberProject = AsyncHandler(async(req,res)=>{
    
    //we are getting the email and role of the user and the projectId from the params//
    //here we are sending the HTTP req to backend--> the data we are sending is in "body" , the projectId is in the URL embedded "path" , the query is also fetched by backend from the request//

    //req.user_id does not exist....whenever the URL comes,middleware verifies it using the verifyUser , makes the req.user_id//

    const {email , role} = req.body
    const {projectId} = req.params
    const user = await User.findOne({email}) //find based only on one parameter//

    if (!user) {
        throw new ApiError(404 , "user does not exsit")
    }

    //we can not use .Create()----> because exisitng user will vanish//

    const updatedMember = await ProjectMember.findOneAndUpdate(
        {   //finding the user
            user : new mongoose.Types.ObjectId(user._id),
            project : new mongoose.Types.ObjectId(projectId)
        } , {

            //updating the role if it exists//
            user : new mongoose.Types.ObjectId(user._id),
            project : new mongoose.Types.ObjectId(projectId),
            role : role
        } , {
            new : true , //return the new document if not exists//
            upsert : true //else if exists update the role//
        }
    )

    return res.status(201).json(
        new ApiResponse(201 , updatedMember , "the User has been updated") //the user has been added//
    )

})


const getProjectMembers = AsyncHandler(async(req,res)=>{
    //get the project.....and group the project with its members//

    //get the project//

    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404 , "Project not found");
    }

    const projectmembers = await ProjectMember.aggregate([
        {
            $match : {
                project : new mongoose.Types.ObjectId(projectId) //find the projectId//   
            } , 
        } , {

            $lookup : {
                from : "users" , 
                localField : "user" , 
                foreignField: "_id" , 
                as : "user" , 
                pipeline: [
                    {
                        $project: {
                            _id : 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        } , {
            $addFields : {
                user : {
                    $arrayElemAt: ["$user" , 0]
                }
            }
        } , {
            //how much fields we actually want to show//
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt : 1,
                updatedAt : 1,
                _id:0
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200 , projectmembers , "the project member has been fetched")
    )

})

const updateMemberRole = AsyncHandler(async(req,res)=>{
    
    //we want to update the role of the user so we want....userId , projectId , the Role//

    const {projectId , userId} = req.params
    const roleToUpdate = req.body.newRole || req.body.role

    if (!AvailableUserRole.includes(roleToUpdate)) {
        throw new ApiError(400 , "Invalid Role")
    }

    let projectmember = await ProjectMember.findOne(({
        project : new mongoose.Types.ObjectId(projectId) ,
        user : new mongoose.Types.ObjectId(userId)
    }))

    if (!projectmember) {
        throw new ApiError(404 , "Project Member not found")
    }

    projectmember = await ProjectMember.findByIdAndUpdate(
        projectmember._id , {
            role : roleToUpdate 
        } , {
            new : true
        }
    )

    return res.status(200).json(
        new ApiResponse(200 , projectmember , "project Member has been updated")
    )

})

const deleteProjctMember = AsyncHandler(async(req,res)=>{

    //target---> find the projectMember based on the userId and proejct Id and then delete it//

    const {projectId , userId} = req.params


    let projectmember = await ProjectMember.findOne(({
        project : new mongoose.Types.ObjectId(projectId) ,
        user : new mongoose.Types.ObjectId(userId)
    }))

    if (!projectmember) {
        throw new ApiError(404 , "Project Member not found")
    }

    projectmember = await ProjectMember.findByIdAndDelete(
        projectmember._id
    )

    return res.status(200).json(
        new ApiResponse(200 , projectmember , "project Member has been deleted")
    )

})

export {
    getProjects,
    getProjectbyId,
    createProject,
    UpdateProject,
    deleteProject,
    AddMemberProject,
    getProjectMembers,
    updateMemberRole,
    deleteProjctMember
}