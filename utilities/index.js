const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const Util = {}

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildInventoryGrid = async function(data){
  let grid = ""
  const vehicle = data[0]
  if(vehicle !== undefined){
    grid = '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors">'
    grid += '<div id="vehicle-details"><h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    grid += '<h3>Price: <span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></h3>'
    grid += '<h3>Description: <span>' + vehicle.inv_description + '</span></h3>'
    grid += '<h3>Color: <span>' + vehicle.inv_color + '</span></h3>'
    grid += '<h3>Miles: <span>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span></h3></div>'
  } else { 
    grid += '<p class="notice">Sorry, this vehicle could not be found.</p>'
  }
  return grid
}

/* **************************************
* Builds the select form element using stored classifications in the database
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" class="selectList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************
* Builds the select form element using stored accounts in the database
* ************************************ */
Util.buildAccountList = async function (account_id = null) {
  let data = await accModel.getAccounts()
  let accountList =
    '<select name="account_id" id="accountList" class="selectList" required>'
  accountList += "<option value=''>Choose an Account</option>"
  data.rows.forEach((row) => {
    accountList += '<option value="' + row.account_id + '"'
    if (
      account_id != null &&
      row.account_id == account_id
    ) {
      accountList += " selected "
    }
    accountList += ">" + row.account_email +" - " + row.account_type + "</option>"
  })
  accountList += "</select>"
  return accountList
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

  /* ****************************************
 *  Sets account name as null or as the logged in name.
 * ************************************ */
  Util.checkLoginName = (locals) => {
    let accountName = null;
    if (locals.loggedin) {
      accountName = locals.accountData.account_firstname
    } 
    return accountName
   }


    /* ****************************************
 *  Checks if logged into an authorized account.
 * ************************************ */
 Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    if (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin") {
      next()
    } else {
      req.flash("notice", "Access denied, login with an authorized account or request account change")
      return res.redirect("/account/login")
    }
  } else{
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

     /* ****************************************
 *  Checks if logged into an Admin account.
 * ************************************ */
     Util.checkAdmin = (req, res, next) => {
      if (res.locals.loggedin) {
        if (res.locals.accountData.account_type === "Admin") {
          next()
        } else {
          req.flash("notice", "Access denied, login with an authorized account or request account change")
          return res.redirect("/account/login")
        }
      } else{
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
      }
     }

module.exports = Util