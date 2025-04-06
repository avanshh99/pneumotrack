const fs = require('fs');
const path = require('path');

const doctorsFilePath = path.join(__dirname, '..', 'data', 'doctors.json');

const readDoctors = () => {
  const data = fs.readFileSync(doctorsFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeDoctors = (doctors) => {
  fs.writeFileSync(doctorsFilePath, JSON.stringify(doctors, null, 2));
};

const extractFirstName = (fullName) => {
  const cleaned = fullName
    .replace(/^Dr\.?\s*/i, '')
    .trim()
    .split(' ')[0];

  if (/^[A-Za-z](\.[A-Za-z])*\.?$/.test(cleaned)) {
    return cleaned.replace(/\./g, '').toLowerCase();
  }

  return cleaned.toLowerCase();
};

module.exports = { readDoctors, writeDoctors, extractFirstName };
