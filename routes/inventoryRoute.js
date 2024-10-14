// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')


//Route to managment page and the pages to add classification or vehicles
router.get("/", utilities.handleErrors(invController.buildVehManView))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddVehView))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView))

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

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));



module.exports = router;