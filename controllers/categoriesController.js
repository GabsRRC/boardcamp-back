import db from "../database/database.js"

export async function getCategories( req, res) {
    try {
        const categories = await db.query(`SELECT * FROM categories`)
        res.send(categories.rows)
    } catch {
        res.sendStatus(404)
    }
}

export async function postCategories( req, res) {
    const category = req.body;
    try {
        const categoryName = await db.query(`SELECT id FROM categories WHERE name=$1`, [category.name]);
            if (categoryName.rowCount > 0) {
                return res.sendStatus(409);
            }
        await db.query(`INSERT INTO categories(name) VALUES ($1)`, [category.name]);
        res.sendStatus(201);

    } catch {
        res.sendStatus(500);
    }
}