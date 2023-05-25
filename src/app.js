const process = require("process");
const express = require("express");
const methodOverride = require("method-override");
require('dotenv').config();

const [ 
    productRouter, 
    orderRouter, 
    categoryRouter, 
    userRouter
] = require("./routes");

const app = express();

/* SETTING */
const PORT = process.env.PORT || 3000;

/* MIDDLEWARES */
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

/* ROUTES */

app.use(`/api/products`, productRouter);
app.use(`/api/orders`, orderRouter);
app.use(`/api/categories`, categoryRouter);
app.use(`/api/users`, userRouter);


/* ERROR HANDLING */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

/* START SERVER */
app.listen(PORT, () => console.log(`Server listen in port ${PORT}`));