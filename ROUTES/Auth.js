const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../MODELS/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const middleware = require("../MIDDLEWARE/Auth");

// =============================
//
//      @route     POST api/auth
//      @desc      Login User
//      @access   Public
//
// =============================
router.post(
  "/",
  [
    // Express Validation
    check("email", "Please include valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (request, response) => {
    // Set errors
    const errors = validationResult(request);

    // Return if error
    if (!errors.isEmpty()) {
      // Error Result
      return response.status(400).json({ msg: errors.array()[0].msg });
    }
    const { email, password } = request.body;

    try {
      // Find user by email
      let user = await User.findOne({ email });

      // If no user found
      if (!user) {
        return response.status(400).json({ msg: "Invalid Credentials" });
      } else {
        //  compare Input password with User's password
        const isMatch = await bcrypt.compare(password, user.password);

        // If not matching
        if (!isMatch) {
          return response.status(400).json({ msg: "Wrong Password !" });
        } else {
          // Return JWT
          const payload = {
            user: {
              id: user.id,
              name: user.name
            }
          };
          jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
              expiresIn: "15min"
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

// =============================
//
//      @route     GET api/auth
//      @desc      Get Logged In User
//      @access   Private
//
// =============================
router.get("/", middleware, async (request, response) => {
  try {
    const { id } = request.user;

    // Find and return user (hide password)
    const user = await User.findById(id).select("-password");
    response.status(200).json({ user: user });
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
});

module.exports = router;
