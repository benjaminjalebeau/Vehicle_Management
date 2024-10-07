// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build Login Form
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build Registration Form
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to Register the Client
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )


module.exports = router;