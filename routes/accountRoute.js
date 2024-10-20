// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')


// Route to Build Account View
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountView))
// Route to build Login Form
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build Registration Form
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to Register the Client
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)


module.exports = router;