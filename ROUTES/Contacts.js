const express = require("express");
const router = express.Router();
const middleware = require("../MIDDLEWARE/Auth");
const Contacts = require("../MODELS/Contact");

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
      console.log(allContacts);
      response.status(200).json({ UserContacts: allContacts });
    } else {
      response.status(404).json({ msg: "No Contacts Exist" });
    }
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
});

// @route     POST api/contacts
// @desc      CREATE NEW CONTACT
// @access    Private
router.post("/", middleware, async (request, response) => {
  try {
    const { name, email, phone, type } = request.body;

    const newContact = new Contacts({
      name,
      email,
      phone,
      type,
      // REMEMBER TO SET USER ID FOR PARENT ASSOCIATIONS
      user: request.user.id
    });

    const contact = await newContact.save();

    response.status(200).json({
      msg: "Contact Created",
      Contact: contact,
      ParentTableUser: request.user
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ msg: error.message });
  }
});

// @route     PUT api/contacts
// @desc      EDIT EXISTING CONTACT
// @access    Private
router.put("/", middleware, (request, response) => {
  response.json({ msg: "Contacts" });
});

// @route     DELETE api/contacts
// @desc      DELETE A CONTACT
// @access    Private
router.delete("/", middleware, (request, response) => {
  response.json({ msg: "Contacts" });
});

module.exports = router;
