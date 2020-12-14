const express = require("express");
// Initialize express
const app = express();
const mainRoutes = require("./routes/main");

// Middleware declaration
const bodyParser = require("body-parser");

// Middleware initialization
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Routes
app.use("/", mainRoutes);

// PORT to listen on
const PORT = 3000 || process.argv.PORT;
// Listen for PORT
app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});
