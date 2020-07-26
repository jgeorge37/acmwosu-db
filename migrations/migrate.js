import dotenv from 'dotenv';
import pkg from "postgres-migrations";
import pg from "pg";
const  {createDb, migrate} = pkg;

dotenv.config();

async function runMigrations () {
    const dbConfig = {
        database: "acmw",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
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