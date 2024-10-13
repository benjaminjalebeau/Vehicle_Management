const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

// Will be used to check for special characters in val rules.
var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

/*  **********************************
*  New Classification Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
  
      // Must be someting entered into the field.
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .custom((classification_name) => {
        if(format.test(classification_name)){
          throw new Error("Please enter a classification name without special characters.")
        }
      })
    ]
  }
  
/*  **********************************
*  New inventory Validation Rules
* ********************************* */
validate.inventoryRules = () => {
    return [
  
      // Make sure a selection is made
      body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .custom((classification_id) => {
        if (!classification_id){
          throw new Error("Please select a classification.")
        }
      }),
  
      body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."), // on error this message is sent.
  
      
      body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."), // on error this message is sent.
  
  
      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4})
      .custom(async (inv_year) => {
        if(typeof inv_year != "number"){
          throw new error("Please enter a valid 4 digit year")
        }
      }),
  
  
      body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description of the vehicle."), // on error this message is sent.
  
  
      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1})
      .custom(async (inv_price) => {
        if(typeof inv_price != "number"){
          throw new error("Please enter a price as a number with no characters")
        }
      }),
  
  
      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .custom(async (inv_miles) => {
        if(typeof inv_miles != "number"){
          throw new error("Please enter mileage as a number with no characters")
        }
      }),
  
      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a color of the vehicle."), // on error this message is sent
  
      
      body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an img path for the vehicle."), // on error this message is sent
  
      body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an img path for the thumbnail."), // on error this message is sent
    ]
  }
  
 
 
 /* ******************************
 * Check data and return errors or register classification
 * ***************************** */
 validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  
   /* ******************************
   * Check data and return errors or register vehicle
   * ***************************** */
   validate.checkInventoryData = async (req, res, next) => {
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
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
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
      })
      return
    }
    next()
  }
  
    
module.exports = validate