CREATE TABLE IF NOT EXISTS ghc(
    id SERIAL PRIMARY KEY,
    student_id INT,
    volunteer_hours REAL[],
    volunteer_sources VARCHAR[],
    external_sch BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
            REFERENCES student(id)
);