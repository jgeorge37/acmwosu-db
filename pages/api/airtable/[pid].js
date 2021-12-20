import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();


Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);


async function createRecord(table, fields) {
  const createdRecord = await table.create(fields);
  return createdRecord;
}

async function updateRecord(table, id, fields) {
  const updatedRecord = await table.update(id, fields);
  return updatedRecord
}

async function getRecordById(table, id) {
  const record = await table.find(id);
  return record;
}

// returns first 100 records matching selectArgs
async function getRecords(table, selectArgs) {
  const selectedRecords = await table.select(selectArgs).firstPage();
  return selectedRecords;
}


export default async (req, res) => {
  const {
    query: { pid },
  } = req

  let result = {};

  try {
      if (req.method === 'POST') {
          if (pid === 'run') { 
              //result = await runMegaUpload();
          } else {
              throw("Invalid pid");
          }
      } else {
          throw("Invalid request type for airtable");
      }
      res.statusCode = 200;
  } catch(err) {
     if(!res.statusCode || res.statusCode === 200 ) res.statusCode = 500;
      result.error = err;
      console.log(err)
  } finally {
    res.json(result);
  }
}
