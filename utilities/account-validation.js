const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")



  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

    /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
    validate.loginRules = () => {
      return [

        // valid email is required and must exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (!emailExists){
            throw new Error("Not a registered email, please check email or register account.")
          }
        }),
    
        // password is required and must be strong password
        body("account_password")
          .trim()
          .notEmpty()
          //.custom(async (account_password, account_email) => {
          //  const passwordExists = await accountModel.checkExistingpassword(account_password, account_email)
          //  if (!passwordExists){
          //   throw new Error("A matching password is required")
          //  }
          //})
          .withMessage("Incorrect Password, try again."),
      ]
    }

  /*  **********************************
  *  Update Account Validation Rules
  * ********************************* */
  validate.updateRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, {req}) => {

        const accountId = req.body.account_id
        const emailExists = await accountModel.checkOtherEmail(account_email, accountId)
        if (emailExists){
          throw new Error("Another account already has this email, try a different one.")
        }
      }),
    ]
  }


  /*  **********************************
  *  Update Password Validation Rules
  * ********************************* */
  validate.updatePasswordRules = () => {
    return [
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

    /*  **********************************
  *  Update Account Type Validation Rules
  * ********************************* */
    validate.accountTypeRules = () => {
      return [
        // Make sure an account is sekected
        body("account_id")
        .trim()
        .escape()
        .notEmpty()
        .custom(async (account_id) => {
          if (!account_id){
            throw new Error("Please select an account.")
          }
        }),
        // Make sure a account type is selected
        body("account_type")
        .trim()
        .escape()
        .notEmpty()
        .custom(async (account_type) => {
          if (!account_type){
            throw new Error("Please select an account type.")
          }
        })
      ]
    }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const accountName = utilities.checkLoginName(res.locals)
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        accountName,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

    /* ******************************
 * Check data and return errors or login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
  const { account_email, account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountName = utilities.checkLoginName(res.locals)
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      accountName,
      account_email,
      account_password,
    })
    return
  }
  next()
}

  /* ******************************
 * Check data and return errors for account update
 * ***************************** */
  validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const accountName = utilities.checkLoginName(res.locals)
      const accountType = res.locals.accountData.account_type
      res.render("account/update-account", {
        title: "Edit Your Account",
        nav,
        accountName,
        accountType,
        errors,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
      return
    }
    next()
  }

    /* ******************************
 * Check data and return errors for account update
 * ***************************** */
    validate.checkAccountTypeData = async (req, res, next) => {
      const { account_firstname, account_lastname, account_email, account_id } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.buildAccountList()
        const accountName = utilities.checkLoginName(res.locals)
        res.render("account/update-account-types", {
          title: "Authorization Management",
          nav,
          accountName,
          select,
          errors,
        })
        return
      }
      next()
    }

  module.exports = validate