import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator, addMemberProjectValidator } from "../validators/index.js";
import { getProjects, getProjectbyId, createProject, UpdateProject, deleteProject, AddMemberProject, getProjectMembers, updateMemberRole, deleteProjctMember } from "../controllers/projects.controllers.js";
import { verifyUser , permissionValidator } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, userRoleEnum } from "../utils/constants.js";

export const ourRouter = Router()
ourRouter.use(verifyUser) //first this middleware will run and then the next routes will take place

//routes//

//on the same route either we can create the project or get the project on the same Route//

//frontend will send the GET/projects then get req will run otherwise POST/projects req will run 

ourRouter.route("/").get(getProjects).post(createProjectValidator() , validate , createProject)

//u can get the projectById , update it and delete it on the same route//

//User specific role that checks whether the project can be made or not//

ourRouter.route("/:projectId").get(permissionValidator(AvailableUserRole) , getProjectbyId)
.put( //updating the project//
    permissionValidator([userRoleEnum.ADMIN]) , createProjectValidator() , validate ,UpdateProject
)
.delete(

    permissionValidator([userRoleEnum.ADMIN]) ,
    deleteProject

)

//we have to get the projects [we are inside the project]//
//jo ADMIN hai vahi add kar sakta hai//

ourRouter.route("/:projectId/members")
    .get(permissionValidator(AvailableUserRole), getProjectMembers)
    .post(
        //a middlewre will run to check u should be ADMIN to add this shit//
        permissionValidator([userRoleEnum.ADMIN]) ,  
        addMemberProjectValidator() , validate , AddMemberProject
    )


//update and delete the projectMembers//

ourRouter.route("/:projectId/members/:userId")
.put(
    permissionValidator([userRoleEnum.ADMIN]),
    updateMemberRole
).delete(
    permissionValidator([userRoleEnum.ADMIN]),
    deleteProjctMember
)

export default ourRouter;
