import {Router} from "express";

const categoriesRouter = Router();
categoriesRouter.get("/categories");

export default categoriesRouter;