
CREATE TABLE IF NOT EXISTS sponsorship (
    id SERIAL PRIMARY KEY, 
    academic_year INT, 
    dollars MONEY, 
    tier VARCHAR,
    dollars_status VARCHAR,
    company_id INT REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE
    );