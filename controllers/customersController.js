import db from "../database/database.js"

//get customers all
export async function getCustomers( req, res) {
    const {cpf} = req.query;
    try {
      const customers = !cpf
        ? await db.query(
            `SELECT * FROM customers`
          )
        : await db.query(
            `
            SELECT * FROM customers 
            WHERE cpf LIKE '${cpf}%';
            `
          );
      return res.send(customers.rows);
     
    } catch {
      return res.sendStatus(500);
    }
  }


//get customer :id
export async function getCustomer(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(`
    SELECT * FROM customers 
    WHERE id = $1
    `, [id]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    res.send(result.rows[0]);

  } catch {
   return res.sendStatus(500);
  }
}


//post customer
export async function postCustomer(req, res) {
    const customer = req.body;
    try {
      const cpf = await db.query(`
      SELECT id 
      FROM customers 
      WHERE cpf = $1
      `, [customer.cpf]);

      if (cpf.rowCount > 0) {
        return res.sendStatus(409);
      }
  
      await db.query(`
        INSERT INTO customers 
            (name, 
            phone, 
            cpf, 
            birthday) 
        VALUES ($1, $2, $3, $4);
      `, [customer.name, customer.phone, customer.cpf, customer.birthday]);

      res.sendStatus(201);

    } catch {
      return res.sendStatus(500);
    }
  }


//update customers
  export async function updateCustomer(req, res) {
    const customer = req.body;
    const { id } = req.params;
  
    try {
      const result = await db.query(`
        SELECT id 
        FROM customers 
        WHERE cpf = $1 AND id != $2
      `, [customer.cpf, id]);
      if (result.rowCount > 0) {
        return res.sendStatus(409); 
      }
  
      await db.query(`
        UPDATE customers 
        SET 
          name = $1, 
          phone = $2, 
          cpf = $3, 
          birthday = $4 
        WHERE id = $5
      `, [customer.name, customer.phone, customer.cpf, customer.birthday, id]);
  
      res.sendStatus(200); 
    } catch {
      return res.sendStatus(500);
    }
  }