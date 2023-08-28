import { DEBUG_MODE } from "../config/index.js";
import Joi from "joi"
import CustomErrorHandler from "../services/CustomErrorHandler.js";


const errorHandler =(err, req, res, next )=>{
    let statusCode = 500;
    let data = {
        message: "Internal server error",
        ...(DEBUG_MODE === "true" && { originalError : err.message })
    }   
    if(err instanceof  Joi.ValidationError ){ // ValidationError this class give br joi 
       statusCode = 422 
       data = {
          message : err.message
       }
    }
    if( err instanceof CustomErrorHandler){ // custom error handle registeration
      statusCode = err.status
      data = {
        message : err.message 
      }
    }
    return res.status(statusCode).json(data)
}


export default errorHandler


// 500 internal server error 
// 422 validation error 
// 400 Bad requrest
// 409 already exists
// 201 create 
// 404 Not Found
 