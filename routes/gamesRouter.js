import {Router} from "express";

const gamesRouter = Router();
gamesRouter.get("/games");

export default gamesRouter;