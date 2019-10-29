const express = require("express");
const router = express.Router();
const middleware = require("../MIDDLEWARE/Auth");
const Contacts = require("../MODELS/Contact");
const jwt = require("jsonwebtoken");
// TYPE CHECKING
const { check, validationResult } = require("express-validator");
// @route     GET api/contacts
// @desc      Get all users contacts
// @access    Private

router.get("/", middleware, async (request, response) => {
  try {
    // CHECKS THE CONTACTS IN THE DATABASE MODEL BY THE USER ID (ASSOCIATION FIELD WHICH BELONGS TO PARENT TABLE)
    const allContacts = await Contacts.find({ user: request.user.id }).sort({
      date: -1
    });

    // IF THERE'S CONTACTS THEN RETURN THEM IN  RES.JSON
    if (allContacts.length !== 0) {
      response.status(200).json({ UserContacts: allContacts });
    } else {
      const token = request.headers["x-auth-token"];
      const decodedToken = jwt.decode(token);

      noContacts = [
        {
          user: decodedToken.user.id
        }
      ];
      response.status(200).json({ UserContacts: noContacts });
    }
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
});

// @route     POST api/contacts
// @desc      CREATE NEW CONTACT
// @access    Private
router.post(
  "/",
  middleware,
  [
    check("name", "Please enter a name")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail()
  ],
  async (request, response) => {
    try {
      const { name, email, phone, type, user } = request.body;

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        console.log(errors.array());
        return response.status(500).json({ msg: errors.array()[0].msg });
      }
      const newContact = new Contacts({
        name,
        email,
        phone,
        type,
        // REMEMBER TO SET USER ID FOR PARENT ASSOCIATIONS
        user: user
      });

      const contact = await newContact.save();

      response.status(200).json({
        msg: "Contact Created",
        Contact: contact,
        ParentTableUser: user
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ msg: error.message });
    }
  }
);

// @route     PUT api/contacts
// @desc      EDIT EXISTING CONTACT
// @access    Private
router.put("/:id", middleware, async (request, response) => {
  const { name, email, phone, type } = request.body;

  // STRUCTURE THE FIELDS TO CHANGE

  const contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    // FIND THE MATCHING CONTACT
    let contact = await Contacts.findById(request.params.id);
    // MAKE SURE THE CONTACT EXISTS
    if (!contact)
      return response.status(404).json({ msg: "No Contact Was Found" });

    // COMPARES THE PARENT ID TO THE PARAMETERS ID TO MAKE SURE WE AREN'T GETTING A DIFFERENT ACCOUNT'S CONTACT
    if (contact.user.toString() !== request.user.id) {
      return response.status(400).json({ msg: "Not Authorized" });
    }
    // FIND THE CONTACT AND UPDATE IT WITH THE NEW FIELDS
    contact = await Contacts.findByIdAndUpdate(
      request.params.id,
      { $set: contactFields },
      { new: true }
    );

    response.status(200).json({ NewContact: contactFields });
  } catch (err) {
    throw err;
  }
});

// @route     DELETE api/contacts
// @desc      DELETE A CONTACT
// @access    Private
router.delete("/:id", middleware, async (request, response) => {
  try {
    // FIND THE MATCHING CONTACT
    let contact = await Contacts.findById(request.params.id);

    // MAKE SURE THE CONTACT EXISTS
    if (!contact)
      return response.status(404).json({ msg: "No Contact Was Found" });

    // Make sure were not deleted someone else's contact
    if (contact.user.toString() !== request.user.id) {
      return response.status(400).json({ msg: "Not Authorized" });
    }

    await Contacts.findByIdAndRemove(request.params.id);
    const allContacts = await Contacts.find({ user: request.user.id }).sort({
      date: -1
    });
    console.log(request.user.id, allContacts);

    response.status(200).json({ UserContacts: allContacts });
  } catch (err) {
    response.status(500).send(err.message);
  }
});

module.exports = router;
