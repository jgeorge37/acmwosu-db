CREATE TABLE IF NOT EXISTS user (
    id SERIAL PRIMARY KEY,
    fname VARCHAR,
    lname VARCHAR,
    username VARCHAR UNIQUE,
    password VARCHAR
)