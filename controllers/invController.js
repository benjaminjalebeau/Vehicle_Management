const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build managment inv view
 * ************************** */
invCont.buildVehManView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {title: "Vehicle Management", nav, errors: null,})
}

/* ***************************
 *  Build add classifaction view
 * ************************** */
invCont.buildAddClassView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
     nav,
     errors: null,
    })
}

/* ***************************
 *  Build  add vehicle view
 * ************************** */
invCont.buildAddVehView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let select = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle", 
    nav, 
    select,
    errors: null,
  })
}

/* ****************************************
*  Adds the New Classification
* *************************************** */
invCont.registerClass = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClass(classification_name)

  if (regResult) {
    req.flash(
      "notice",
      `Success, you\'ve added the ${classification_name} classification.`
    )
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, we were unable to add the classification")
    res.status(501).render("inventory/management", {
      title: "Vehicle Management", 
      nav
    })
  }
}

/* ****************************************
*  Adds the New Vehicle
* *************************************** */
invCont.registerInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { 
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail
   } = req.body

  const regResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Success, you\'ve added ${inv_year + " " +inv_make + " " +inv_model} to the inventory.`
    )
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, we were unable to add the vehicle")
    res.status(501).render("./inventory/management", {
      title: "Vehicle Management", 
      nav
    })
  }
}



/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  if (data[0] !== undefined){
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })}
  else {
    res.render("./inventory/classification", {
      title: "Missing Inventory",
      nav,
      grid,
    })
  }
}

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryGrid(data)
  let nav = await utilities.getNav()
  const vehicle = data[0]
  if (vehicle !== undefined){
    res.render("./inventory/inventory", {
      title: vehicle.inv_year + " " + vehicle.inv_make + " " +vehicle.inv_model,
      nav,
      grid,
  })}
  else{
    res.render("./inventory/inventory", {
      title: "Missing Vehicle",
      nav,
      grid,
  })
}

/* ***************************
 *  Sets up an error to be had
 * ************************** */
invCont.buildErrorByInventoryId = async function (req, res, next) {
  const inventory_id = "cake";
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryGrid(data)
  let nav = await utilities.getNav()
  const vehicle = data[0]
  res.render("./inventory/inventory", {
    title: vehicle.inv_year + " " + vehicle.inv_make + " " +vehicle.inv_model,
    nav,
    grid,
  })}
}


module.exports = invCont