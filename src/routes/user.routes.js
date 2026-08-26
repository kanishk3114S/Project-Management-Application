import { Router } from "express";
import { Logout, registerUser , currUser, verifyEmail, resendVerificationEmail , newAccessAndRefreshToken, forgotPasswordRequest, resetForgotPassword, changeCurrentPassword } from "../controllers/auth.user.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator , userForgotPasswordValidator , userResetForgotValidator, userChangeCurrentPasswordValidator } from "../validators/index.js";
import { Login } from "../controllers/auth.user.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const hamaraRouter = Router()
hamaraRouter.route("/register").post(userRegisterValidator() , validate ,registerUser) //A--->B , where A is the frontend and the request is begin routed from A to B we need a middle ware in between which will run and pass on the errors//
hamaraRouter.route("/login").post(userLoginValidator(), validate, Login) //login the user//
hamaraRouter.route("/forgot-password").post(userForgotPasswordValidator() , validate , forgotPasswordRequest)
hamaraRouter.route("/reset-password/:resetToken").post(userResetForgotValidator() , validate , resetForgotPassword);

//secure routes//
hamaraRouter.route("/logout").post(verifyUser ,  Logout);
hamaraRouter.route("/currentUser").get(verifyUser , currUser)
hamaraRouter.route("/verify-email/:verificationToken").get(verifyEmail) //verify the email of the user//
hamaraRouter.route("/resend-verification-email").post(verifyUser , resendVerificationEmail) //resend the verification email//
hamaraRouter.route("/refresh-token").get(verifyUser , newAccessAndRefreshToken) //refresh the access and refresh token//
hamaraRouter
    .route("/change-password")
    .post(verifyUser , userChangeCurrentPasswordValidator() , validate , changeCurrentPassword )


export default hamaraRouter;

