const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
    res.send("Hello World");
});

// Test one route
router.get("/one", (req, res) => {
    res.render("testOne");
});

// Test two route
router.get("/two", (req, res) => {
    res.render("testTwo");
});

module.exports = router;
