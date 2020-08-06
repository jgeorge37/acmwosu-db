CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    fname VARCHAR,
    lname VARCHAR,
    username VARCHAR UNIQUE,
    password VARCHAR
);