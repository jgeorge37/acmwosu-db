ALTER TABLE account
DROP COLUMN fname,
DROP COLUMN lname;

ALTER TABLE account 
RENAME COLUMN username TO email;

ALTER TABLE account
ADD COLUMN IF NOT EXISTS student_id INT,
ADD CONSTRAINT fk_student
    FOREIGN KEY(student_id)
        REFERENCES student(id);
