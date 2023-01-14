const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const dotenv = require('dotenv');
dotenv.config()
const app = require('./app');


const { HOST_URI} = process.env;
async function main() {
  try {
  mongoose.connect(HOST_URI);
 console.log("Database connection successful");
    app.listen(3001, () => {
      console.log("server is listening on port 3001");
    });
  } catch (error) {
     console.error(error.message);
    process.exit(1);
  }
}

main();