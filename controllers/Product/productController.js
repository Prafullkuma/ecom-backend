
import Product from "../../models/product.js"
import multer from "multer"
import path from 'path'
import CustomErrorHandler from "../../services/CustomErrorHandler.js"
// install multer 
// set up multer , TIP: multer can be used as middleware 

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads')
  },
  filename : function(req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  } 
})

const upload = multer({ storage: storage,limits:{ fieldSize: 1000000 * 5} }).single('image') // for single file 

const productController = {
    async store(req, res, next){
        upload(req, res, (err)=>{
            
            if(err){
                return next(CustomErrorHandler.ServerError(err.message))
            }
            const filePath = req.file.path 
            console.log(filePath,"PATH")
           res.json({filePath})
        })
    }
}

export default productController
