
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventoriesbyid error " + error)
  }
}

/* *****************************
*   Register new Classification
* *************************** */
async function addClass(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Register new vehicle
* *************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = `INSERT INTO inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [
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
    ])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update vehicle information
* *************************** */
async function updateInventory(
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
  classification_id){
  try {
    const sql = `UPDATE public.inventory SET 
    inv_make = $1, 
    inv_model = $2, 
    inv_description = $3, 
    inv_image = $4, 
    inv_thumbnail = $5, 
    inv_price = $6, 
    inv_year = $7, 
    inv_miles = $8, 
    inv_color = $9, 
    classification_id = $10 
    WHERE inv_id = $11 RETURNING *`
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}


/* *****************************
*   Delete vehicle information
* *************************** */
async function deleteInventory(inv_id){
  try {
    const sql = `DELETE FROM inventory WHERE inv_id = $1`
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    return error.message
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addClass, addInventory, updateInventory, deleteInventory};