import Joi from "joi"
import CustomErrorHandler from "../../services/CustomErrorHandler.js"
import User from "../../models/user.js"

const registerController = {
    async register(req, res, next ){
        // TODO : validate requrest
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })
        const { error } = registerSchema.validate(req.body)

        if(error){
            return next(error)
        }        
        // TODO : check Email id is exists or not 
        // TODO : prepare model 
        try{
            const exists = await User.exists({email : req.body.email })
            if(exists){
                return next(CustomErrorHandler.alreadyExist("Email already exists"))
            }
        }
        catch(err){
            return next(err) 
        }
        // TODO : store in DB 
        // TODO : generate jwt -token 
        // TODO : send request 

        res.send("Working")
    }
}

export default registerController
