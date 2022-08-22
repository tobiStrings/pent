import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import Mongoose from "./src/controllers/mongoose";
import routes from "./src/routes/routes";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.disable("x-powered-by");

app.use(compression());
app.use(cors());

dotenv.config();

app.get('/', (_, res: Response) => {
    res.status(200).json({
        message:"success"
    })
});


app.use("/api", routes);

const httpServer:any = app.listen(process.env.PORT, () => {
const db = new Mongoose();
db.connect().then((e)=>{
  console.log("Express server listening at http://localhost:" + process.env.PORT);
})
});

httpServer.setTimeout = 605 * 1000; 

httpServer.keepAliveTimeout = 605 * 1000; 
httpServer.headersTimeout = 606 * 1000;