const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 7002;

app.listen(PORT, () => {
  console.log(`Aquesafe backend server running on ${PORT}`);
});
