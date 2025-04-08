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

const getAgeGroup = (age) => {
  const a = parseInt(age);
  if (a <= 12) return 'Child';
  if (a <= 17) return 'Adolescent';
  if (a <= 59) return 'Adult';
  return 'Senior';
};

const filterDoctorsByAgeAndLocation = (age, area) => {
  const doctors = readDoctors();
  const ageGroup = getAgeGroup(age);

  console.log('Doctors loaded:', doctors.length); 
  const targetLocation = area?.toLowerCase().trim();

  return doctors.filter((doc) => {
    const docLocation = doc.location?.area?.toLowerCase().trim();
    return (
      docLocation === targetLocation &&
      doc.age_groups.includes(ageGroup)
    );
  });
};

module.exports = {
  readDoctors,
  writeDoctors,
  extractFirstName,
  getAgeGroup,
  filterDoctorsByAgeAndLocation,
};
