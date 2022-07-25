import {Router} from "express";
import { getCustomers, getCustomer, postCustomer, updateCustomer } from "../controllers/customersController.js";
import { validateCustomers } from "../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer)
customersRouter.post("/customers", validateCustomers, postCustomer);
customersRouter.put("/customers/:id", validateCustomers, updateCustomer);

export default customersRouter;