const express = require("express");
const bcrypt = require("bcryptjs");
// TYPE CHECKING
const { check, validationResult } = require("express-validator");
// IMPORT THE MONGO DB USERS MODEL
const User = require("../MODELS/User");
// IMPORT JSON WEB TOKEN
const jwt = require("jsonwebtoken");
// IMPORT CONFIG
const config = require("config");
const router = express.Router();

// IMPORT MIDDLEWARE TO CHECK FOR TOKEN AUTH
const middleware = require("../MIDDLEWARE/Auth");

// ========================================================
//
//            THIS IS FOR THE LOGIN FORM
//
//
// ========================================================

// AUTHENTICATE USER AND RETURN A TOKEN (LOGIN COMPONENT)
router.post(
  "/",
  [
    // TYPE CHECKIUNG
    check("email", "Please include valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (request, response) => {
    // ERROR OBJECT IS THE VALIDATION RESULT LIBRARY
    const errors = validationResult(request);

    // If Error, return a json error object
    if (!errors.isEmpty()) {
      // Error Result
      return response.status(400).json({ errors: errors.array() });
    }

    // Destructure REQUEST BODY
    const { email, password } = request.body;

    try {
      // FINDS THE USER IN DATABASE BY EMAIL
      let user = await User.findOne({ email });

      // IF NO USER, RETURN 400
      if (!user) {
        return response.status(400).json({ msg: "Invalid Credentials" });
      } else {
        // COMPARE PASSWORD FROM POST PASSWORD TO FOUND USERS PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);

        // IF PASSWORDS DONT MATCH RETURN 400
        if (!isMatch) {
          return response.status(400).json({ msg: "Wrong Password !" });
        } else {
          // IF THEY DO RETURN A JSON WEB TOKEN

          // The payload for the jwt.sign Func, YOU CAN RETURN ANYTHING U WANT IN THE TOKEN AND ENCRYPT IT HERE
          // Ex:  users id, name, password (not safe)
          const payload = {
            user: {
              id: user.id,
              name: user.name
            }
          };
          // Creates the web token to send
          jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
              expiresIn: 36000
            },
            async (error, token) => {
              if (error) throw error;
              response.status(200).json({ token: token });
            }
          );
        }
      }
    } catch (error) {
      response.status(500).json({ msg: error.message });
    }
  }
);

// GET LOGGED IN USER

// @Route   Get api/auth
// @desc    Get Logged In User
// @access  Private
router.get("/", middleware, async (request, response) => {
  try {
    const { id } = request.user;
    const user = await User.findById(id).select("-password");
    response.status(200).json({ user: user });
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
});

module.exports = router;
