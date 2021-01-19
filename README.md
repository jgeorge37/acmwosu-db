![master](https://github.com/jgeorge37/acmwosu-db/workflows/Node.js%20CI/badge.svg?branch=master)

# acmwosu-db
Interface for ACM-W Exec Board members to query database of contacts and members.   

## Installation for local development
1. Clone the repository
2. [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if not already installed
3. Run ```npm install``` from the root directory
5. Create an .env file in the root directory with the following (Heroku login and SendGrid login/API key in passwords spreadsheet in Drive):
~~~~
# Database connection (use local URI if wanting to use local DB)
DATABASE_URL={Get the database URI from the dev-ada app in Heroku}

# SendGrid API key
SENDGRID_API_KEY={the API key from passwords spreadsheet}

# App URL
APP_URL=http://localhost:3000
~~~~
The Heroku info may expire at some point; just go get the info again if things stop working.

## Developing with local Postgres instance
If working on database-related features where testing on a local instance is necessary, change the DATABASE_URL in the .env file to your local database URL, and comment out the indicated line in postgres/pg-query.js. Do not commit pg-query.js with that line commented out.

## Usage
To start the application locally, run ```npm run dev``` from the root directory.

## Unit testing
This application uses [Jest](https://jestjs.io/en/) for unit testing.   

To run unit tests, run the command ```npm run dev``` from either the root directory.

## API testing
To test the API with Postman or a similar application, you must get the auth token associated with your account. Depending on the environment you want to test, either start up the application locally or go to the application URL in the browser. Log out, then sign in. Inspect the page / open the developer tools. Go to the application tab, then under the storage section, expand the cookies subsection. Click the item under "Cookies". Copy the value from "auth_token". Then in Postman, go to the authorization tab. For "Type" select Bearer Token. Paste in the value you copied from the cookies. You should be able to send requests with this token for an hour. If an hour passes, repeat the process to get a new token.

## Heroku Dev database visualization
To view the contents of the development database, install pgAdmin. Once your account is set up, add a server. In the pop up, fill out the name field in the first tab. Then go to the connection tab and fill out the host, port, database, username, and password with data from the **dev-ada app (NOT acmwosu-db)** in Heroku. Next go to the SSL tab, and set SSL to "required", then click save. The new connection should appear under servers. You will need to expand the Databases section, and search for the database name that you got from Heroku using command/control f. From here you can go to the public schema to view the tables and their contents.

## Running database migrations
**If you are creating a new table, the table name should be singular, i.e. "student" not "students" for consistency.**
1. Install PostgreSQL and create a database.
2. Add the pgcrypto extension to the database.
3. Add the following (**excluding curly braces**) to your .env file at the root level:
~~~~
# Specifiy that you are working locally.
NODE_ENV=local
  
# For running migrations on your local database.
M_DB_PASSWORD={The password for your local Postgres instance}
M_DB_PORT={The port of your local Postgres instance}
M_DB_USER={Your local Postgres username, most likely "postgres"}
M_DB_DATABASE={The name of the database you wish to use from your local instance}
~~~~
3. From the root directory, run the command ```npm run migrate```. This will run migrations on only your local Postgres instance.
