const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
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