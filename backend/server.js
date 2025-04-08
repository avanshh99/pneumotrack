const express = require('express');
const cors = require('cors');
const path = require('path');
const doctorRoutes = require('./routes/doctorRoutes');
const xrayRoutes = require('./routes/xray'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());



app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/api/doctor', doctorRoutes); // api/doctor/getDoctors?pincode=<six-digit pin>&age=<integer>

app.use('/api',xrayRoutes); 

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
