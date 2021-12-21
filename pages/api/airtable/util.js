import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();


Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

const NEWSLETTER_OPTIONS = ["Already on it", "Add me", "No thanks"];

function airtableBase() {
  return base;
}

function getNewsletterOptions() {
  return NEWSLETTER_OPTIONS;
}

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

export {
  createRecord,
  updateRecord,
  getRecordById,
  getRecords,
  getNewsletterOptions,
  airtableBase
}
