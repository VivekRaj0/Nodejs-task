const { workerData, parentPort } = require('worker_threads');
const csvtojson = require('csvtojson');
const xlsx = require('xlsx');
const fs = require('fs');

const { Agent, User, UserAccount, PolicyCategory, PolicyCarrier, PolicyInfo } = require('./model');

(async () => {
  const file = workerData;
  let data;

  if (file.endsWith('.csv')) {
    data = await csvtojson().fromFile(file);
  } else if (file.endsWith('.xlsx')) {
    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    data = xlsx.utils.sheet_to_json(sheet);
  }

  // Assuming data contains necessary fields, handle data insertion accordingly
  // Here is an example with User collection
  for (const item of data) {
    const user = new User(item);
    await user.save();
  }

  fs.unlinkSync(file); // Clean up uploaded file

  parentPort.postMessage('Data uploaded successfully');
})();
