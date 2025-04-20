const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db'); // Import the database connection
const path = require('path');
const doctorRoutes = require('./routes/doctorRoutes');
const xrayRoutes = require('./routes/xray'); // Assuming you have a file named xray.js in the routes folder
const recordRoutes = require('./routes/recordRoutes'); // Assuming you have a file named record.js in the routes folder

// const doctorMapRoutes = require('./routes/doctorMap'); // Assuming you have a file named doctorMap.js in the routes folder  
const doctorRecordRoutes = require('./routes/doctorRecord'); // Assuming you have a file named doctorRecord.js in the routes folder

const doctorAuth = require('./routes/doctorsAuth'); 

const userAuth = require('./routes/userAuth'); 


const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());



app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/api/doctor', doctorRoutes); // api/doctor/getDoctors?pincode=<six-digit pin>&age=<integer>
app.use('/api/docauth/', doctorAuth); // api/docauth/signup or api/docauth/login

app.use('/api', xrayRoutes); // api/upload-xray

app.use('/api', recordRoutes); // api/addRecord

// app.use('/api', doctorMapRoutes); // api/assignPatient remove this later // todo 

app.use('/api',doctorRecordRoutes); // api/assignRecord

app.use('/api/users',userAuth);

//http://localhost:5000/api/getRecords/t1

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
