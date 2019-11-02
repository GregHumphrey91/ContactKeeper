const mongoose = require("mongoose");
const config = require("./node_modules/config");

const db = config.get("mongoURI");

const connectDB = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(console.log("Mongo Connected"))
    .catch(error => console.error(error));
};

module.exports = connectDB;
