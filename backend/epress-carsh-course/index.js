import express from "express"
import logger from "./logger.js";
import morgan from "morgan";
const app = express()

let teaData =[]
let nextId = 1

const morganFormat = ":method :url :status :response-time ms";


app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
);
app.use(express.json())


app.post('/teas',(req,res)=>{
    logger.info("a request is made to add tea")
   const {name , price}= req.body 

   const newTea = {id:nextId++,
    name,
    price
   }

   teaData.push(newTea)
   res.status(200).send(newTea)
})
app.get('/teas/:id',(req,res)=>{
 const tea =  teaData.find(t=>req.id===parseInt(req.params.id))
 res.status(200).send(tea)
})

app.listen(3000,(req,res,next)=>{
console.log(' App is running at port 3000');

})