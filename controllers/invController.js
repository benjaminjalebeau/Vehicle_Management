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
 *  Build management add classifaction view
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
 *  Build management add vehicle view
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