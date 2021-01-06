DO $$ 
BEGIN 
IF EXISTS
    (SELECT * FROM information_schema.columns WHERE table_name='account' and column_name='token_expire_time') 
THEN ALTER TABLE public.account RENAME COLUMN token_expire_time TO reset_expire_time; 
END IF; 
END $$;

ALTER TABLE account 
ADD COLUMN IF NOT EXISTS auth_token VARCHAR,
ADD COLUMN IF NOT EXISTS auth_expire_time TIMESTAMP;

ALTER TABLE contact
ADD UNIQUE(email);