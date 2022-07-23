import db from "../database/database.js"

export async function getGames(req, res) {
    const { name } = req.query;
    try {
      const games = !name
        ? await db.query(
            `SELECT games.*, 
                    categories.id as "categoryId", 
                    categories.name as "categoryName" 
                    FROM games 
                    JOIN categories 
                    ON games."categoryId" = categories.id;`
          )
        : await db.query(
            `SELECT games.*, 
                    categories.id as "categoryId", 
                    categories.name as "categoryName" 
                    FROM games 
                    JOIN categories 
                    ON games."categoryId" = categories.id 
                    WHERE LOWER(games.name) LIKE '${name}%';`
          );
      return res.send(games.rows);
     
    } catch {
      return res.sendStatus(500);
    }
  }



export async function postGames (req, res) {
  const game = req.body;
  try {

    const gamesCategory = await db.query(`SELECT id FROM categories WHERE id = $1`, [game.categoryId]);
    const gamesName = await db.query(`SELECT name FROM games WHERE name = $1`, [game.name]);

    if (gamesCategory.rowCount === 0) {
      return res.sendStatus(400);
    }

    if (gamesName.rowCount > 0) {
        return res.sendStatus(409);
    }

    await db.query(`
      INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5);
    `, [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);

    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}
