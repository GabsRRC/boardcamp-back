import {Router} from "express";
import { getGames, postGames } from "../controllers/gamesController.js";
import { validateGames } from "../middlewares/gamesMiddleware.js";

const gamesRouter = Router();
gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateGames, postGames);

export default gamesRouter;