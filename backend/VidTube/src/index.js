import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js";
dotenv.config({
    path:"./.env"
})


const PORT =process.env.PORT||3001

//database
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running at ${PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongodb database error",err);
    
})


