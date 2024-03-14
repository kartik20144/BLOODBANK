const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const dbConfig = require("./config/dbConfig");

const usersRoutes = require("./routes/usersRoutes");
const inventoryRoute = require("./routes/inventoryRoute");
const dashboardRoute = require("./routes/dashboardRoute");

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/inventory", inventoryRoute);
app.use("/api/dashboard", dashboardRoute);

app.listen(port, () => console.log(`Node JS Serer started at ${port}`));
