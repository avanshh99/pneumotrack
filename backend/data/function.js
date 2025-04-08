// import { readFileSync, writeFileSync } from 'fs';

// // Function to read the input JSON file
// function readJsonFile(filePath) {
//   try {
//     const data = readFileSync(filePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     console.error('Error reading JSON file:', error);
//     return [];
//   }
// }

// // Function to write the output JSON file
// function writeJsonFile(filePath, data) {
//   try {
//     writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
//     console.log('New JSON file with unique doctors has been created.');
//   } catch (error) {
//     console.error('Error writing JSON file:', error);
//   }
// }

// // Function to remove duplicate doctors (based on name and hospital)
// function removeDuplicateDoctors(doctorsList) {
//   const uniqueDoctors = new Map(); // Using Map to store unique doctors

//   doctorsList.forEach(doctor => {
//     const key = `${doctor.name}-${doctor.hospital}`; // Create a unique key based on name and hospital

//     // If this doctor (name + hospital) hasn't been seen before, add it
//     if (!uniqueDoctors.has(key)) {
//       uniqueDoctors.set(key, doctor);
//     } else {
//       // Optionally, you can merge availability if the same doctor works at the same hospital on different days
//       const existingDoctor = uniqueDoctors.get(key);
//       const newAvailability = [...new Set([...existingDoctor.availability, ...doctor.availability])]; // Merge unique availability days
//       existingDoctor.availability = newAvailability;
//     }
//   });

//   // Convert Map values back to array
//   return Array.from(uniqueDoctors.values());
// }

// // Main function to process the JSON
// function processDoctors(inputFilePath, outputFilePath) {
//   // Read the input JSON file
//   const doctorsList = readJsonFile(inputFilePath);

//   if (!Array.isArray(doctorsList)) {
//     console.error('Input JSON must be an array of doctors.');
//     return;
//   }

//   // Remove duplicates
//   let counter = 1;
//   const uniqueDoctors = removeDuplicateDoctors(doctorsList);
//   uniqueDoctors.forEach(element => {
//     element.id = counter++;
//   });

//   // Write the unique doctors to a new JSON file
//   writeJsonFile(outputFilePath, uniqueDoctors);
// }

// // Example usage
// const inputFilePath = 'doctorsList.json'; // Path to your input JSON file
// const outputFilePath = 'uniqueDoctorsList.json'; // Path for the output JSON file

// processDoctors(inputFilePath, outputFilePath);