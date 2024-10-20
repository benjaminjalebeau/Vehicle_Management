const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build managment inv view
 * ************************** */
invCont.buildVehManView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {title: "Vehicle Management", nav, errors: null, classificationSelect, accountName})
}

/* ***************************
 *  Build add classifaction view
 * ************************** */
invCont.buildAddClassView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
     nav,
     accountName,
     errors: null,
    })
}

/* ***************************
 *  Build  add vehicle view
 * ************************** */
invCont.buildAddVehView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  let select = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle", 
    nav, 
    select,
    accountName,
    errors: null,
  })
}

/* ****************************************
*  Adds the New Classification
* *************************************** */
invCont.registerClass = async function (req, res) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
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
      accountName,
      nav
    })
  }
}

/* ****************************************
*  Adds the New Vehicle
* *************************************** */
invCont.registerInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
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
      accountName,
      nav
    })
  }
}

/* ****************************************
*  Updates a vehicle's information
* *************************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const { 
    inv_id,
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

  const updateResult = await invModel.updateInventory(
    inv_id,
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "notice",
      `Success, you\'ve updated ${itemName} in the inventory.`
    )
    res.redirect("/inv")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    accountName,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
  const accountName = utilities.checkLoginName(res.locals)
  if (data[0] !== undefined){
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    accountName,
    grid,
  })}
  else {
    res.render("./inventory/classification", {
      title: "Missing Inventory",
      nav,
      accountName,
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
  const accountName = utilities.checkLoginName(res.locals)
  const vehicle = data[0]
  if (vehicle !== undefined){
    res.render("./inventory/inventory", {
      title: vehicle.inv_year + " " + vehicle.inv_make + " " +vehicle.inv_model,
      nav,
      accountName,
      grid,
  })}
  else{
    res.render("./inventory/inventory", {
      title: "Missing Vehicle",
      nav,
      accountName,
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
  const accountName = utilities.checkLoginName(res.locals)
  const vehicle = data[0]
  res.render("./inventory/inventory", {
    title: vehicle.inv_year + " " + vehicle.inv_make + " " +vehicle.inv_model,
    nav,
    accountName,
    grid,
  })}
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit vehicle view
 * ************************** */
invCont.buildEditView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const returnedData = await invModel.getInventoryByInventoryId(inv_id)
  const data = returnedData[0]
  const select = await utilities.buildClassificationList(data.classification_id)
  const name = ` ${data.inv_make} ${data.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit" + name, 
    nav, 
    accountName,
    select,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}

/* ***************************
 *  Build delete vehicle view
 * ************************** */
invCont.buildConfirmationView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const returnedData = await invModel.getInventoryByInventoryId(inv_id)
  const data = returnedData[0]
  const name = ` ${data.inv_make} ${data.inv_model}`

  res.render("./inventory/delete-inventory", {
    title: "Delete" + name, 
    nav, 
    accountName,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
  })
}

/* ****************************************
*  Deletes a vehicle
* *************************************** */
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  const {inv_id, inv_make, inv_model} = req.body
  const itemName = inv_make + " " + inv_model
  const updateResult = await invModel.deleteInventory(parseInt(inv_id))

  if (updateResult) {
    
    req.flash(
      "notice",
      `Success, you\'ve deleted ${itemName} in the inventory.`
    )
    res.redirect("/inv")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    accountName,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}



module.exports = invCont