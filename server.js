import express from 'express';
import { APP_PORT, DB_URL} from './config/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import mongoose from "mongoose"


const app = express();

const PORT = APP_PORT || 4000

// DB connection

mongoose.connect("mongodb://localhost:27017/ecom-api");
const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function callback () {
        console.log("connected database...");
      });

app.use(express.json())


// Routes
app.use("/api/v1", routes)




// Error Handler
app.use(errorHandler)


// Server
app.listen(PORT, ()=>{
   console.log("Sever is running on", PORT) 
})