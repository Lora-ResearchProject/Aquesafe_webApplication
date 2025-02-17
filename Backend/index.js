const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 7002;

connectDB();

app.listen(PORT, () => {
  console.log(`Aquesafe backend server running on ${PORT}`);
});
