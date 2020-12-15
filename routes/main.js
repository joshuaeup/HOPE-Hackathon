const express = require("express");
const router = express.Router();
const data = require("../data.json");
const nodemailer = require("nodemailer");
const credentials = require("../config/pass");

// Create mail profile using smtp gmail server
const profile = {
    host: "smtp.gmail.com",
    auth: {
        // Enter login credentials into authentication object
        user: credentials.USER,
        pass: credentials.PASS,
    },
};
// Create email transporter using nodemailer
const transporter = nodemailer.createTransport(profile);

// Verify is active without error
transporter.verify((err, res) => {
    if (err) console.log(err);
    else console.log("Mail Server running");
});

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

router.post("/:object", (req, res) => {
    const item = req.params.object;
    const email = req.body.email;

    const mail = {
        from: "Hope",
        to: email,
        subject: `Tips related to your ${item.toString()}`,
        text: data[item][0].title,
    };

    // Send email with mail object passed in then check for success
    transporter.sendMail(mail, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });

    res.render("home");
});

module.exports = router;
