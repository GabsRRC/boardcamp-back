import {Router} from "express";

const rentalsRouter = Router();

rentalsRouter.get("/rentals");
rentalsRouter.post("/rentals");

export default rentalsRouter;