import db from "../database/database.js"

export async function getCustomers( req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers`)
        res.send(customers.rows)
    } catch {
        res.sendStatus(500)
    }
}

export async function postCustomers( req, res) {
    const customer = req.body;
    try {

    } catch {
        res.sendStatus(500);
    }
}