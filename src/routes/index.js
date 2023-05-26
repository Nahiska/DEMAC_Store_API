const productRouter = require("./product");
const orderRouter = require("./order");
const categoryRouter = require("./category");
const userRouter = require("./user");


module.exports = [userRouter, productRouter, orderRouter, categoryRouter];