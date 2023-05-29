const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  login,
} = require("../controllers/user.controller");
const validate = require("../validations/index.validator");
const userLoginValidationRules = require("../validations/loginUser.validator");
const { userRegisterValidationRules } = require("../validations/registerUser.validator");
const { userEditValidationRules } = require("../validations/editProfile.validator");

router
  .get("/", getUsers)
  .get("/:id", getUserById)
  .post("/login", userLoginValidationRules(), validate, login)
  .post("/register", userRegisterValidationRules(), validate, createUser)
  .put("/:id", userEditValidationRules(), validate, updateUser)
  .delete("/:id", deleteUser);

module.exports = router;