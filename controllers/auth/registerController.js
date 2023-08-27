import Joi from "joi"
import bcrypt from "bcrypt"

import CustomErrorHandler from "../../services/CustomErrorHandler.js"
import User from "../../models/user.js"
import JwtService from "../../services/JwtService.js"
import { REFRESH_SECRET } from "../../config/index.js"
import refreshToken from "../../models/refreshToken.js"

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
        const { name, email, password } = req.body
        try{
            const exists = await User.exists({email : req.body.email })
            if(exists){
                return next(CustomErrorHandler.alreadyExist("Email already exists"))
            }
        }
        catch(err){
            return next(err) 
        }
        // Hash the Password 
        const hashedPassword = await bcrypt.hash(password, 10)

        // TODO : prepare model 
        const user = new User({
            name: name,
            email: email,
            password : hashedPassword
        })
        let access_token;
        let refresh_token;
        try{    
            const result = await user.save(user)
            access_token =  JwtService.sign({ _id: result._id, role: result.role})
            refresh_token =  JwtService.sign({ _id: result._id, role: result.role}, '1y', REFRESH_SECRET)
            // white list
            await refreshToken.create({ 
                token : refresh_token
            })
            res.json({access_token, refresh_token})

        }catch(err){
           return next(err)
        }
        // TODO : store in DB 
        // TODO : generate jwt -token 
        // TODO : send request 
    }
}

export default registerController
