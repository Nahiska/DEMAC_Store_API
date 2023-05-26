const { check, body } = require("express-validator");
const bcrypt = require("bcrypt");
const { User } = require("../database/models");
const { getUserByEmail } = require("../services/user.service");

const userLoginValidationRules = () => {
  return [
    check("email")
    .notEmpty()
    .withMessage("El email es obligatorio").bail()
    .isEmail()
    .withMessage("Email inválido"),

    check('password')
    .notEmpty()
    .withMessage('Debes escribir tu contraseña'),

    body("password")
    .custom((value, { req }) => {
        return User.findOne({
            where: {
                email: req.body.email,
            }
        })
        .then((user) => {
            if(!bcrypt.compareSync(value, user.dataValues.password)) {
                return Promise.reject();
            }
        })
        .catch(() => Promise.reject("Email o contraseña incorrecto"))
    }),
  ];
};

module.exports = userLoginValidationRules;
