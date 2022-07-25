import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const {Pool} = pg;

// const db = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// if(process.env.MODE === "PROD") {
//   db.ssl = {
//     rejectUnauthorized: false
//   }
// }

const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
}

const db = new Pool(databaseConfig);

export default db;