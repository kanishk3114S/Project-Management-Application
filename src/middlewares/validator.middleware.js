import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

 const validate = (req , res , next) => {
   const errors = validationResult(req); //it has the ability to take the request and then send back to 

   if (errors.isEmpty()) {
    return next();
   }

   const extractedErrors = []
   //now lets push the errors into the extracted errors....//
   errors.array().map((err)=>extractedErrors.push({[err.path] : err.msg}));

   throw new ApiError(422 , "Recieved data is not valid as of now" , extractedErrors);

}

export {validate};

/*
errors
│
├── 0
│     ├── path = "email"
│     └── msg  = "Invalid email"
│
└── 1
      ├── path = "password"
      └── msg  = "Password too short"
*/
