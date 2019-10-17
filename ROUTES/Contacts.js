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
router.delete("/", middleware, (request, response) => {
  response.json({ msg: "Contacts" });
});

module.exports = router;
