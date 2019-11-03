const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const bodyParser = require("body-parser");

//BodyParser settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Init cors
app.use(cors());

// Define Port
const PORT = process.env.PORT || 5000;

// Env Vars
const db = config.get("mongoURI");

// Connect Mongo
const connectDB = () => {
  return mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .catch(error => console.error(error.message));
};

//  Routes
app.use(`/api/users`, require("./ROUTES/Users"));
app.use(`/api/auth`, require("./ROUTES/Auth"));
app.use(`/api/contacts`, require("./ROUTES/Contacts"));

// Production Routes
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  // If any other routes are hit, load the index.html file inside the __dirname/client/build folder
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

// Run Server
connectDB().then(
  app.listen(PORT, () => console.log(`Server started on ${PORT}`))
);
