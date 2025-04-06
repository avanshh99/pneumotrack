const express = require('express');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/doctor', doctorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
