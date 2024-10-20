const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const accountName = utilities.checkLoginName(res.locals)
  req.flash("notice", "This is a flash message")
  res.render("index", {title: "Home", nav, accountName})
}

module.exports = baseController