import Joi from "joi"
import refreshToken from "../../models/refreshToken.js"
import CustomErrorHandler from "../../services/CustomErrorHandler.js"
import JwtService from "../../services/JwtService.js"
import { REFRESH_SECRET } from "../../config/index.js"
import User from "../../models/user.js"

const refreshController ={
    async refresh(req, res, next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })
        const { error } = refreshSchema.validate(req.body)
        if(error){
            return next(error)
        }
        // database check 
        const { refresh_token } = req.body
        let refresh_result
        try{
             refresh_result = await refreshToken.findOne({token : refresh_token})
             if(!refresh_result){
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"))
             }   
             let userId 
             try{
                const { _id } = await JwtService.verify(refresh_result.token, REFRESH_SECRET)
                userId = _id
             }
             catch(err){
                return next(err)
             }

             const user = await User.findOne({_id : userId})

             if(!user){
                return next(CustomErrorHandler.notFound("User not found"))
             }
             let accessToken =  JwtService.sign({ _id: user._id, role: user.role})
             let refreshTokenCom =  JwtService.sign({ _id: user._id, role: user.role}, '1y', REFRESH_SECRET)
             
             //White list
             await refreshToken.create({ 
                 token : refreshTokenCom
             })

             res.json({access_token: accessToken, refresh_token: refreshTokenCom})
        }
        catch(err){
            return next(err)
        }
    }
}   

export default refreshController