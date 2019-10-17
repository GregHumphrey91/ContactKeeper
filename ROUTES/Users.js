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
// ========================================================
//
//     THIS IS FOR REGISTRATION AND CREATE USER FORMS
//
// ========================================================

// ======================================================
//                   REGISTER USER
//
// @route       POST api/users
// @desc        Register a user
// @access      Public
//
// THIS METHOD WILL FIRST DO SERVER SIDE CHECKING FOR ALL POST FIELDS,
// RETURN ANY ERRORS, THEN IT WILL DESTRUCTURE THE POST VARIABLES
// AND IF NO USER EXISTS, WILL CREATE A NEW USER,
// HASH THE PASSWORD THEN SAVE TO DATABASE
// ====================================================
// STEP 1 SET POST ROUTE
router.post(
  "/", // Endpoint

  [
    // STEP 2:  Type Checking
    check("name", "Please add name")
      .not()
      .isEmpty(),
    check("email", "Please include valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],

  // STEP 3:  BEGIN CALLBACK
  async (request, response) => {
    // Error Checking for Request Object
    const errors = validationResult(request);

    // If Error, return a json error object
    if (!errors.isEmpty()) {
      // Error Result
      return response.status(400).json({ errors: errors.array() });
    }

    // Destructure Post fields
    const { name, email, password } = request.body;

    // Try Catch block
    try {
      // user equals the mongoose user model that finds the matching email
      let user = await User.findOne({ email });

      // matching user
      if (user) {
        // return user already exists
        return response.status(400).json({ msg: "User already exists" });
      } else {
        // CREATE THE USER FROM USER MODEL AND PASS IN POST VARIABLES
        user = new User({
          name,
          email,
          password
        });

        // SALT FOR PASSWORD HASH
        const salt = await bcrypt.genSalt();

        // HASH THE PASSWORD
        user.password = await bcrypt.hash(password, salt);

        // SAVE THE USER IN MONGOOSE
        await user.save();

        // RETURN A WEB TOKEN WITH THE USER ID AS THE PAYLOAD (RETURN OBJECT)
        const payload = {
          user: {
            id: user.id
          }
        };
        //PARAMS! = 1: The Payload, 2: create the JWT inside a config file, 3: expriration time in seconds  4: Callback with Error & Token
        jwt.sign(
          payload, // 1 the payload object
          config.get("jwtSecret"), // 2 the config file
          { expiresIn: 36000 }, // 3 the expiration date
          (error, token) => {
            // 4 the callback func for returning token
            if (error) throw error;
            response.status(200).json({ token });
          }
        );
      }
    } catch (error) {
      console.error(error.message);
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
    // Returns all users into a json Object
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
    const user = await User.findOne({ _id: id });

    if (user) {
      return response.status(200).json({ User: user });
    } else {
      return response.status(201).json({ msg: "User Not Found" });
    }
  } catch (error) {
    throw error;
  }
});
// ======================================================
//                   UPDATE USER
//
// @route       GET api/users
// @desc        GETS a user
// @access      Public
//
//
// ====================================================
// router.put("/:id", async (request, response) => {
//   const { id } = request.params;

//   const editUser = await User.findOne({ _id: id });

//   if (editUser) {
//     const { name, email, password } = request.body;
//     console.log(editUser);

//     editUser({
//       name,
//       email,
//       password
//     });

//     // SALT FOR PASSWORD HASH
//     const salt = await bcrypt.genSalt(10);

//     // HASH THE PASSWORD
//     editUser.password = await bcrypt.hash(password, salt);
//     await editUser.save();
//     return response.status(200).json({ editUser });
//   } else {
//     return response.status(404).json({ msg: "That user wasn't found" });
//   }
// });
// ======================================================
//                   DELETE USER
//
// @route       GET api/users
// @desc        GETS a user
// @access      Public
//
//
// ====================================================
router.delete("/:id", (request, response) => {
  response.json({ msg: "Delete User" });
});

module.exports = router;
