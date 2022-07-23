import {Router} from "express";

const customersRouter = Router();
customersRouter.get("/customers");

export default customersRouter;