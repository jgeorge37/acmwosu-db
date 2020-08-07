import dotenv from 'dotenv';
import pkg from "postgres-migrations";
import pg from "pg";
const  {createDb, migrate} = pkg;

dotenv.config();

const user = process.env.M_DB_USER
const pw = process.env.M_DB_PASSWORD
const port = process.env.M_DB_PORT
const connectionString = process.env.ENV === 'prod' ? process.env.DATABASE_URL : `postgresql://${user}:${pw}@localhost:${port}/acmw`

async function runMigrations () {
    const dbConfig = {
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
          }
        }
        
        {
        const client = new pg.Client({
            ...dbConfig,
            database: "postgres",
        })
        await client.connect()
        try {
            await createDb("acmw", {client})
        } finally {
            await client.end()
        }
        }
        
        {
        const client = new pg.Client(dbConfig) // or a Pool, or a PoolClient
        await client.connect()
        try {
            await migrate({client}, "./migrations/SQL")
        } finally {
            await client.end()
        }
        }
}

runMigrations();