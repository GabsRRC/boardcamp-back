import gamesSchema from "../schemas/gamesSchema.js";

export function validateGames(req, res, next) {
    const game = req.body;
    const validation = gamesSchema.validate(game);
    if (validation.error) {
      return res.sendStatus(400)
    }
  
    next();
  }