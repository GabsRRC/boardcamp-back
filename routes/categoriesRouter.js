import {Router} from "express";
import { getCategories, postCategories } from "../controllers/categoriesController.js";
import { validateCategories } from "../middlewares/CategoriesMiddleware.js";

const categoriesRouter = Router();
categoriesRouter.get("/categories" , getCategories);
categoriesRouter.post("/categories" , validateCategories, postCategories);

export default categoriesRouter;