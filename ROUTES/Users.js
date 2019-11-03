const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../MODELS/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

// ======================================================
//                   REGISTER USER
//
// @route       POST api/users
// @desc        Register a user
// @access      Public
//
// THIS METHOD WILL FIRST DO SERVER SIDE CHECKING FOR ALL POST FIELDS,
// RETURN IF ANY ERRORS, THEN IT WILL DESTRUCTURE THE POST VARIABLES
// AND IF NO USER EXISTS, WILL CREATE A NEW USER,
// HASH THE PASSWORD THEN SAVE TO DATABASE
// ====================================================

router.post(
  "/",
  [
    // Express Validation
    check("name", "Please add name")
      .not()
      .isEmpty(),
    check("email", "Please include valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (request, response) => {
    // Set errors to result
    const errors = validationResult(request);

    // Return if error
    if (!errors.isEmpty()) {
      return response.status(400).json({ msg: errors.array()[0].msg });
    }

    const { name, email, password } = request.body;

    try {
      // Matches by Email
      let user = await User.findOne({ email });

      // If user exists
      if (user) {
        return response.status(400).json({ msg: "User already exists" });
      } else {
        // Create new user
        user = new User({
          name,
          email,
          password
        });

        // generate rounds
        const salt = await bcrypt.genSalt();
        // hash pass
        user.password = await bcrypt.hash(password, salt);

        // Save new user
        await user.save();

        // Return JWT
        const payload = {
          user: {
            id: user.id
          }
        };
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: "3hr" },
          (error, token) => {
            if (error) throw error;
            response.status(200).json({ token });
          }
        );
      }
    } catch (error) {
      response.status(500).send("Server Error \n " + error.message);
    }
  }
);
// =====================================================

// ======================================================
//                   GET ALL USERS
//
// @route       GET api/users
// @desc        GETS a user
// @access      Public
//
//
// ====================================================

router.get("/", async (request, response) => {
  // Checks mongoose for all entries
  const users = await User.find();
  if (users) {
    // Returns all users into a JSON Object
    response.status(200).json({ Users: users });
  } else {
    // Returns if no users in database
    response.status(404).json({ msg: "No Users In Database" });
  }
});

// ======================================================
//                   GET SPECIFIC USER
//
// @route       GET api/users
// @desc        GETS a user
// @access      Public
//
//
// ====================================================

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    // Find by ID
    const user = await User.findOne({ _id: id });
    // Return if matching
    if (user) {
      return response.status(200).json({ User: user });
    } else {
      return response.status(201).json({ msg: "User Not Found" });
    }
  } catch (error) {
    throw error;
  }
});

// router.delete("/:id", (request, response) => {
//   response.json({ msg: "Delete User" });
// });

module.exports = router;
