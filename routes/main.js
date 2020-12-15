const express = require("express");
const router = express.Router();
const data = require("../data.json");

// Home route
router.get("/", (req, res) => {
    res.render("home");
});

router.get("/:object", (req, res) => {
    const item = req.params.object;
    // check if req exists
    if (!data[item]) {
        // Set status code to not found and display message
        return res.status(404).send("Object cannot be found");
    }
    // Send result to page
    res.render("info", { data: data[item] });
});

module.exports = router;
