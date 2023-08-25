import Joi from "joi"
import User from "../../models/user.js"
import CustomErrorHandler from "../../services/CustomErrorHandler.js"
import  bcrypt  from 'bcrypt';
import JwtService from "../../services/JwtService.js";

const registerController = {
    async login(req, res, next ){
        // TODO : validate request
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        })
        const { error } = loginSchema.validate(req.body)
        if(error){
            return next(error)
        }   
        const { email, password } = req.body

        try{
            const user = await User.findOne({email : email })
            if(!user){
                return next(CustomErrorHandler.wrongCredentials())
            }
            
            // compare password 
            const match = await bcrypt.compare(password , user.password )
            if(!match){
                return next(CustomErrorHandler.wrongCredentials())
            }

            // send access Token 
            let access_token =  JwtService.sign({ _id: match._id, role: match.role})
            res.json({access_token})
        }
        catch(err){
            return next(err)
        }
    }
}

export default registerController
