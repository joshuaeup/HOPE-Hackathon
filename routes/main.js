const express = require("express");
const router = express.Router();
const data = require("../data.json");

const transporter = require("../config/transporter");

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
    let formattedText = "Here are your helpful tips! ";
    // Loop through selected data then append object values within template literal
    for (let i = 0; i < data[item].length; i++) {
        let number = i + 1;
        formattedText += `
        ${number}. ${data[item][i].title}
        ${data[item][i].info}
        `;
    }
    const mail = {
        from: "Hope",
        to: email,
        subject: `Tips related to your ${item.toString()}`,
        text: formattedText,
    };

    // Send email with mail object passed in then check for success
    transporter.sendMail(mail, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });

    res.send(formattedText);
});

module.exports = router;
