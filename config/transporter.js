// NPM imports
const nodemailer = require("nodemailer");
const credentials = require("./pass");

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

module.exports = transporter;
