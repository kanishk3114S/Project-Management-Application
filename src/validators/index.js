import { body } from "express-validator";
import { AvailableUserRole, AvailableTaskStatues } from "../utils/constants.js";

//this is the data coming from the body and data is giving a json file in the form of same model[in model file] we had created inside the mongoDB//

const userRegisterValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid") , 
        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min : 3}) //means minimum of length 3 username is required//
        .withMessage("Username must be at least 3 characters long"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required : please fill the password"),
        body("fullName").optional().trim()

    ]
}

const userLoginValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
    ]
}

export const userChangeCurrentPasswordValidator = () => {
    return [

        body("oldPassword").notEmpty().withMessage("Old password is required") , 
        body("newPassword").notEmpty().withMessage("New password is required")

    ];
}

export const userForgotPasswordValidator = () => {

    return [

        body("email").notEmpty().withMessage("email is required").isEmail().withMessage("Email is invalid")

    ]

}

export const userResetForgotValidator = () => {

    return [

        body("newPassword").notEmpty().withMessage("PASSWORD IS REQUIRED")
    ]

}

export const createProjectValidator = ()=> {
    return [
        body("name")
        .notEmpty()
        .withMessage("The project name is required") , 
        body("description").optional()
    ];
};

export const addMemberProjectValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("email id required")
        .isEmail()
        .withMessage("Email is invalid") , 
        body("role")
        .trim()
        .notEmpty()
        .withMessage("The role is required") 
        .isIn(AvailableUserRole)
        .withMessage("User role is not there")        
    ]
}

export const createTaskValidator = () => {
    return [
        body("title").notEmpty().withMessage("Task title is required"),
        body("description").optional(),
        body("assignedTo").optional(),
        body("status").optional().isIn(AvailableTaskStatues).withMessage("Invalid status")
    ];
};

export const updateTaskValidator = () => {
    return [
        body("title").optional(),
        body("description").optional(),
        body("assignedTo").optional(),
        body("status").optional().isIn(AvailableTaskStatues).withMessage("Invalid status")
    ];
};

export const createSubTaskValidator = () => {
    return [
        body("title").notEmpty().withMessage("Subtask title is required")
    ];
};

export const updateSubTaskValidator = () => {
    return [
        body("title").optional(),
        body("isCompleted").optional().isBoolean().withMessage("isCompleted must be a boolean")
    ];
};

export const createNoteValidator = () => {
    return [
        body("content").notEmpty().withMessage("Note content is required")
    ];
};

export const updateNoteValidator = () => {
    return [
        body("content").notEmpty().withMessage("Note content is required")
    ];
};

export {
    userRegisterValidator,
    userLoginValidator
}