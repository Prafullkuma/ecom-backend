import CustomErrorHandler from "../services/CustomErrorHandler.js"
import JwtService from "../services/JwtService.js"

const auth = async  (req, res, next ) => {
      const authHeader = req.headers.authorization
      if(!authHeader){
        return next(CustomErrorHandler.unAuthorized())
      }
    try{
      const token = authHeader.split(" ")[1]
      
      const {_id ,role } = await JwtService.verify(token)
      const user = {_id ,role }
      req.user = user
      next()
    }
    catch(err){
        return next(err)
    }

}

export default auth

