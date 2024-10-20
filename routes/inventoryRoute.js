// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')


//Routes to build views
router.get("/", utilities.checkAccountType ,utilities.handleErrors(invController.buildVehManView))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddVehView))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

//Route to get inventory from classification_id, and coverts it to json.
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route for editing vehicles view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditView))
//Route for deleting a vehicle view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildConfirmationView))

//Route for Updating a vehicle
router.post("/update/", utilities.handleErrors(invController.updateInventory))

//Route for Deleting a vehicle
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))
//Post route for adding new classifications
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassData,
    utilities.handleErrors(invController.registerClass),
  );

//Post route for adding new vehicles
router.post(
    "/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.registerInventory)
  );






module.exports = router;