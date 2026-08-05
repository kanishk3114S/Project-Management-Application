const AsyncHandler = (reqHandler)=>{
    return (req,res,next) => {
        Promise
        .resolve(reqHandler(req,res,next))
        .catch((err)=>{next(err)});
    }
}; //a function we accepts a function and returns and function

//it accpets the req handler and gives it back if its success otherwise it will give the error//


export {AsyncHandler};