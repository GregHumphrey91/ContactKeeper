const express = require("express");
const router = express.Router();
const middleware = require("../MIDDLEWARE/Auth");
const Contacts = require("../MODELS/Contact");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// =============================
//
//      @route     GET api/contacts
//      @desc      Get all users contacts
//      @access    Private
//
// =============================
router.get("/", middleware, async (request, response) => {
  try {
    // Get contacts by matching user id
    const allContacts = await Contacts.find({ user: request.user.id }).sort({
      date: -1
    });

    // Return all contacts
    if (allContacts.length !== 0) {
      response.status(200).json({ UserContacts: allContacts });
    } else {
      // For bug fix purposes
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
// ====================================
//
//      @route     POST api/contacts
//      @desc      CREATE NEW CONTACT
//       @access    Private
//
// ====================================
router.post(
  "/",
  middleware,
  [
    // Express Validation
    check("name", "Please enter a name")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail()
  ],
  async (request, response) => {
    try {
      const { name, email, phone, type, user } = request.body;

      // Set Errors
      const errors = validationResult(request);

      // Return if error
      if (!errors.isEmpty()) {
        return response.status(500).json({ msg: errors.array()[0].msg });
      }
      // Save new contact
      const newContact = new Contacts({
        name,
        email,
        phone,
        type,
        // User ID for parent table association (mongo foreign key)
        user: user
      });

      // Save contact
      const contact = await newContact.save();

      // Return new contact
      response.status(200).json({
        msg: "Contact Created",
        Contact: contact,
        ParentTableUser: user
      });
    } catch (error) {
      response.status(500).json({ msg: error.message });
    }
  }
);
// ===================================
//
//        @route     PUT api/contacts
//        @desc      EDIT EXISTING CONTACT
//        @access    Private
//
// ===================================

router.put("/:id", middleware, async (request, response) => {
  const { name, email, phone, type } = request.body;

  const contactFields = {};

  // Updates based on entry
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    // Find match
    let contact = await Contacts.findById(request.params.id);

    //  If no match found
    if (!contact)
      return response.status(404).json({ msg: "No Contact Was Found" });

    // Compare foreign keys to ensure we return the right user's contacts
    if (contact.user.toString() !== request.user.id) {
      return response.status(400).json({ msg: "Not Authorized" });
    }
    // Find by ID and update existing
    contact = await Contacts.findByIdAndUpdate(
      request.params.id,
      { $set: contactFields },
      { new: true }
    );

    // Return mutated contact
    response.status(200).json({ NewContact: contactFields });
  } catch (err) {
    throw err;
  }
});
// ==========================================
//
//         @route     DELETE api/contacts
//         @desc      DELETE A CONTACT
//         @access    Private
//
// ==========================================
router.delete("/:id", middleware, async (request, response) => {
  try {
    // Find matching contact
    let contact = await Contacts.findById(request.params.id);

    // If no contact exists
    if (!contact)
      return response.status(404).json({ msg: "No Contact Was Found" });

    // Compare foreign keys to ensure we don't delete a different user's contact
    if (contact.user.toString() !== request.user.id) {
      return response.status(400).json({ msg: "Not Authorized" });
    }

    // Find & remove contact
    await Contacts.findByIdAndRemove(request.params.id);

    // Find remaining contacts
    const allContacts = await Contacts.find({ user: request.user.id }).sort({
      date: -1
    });

    // Return list of remaining contacts
    response.status(200).json({ UserContacts: allContacts });
  } catch (err) {
    response.status(500).send(err.message);
  }
});

module.exports = router;
