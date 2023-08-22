const authentication=require("./auth");
const notFound=require("./notFound")
const errorHandlerMiddleware=require("./errorHandler")


module.exports={
    authentication,
    notFound,
    errorHandlerMiddleware
}