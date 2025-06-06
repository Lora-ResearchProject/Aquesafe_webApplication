const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");
const { createDefaultAdmin } = require("./services/adminCreateService");

dotenv.config();

const PORT = process.env.PORT || 7002;

connectDB();
createDefaultAdmin();

app.listen(PORT, () => {
  console.log(`Aquesafe backend server running on ${PORT}`);
});
