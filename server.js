const express = require('express');
const cors = require('cors');

const leetcodeRoutes = require('./routes/leetcode');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/leetcode', leetcodeRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
