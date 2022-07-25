import db from "../database/database.js"
import dayjs from "dayjs";

//GET RENTAL
export async function getRentals(req, res) {
  try {
    const result = await db.query(`
        SELECT rentals.*, games.name, games.image, games."categoryId", customers.name as "customerName", categories.name as "categoryName"
        FROM rentals 
        JOIN customers 
            ON rentals."customerId"  = customers.id 
        JOIN games 
            ON rentals."gameId" = games.id
        JOIN categories
        ON categories.id = games."categoryId";
        `);

    const rentals = result.rows.map((rental) => {
      return {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.name,
          categoryId: rental.gameId,
          categoryName: rental.categoryName,
        },
      };
    });

    return res.send(rentals);

  } catch {
    return res.sendStatus(500);
  }
}

//POST RENTAL
export async function postRentals(req, res) {
  const date = new Date();
  const { customerId, gameId, daysRented } = req.body;
  const rental = req.body;

  try {
    const customerExist = await db.query(`
    SELECT id 
    FROM customers 
    WHERE id = $1
  `, [rental.customerId]);
    if (customerExist.rowCount === 0) return res.sendStatus(400);


    const gameExist = await db.query(`
    SELECT * FROM games 
    WHERE id=$1
  `, [rental.gameId]);
    if (gameExist.rowCount === 0) return res.sendStatus(400);

    const game = gameExist.rows[0];
    const result = await db.query(`
        SELECT id
        FROM rentals 
        WHERE "gameId" = $1 AND "returnDate" IS null
  `, [rental.gameId]);
    if (result.rowCount > 0) {
    if (game.stockTotal === result.rowCount) return res.sendStatus(400);
  }

    const price = await db.query(`
        SELECT * from games 
        WHERE id = $1
      `,[gameId]);

    const originalPrice = price.rows[0].pricePerDay * daysRented;
    const rentDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    await db.query(`
          INSERT INTO RENTALS ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee")
          VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [customerId, gameId, daysRented, rentDate, originalPrice, null, null]);

    res.sendStatus(201);

  } catch {
    return res.sendStatus(500);
  }
}

//FINISH RENTAL
export async function returnRentals(req, res) {
  const id = req.params.id;
  const returnDate = dayjs().format("YYYY-MM-DD");
  let delayFee = 0;

  try {

    const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if(result.rowCount === 0) return res.sendStatus(404);
    
    const rental = result.rows[0];
    if(rental.returnDate) return res.sendStatus(400);

    else {
        const returnRental = await db.query(
            `SELECT rentals.*, games."pricePerDay" 
                FROM rentals 
                JOIN games 
                    ON rentals."gameId" = games.id 
                WHERE rentals.id = $1`,
            [id]
          );
      
          const rentDate = dayjs(returnRental.rows[0].rentDate);
          const dateDif = rentDate.diff(returnDate, "day");
      
          if (dateDif > returnRental.rows[0].daysRented) {
            delayFee =
              (dateDif - returnRental.rows[0].daysRented) *
              returnRental.rows[0].pricePerDay;
          }
      
          const updateRentals = await db.query(
            `UPDATE rentals SET ("returnDate", "delayFee") = ( $1, $2 ) WHERE id = $3;`,
            [returnDate, delayFee, id]
          );
          return res.sendStatus(200);
    }

  } catch {
    return res.sendStatus(500);
  }
}


//DELETE RENTAL
export async function deleteRentals(req, res) {
    const { id } = req.params;
  
    try {
        const rentalExist = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if(rentalExist.rowCount === 0) return res.sendStatus(404);

        const rentalReturned = rentalExist.rows[0];
        if(!rentalReturned.returnDate) return res.sendStatus(400);

         else {
            const remove = await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
            res.sendStatus(200);
        }
  
    } catch {
      return res.sendStatus(500);
    }
  }