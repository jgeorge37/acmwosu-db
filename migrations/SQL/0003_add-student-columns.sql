ALTER TABLE student
ADD COLUMN fname VARCHAR,
ADD COLUMN lname VARCHAR,
ADD COLUMN name_dot_num VARCHAR,
ADD COLUMN personal_email VARCHAR,
ADD COLUMN school_level VARCHAR, /* undergrad, grad, alum */
ADD COLUMN packet_sent_date timestamp,
ADD COLUMN updated_timestamp timestamp DEFAULT current_timestamp;