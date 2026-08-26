import { body } from "express-validator";

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
        .isEmpty()
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

        body("oldPassword").notEmpty().withMessage("PASSWORD is not empty").isEmpty().withMessage("password is empty") , 
        body("newPassword").notEmpty().withMessage("OldPassword is required")

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

export {
    userRegisterValidator,
    userLoginValidator
}