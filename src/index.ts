import * as express from "express";
import * as dotenv from "dotenv";
import routeMiddleware from './routes/apiroutes'

dotenv.config()
const PORT = process.env.PORT||3200;

const app = express()

const jsonParserMiddleware = express.json()
app.use(jsonParserMiddleware)

app.use(routeMiddleware)


app.listen(PORT , ()=>{
    console.log(`Server is Listenning on port ${PORT}`);
})


  
