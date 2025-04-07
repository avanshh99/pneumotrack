const express = require('express');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoutes');
const xrayRoutes = require('./routes/xray'); // Assuming you have a file named xray.js in the routes folder

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/doctor', doctorRoutes); // api/doctor/getDoctors?pincode=<six-digit pin>&age=<integer>

app.use('/api',xrayRoutes); // api/upload-xray

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
