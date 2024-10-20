const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  // Will be used to check for special characters in val rules.
  


  /*  **********************************
  *  New Classification Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
      return [
        // Must be someting entered into the field.
          body("classification_name")
          .trim()
          .notEmpty()
          .isLength({ min: 1 })
          .isAlphanumeric()
          .withMessage("Please provide a classification without symbols."),
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
        .custom(async (classification_id) => {
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
        .isNumeric()
        .withMessage("Please enter a 4 digit year for the vehicle"),
    
    
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
        .isNumeric()
        .isLength({ min: 1})
        .withMessage("Please enter a price for the vehicle"),
    
    
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please enter the mileage for the vehicle"),
    
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
        let select = await utilities.buildClassificationList()
        res.render("./inventory/add-inventory", {
          errors,
          title: "Add New Vehicle",
          nav,
          select,
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


  /* ******************************
    * Check data and return errors to edit view
    * ***************************** */
  validate.checkUpdateData = async (req, res, next) => {
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
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let select = await utilities.buildClassificationList()
      res.render("./inventory/edit-inventory", {
        errors,
        title: "Edit " + inv_make + " " + inv_model,
        nav,
        select,
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
      })
      return
    }
    next()
  }
    
      
  module.exports = validate