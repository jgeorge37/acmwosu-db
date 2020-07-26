CREATE TABLE IF NOT EXISTS company (
    id SERIAL PRIMARY KEY,
    cname VARCHAR UNIQUE,
    packet_sent_date timestamp
);

CREATE TABLE IF NOT EXISTS contact (
    id SERIAL PRIMARY KEY,
    fname VARCHAR,
    lname VARCHAR,
    email VARCHAR,
    mailing_addr VARCHAR,
    company_id INT,
    CONSTRAINT fk_company
        FOREIGN KEY(company_id)
            REFERENCES company(id)
);