const { body } = require("express-validator");

const productValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").notEmpty().withMessage("Price is required").isInt().withMessage("Invalid price"),
    body("discount").optional().isInt().withMessage("Invalid discount"),
    body("description").notEmpty().withMessage("Description is required").isLength({ max: 450 }).withMessage("Description exceeds maximum length"),
    body("subCategory").notEmpty().withMessage("Subcategory ID is required").isInt().withMessage("Invalid subcategory ID"),
    body("category").notEmpty().withMessage("Category ID is required").isInt().withMessage("Invalid subcategory ID"),
  ];
};

module.exports = {
  productValidationRules,
};