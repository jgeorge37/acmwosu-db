CREATE TABLE IF NOT EXISTS meeting (
    id SERIAL PRIMARY KEY,
    meeting_name VARCHAR,
    meeting_date timestamp,
    code VARCHAR UNIQUE,
    semester VARCHAR
);

CREATE TABLE IF NOT EXISTS meeting_company (
    meeting_id INT REFERENCES meeting (id) ON UPDATE CASCADE ON DELETE CASCADE,
    company_id INT REFERENCES company (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT meeting_company_pkey PRIMARY KEY (meeting_id, company_id)
);

CREATE TABLE IF NOT EXISTS meeting_student (
    meeting_id INT REFERENCES meeting (id) ON UPDATE CASCADE ON DELETE CASCADE,
    student_id INT REFERENCES student (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT meeting_student_pkey PRIMARY KEY (meeting_id, student_id)
);
