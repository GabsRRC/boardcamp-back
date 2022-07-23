import express, {json} from "express";
import cors from "cors";
import dotenv  from "dotenv";
import router from "./routes/allRoutes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(router);


const port = process.env.PORT
app.listen(port, () => {
    console.log("Server Up!")
})