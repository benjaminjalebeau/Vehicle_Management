const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccountView(req, res, next) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const accountType = res.locals.accountData.account_type
  res.render("account/account", {
    title: "Account Management",
    nav,
    accountName,
    accountType,
    errors: null,
  })
}




/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const accountName = utilities.checkLoginName(res.locals)
    res.render("account/login", {
      title: "Login",
      nav,
      accountName,
      errors: null,
    })
  }


  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  res.render("account/register", {
    title: "Register",
    nav,
    accountName,
    errors: null,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      accountName,
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      accountName,
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      accountName,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("message notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      accountName,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        accountName,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.cookie("jwt", '', { httpOnly: true, maxAge: 0 })
  console.log("logging out")
  res.redirect("/")
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccountUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  const accountId = res.locals.accountData.account_id
  const accountName = utilities.checkLoginName(res.locals)
  const data = await accountModel.getAccountById(accountId)
  res.render("account/update-account", {
    title: "Edit Your Account",
    nav,
    accountName,
    accountType: data.account_type,
    errors: null,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id
  })
}


/* ****************************************
 *  Process account Update
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const accountType = res.locals.accountData.account_type
  const accountName = utilities.checkLoginName(res.locals)
  const { 
    account_firstname,
    account_lastname,
    account_email, 
    account_id
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname, 
    account_lastname,
    account_email,
    account_id
  )
  if (updateResult) {
    req.flash(
      "notice",
      `Success, you\'ve updated your account information!.`
    )
    res.redirect("/account")
    return
  }else {
      req.flash("message notice", "Information could not be updated, try again.")
      res.status(501).render("account/update-account", {
        title: "Edit Your Account",
        nav,
        accountName,
        accountType,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }
  } 

  /* ****************************************
 *  Process password Update
 * ************************************ */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const accountType = res.locals.accountData.account_type
  const accountName = utilities.checkLoginName(res.locals)
  const { 
    account_password,
    account_firstname,
    account_lastname,
    account_email, 
    account_id 
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/update-account", {
      title: "Edit Your Account",
      nav,
      accountName,
      accountType,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )
  if (updateResult) {
    req.flash(
      "notice",
      `Success, you\'ve updated your account password!.`
    )
    res.redirect("/account")
    return
  }else {
      req.flash("message notice", "Password could not be updated, try again.")
      res.status(501).render("account/update-account", {
        title: "Edit Your Account",
        nav,
        accountName,
        accountType,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }
  }

  
  module.exports = { 
    buildLogin, buildRegister, registerAccount,
    accountLogin, buildAccountView, buildAccountUpdateView, 
    updateAccount, updatePassword, accountLogout
  }