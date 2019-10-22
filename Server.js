const express = require("express");
const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
// // Initialize Middleware for JSON ?
// app.use(express.json({ extended: false }));

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

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
