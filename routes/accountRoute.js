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
// Route to build Account Update View
router.get("/update-account", utilities.handleErrors(accountController.buildAccountUpdateView));

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

// process logout
router.post("/logout", utilities.handleErrors(accountController.accountLogout))

// Route to update account info
router.post(
  "/update-account",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to update password
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)


module.exports = router;