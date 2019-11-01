const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

const PORT = process.env.PORT || 5000;

try {
  // Connect Database
  // IMPORT DATABASE CONFIG
  const connectDB = require("./CONFIG/DB");

  connectDB();
} catch (error) {
  console.log(error.message);
}

// API ENDPOINTS
app.use(`/api/users`, require("./ROUTES/Users"));
app.use(`/api/auth`, require("./ROUTES/Auth"));
app.use(`/api/contacts`, require("./ROUTES/Contacts"));

// Serve Static Assets In Production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  // If any other routes are hit, load the index.html file inside the __dirname/client/build folder
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

console.log(path.resolve(__dirname));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
