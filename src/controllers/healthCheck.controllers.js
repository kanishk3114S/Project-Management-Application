import { ApiResponse } from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";

/*
const HealthCheck = async (req,res) => {

    try {
        const user = await getUserFromDB(); //suppose we have to grab the user from the database//
        res.status(200).json(
            new ApiResponse(200,{message:"Server is Running"})
        )
    } catch (error) {
        
    }

}
*/

const HealthCheck = AsyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,"successful and the server is running"));
})

export {HealthCheck};