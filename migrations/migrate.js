const dotenv = require('dotenv');
const pkg = require("postgres-migrations");
const pg = require("pg");
const  {migrate} = pkg;

dotenv.config({ silent: process.env.NODE_ENV !== 'local' })

const user = process.env.M_DB_USER
const pw = process.env.M_DB_PASSWORD
const port = process.env.M_DB_PORT
const db = process.env.M_DB_DATABASE
const connectionString = process.env.NODE_ENV !== 'local' ? process.env.DATABASE_URL : `postgresql://${user}:${pw}@localhost:${port}/${db}`

async function runMigrations () {
    const dbConfig = {
        connectionString: connectionString
    }
    if (process.env.NODE_ENV !== 'local') dbConfig["ssl"] = {rejectUnauthorized: false};
    
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
