![master](https://github.com/jgeorge37/acmwosu-db/workflows/Node.js%20CI/badge.svg?branch=master)

# acmwosu-db
Interface for ACM-W Exec Board members to query database of contacts and members.   

## Installation for local development
1. Clone the repository
2. [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if not already installed
3. Run ```npm install``` from the root directory
5. Create an .env file in the root directory with the following (Heroku login, Airtable login, SendGrid login/API key in passwords spreadsheet in Drive):
~~~~
# Database connection (use local URI if wanting to use local DB)
DATABASE_URL={Get the database URI from the dev-ada app in Heroku}

# SendGrid API key
SENDGRID_API_KEY={the API key from passwords spreadsheet}

# App URL
APP_URL=http://localhost:3000

# Airtable API key
AIRTABLE_API_KEY={the API key found in Airtable account}

# Airtable base ID for the DEV attendance base
AIRTABLE_BASE_ID={the base ID}

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
