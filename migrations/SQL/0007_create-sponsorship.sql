-- DROP TYPE IF EXISTS tier;
-- DROP TYPE IF EXISTS sponsorship_status;
-- CREATE TYPE IF NOT EXISTS tier AS ENUM ('gold', 'silver', 'purple');
-- CREATE TYPE IF NOT EXISTS sponsorship_status AS ENUM ('pending','sent','received');


CREATE TABLE IF NOT EXISTS sponsorship (
    id SERIAL PRIMARY KEY, 
    academic_year INT, 
    dollars MONEY, 
    purple_tier BOOLEAN,
    silver_tier BOOLEAN,
    gold_tier BOOLEAN,
    -- tier_level tier, 
    -- dollars_status sponsorship_status, 
    dollars_status VARCHAR,
    company_id INT REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE
    );