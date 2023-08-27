import Joi from "joi"
import User from "../../models/user.js"
import CustomErrorHandler from "../../services/CustomErrorHandler.js"
import  bcrypt  from 'bcrypt';
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
import RefreshToken from "../../models/refreshToken.js";

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
            let access_token =  JwtService.sign({ _id: user._id, role: user.role})
            let refresh_token =  JwtService.sign({ _id: user._id, role: user.role}, '1y', REFRESH_SECRET)
            
            //White list
            await RefreshToken.create({ 
                token : refresh_token
            })
            res.json({access_token, refresh_token})
        }
        catch(err){
            return next(err)
        }
    },
    async logout (req, res, next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })
        const { error } = refreshSchema.validate(req.body)
        if(error){
            return next(error)
        }
        try{
          await RefreshToken.deleteOne({ token : req.body.refresh_token })
        }
        catch(err){
            return next(new Error("Something went wrong"))
        }
        res.json({status: 1 })
    }   
}

export default registerController
