import dotenv from 'dotenv';
import pg from 'pg';

export default async (query) => {
    dotenv.config({ silent: process.env.NODE_ENV === 'production' });
    const dbConfig = {
        connectionString: process.env.DATABASE_URL
    }
    if (process.env.NODE_ENV === 'production') dbConfig[ssl] = {rejectUnauthorized: false};
    
    const client = new pg.Client(dbConfig);
    
    try {
        await client.connect();
        const result = await client.query(query);
        return result;
    } catch (err) {
        console.log(`Error in postgres.js - ${err}`);
    } finally {
        await client.end();
    }
}
  