import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
const app = express()

// ----middleware---->>>

//cors who can talk to the database
app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
    })
)

// --- express middleware --->>

app.use(express.json({limit:"16kb"})) // allow all the json data to come in..
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(bodyParser.json());
app.use(cookieParser())
// import routes
import healthCheckRouter from "./routers/healthcheck.routes.js"
import userRouter from "./routers/user.routes.js"
import { errorHandler } from "./middlewares/error.middlewares.js"

//routes
app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/users",userRouter)

app.use(errorHandler)
export {app}