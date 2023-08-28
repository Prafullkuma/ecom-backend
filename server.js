import express from 'express';
import path from "path"
import { APP_PORT, DB_URL} from './config/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import mongoose from "mongoose"

/*  To get the __dirname  */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*  To get the __dirname  */


const app = express();

const PORT = APP_PORT || 4000

// DB connection

mongoose.connect("mongodb://localhost:27017/ecom-api");
const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function callback () {
        console.log("connected database...");
      });



global.appRoot = path.resolve(__dirname)

app.use(express.urlencoded({ extended: false })) // to use multi part data

app.use(express.json())


// Routes
app.use("/api/v1", routes)




// Error Handler
app.use(errorHandler)


// Server
app.listen(PORT, ()=>{
   console.log("Sever is running on", PORT) 
})