import Product from "../../models/product.js";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import fs from "fs";
import Joi from "joi"

// install multer
// set up multer , TIP: multer can be used as middleware

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 1000000 * 5 },
}).single("image"); // for single file

const productController = {
  async store(req, res, next) {
    upload(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.ServerError(err.message));
      }
      const filePath = req.file.path;
      const productSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.string().required(),
        size: Joi.string().required(),
      });
      const { error } = productSchema.validate(req.body);
      if (error) {
        // Delete Uploaded file  if we have any fileds missing
        fs.unlink(`/${appRoot}/${filePath}`, (err) => {
          if(err){
            return next(CustomErrorHandler.ServerError(err.message));
          }
        });

        return next(error);
      }
      const { name, price, size } = req.body;
      let document;

      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
};

export default productController;
