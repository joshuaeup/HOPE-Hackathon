const express = require("express");
const router = express.Router();
const data = require("../data.json");
// Transporter configurations
const transporter = require("../config/transporter");

const request = require("request");
const { json } = require("body-parser");
const apiKey = "decf8780916542018d312ec3ef91935b";
const gifApiKey = "dc6zaTOxFJmzC";

// Home route
router.get("/", (req, res) => {
    res.render("home");
});

router.get("/api", (req, res) => {
    res.send(data);
});

// Window has a higher specificity to run this code on the window route instead of the :object route
router.get("/window", (req, res) => {
    const object = "window";
    const collectedGif = "";
    request(
        `http://api.giphy.com/v1/gifs/search?q=${object}&limit=1&api_key=${gifApiKey}`,
        (err, response, body) => {
            if (err) {
                res.render("info", { gif: null, error: "Gif Not Found" });
            } else {
                // let gif = response.data[0].images.fixed_height.url;
                // console.log(response);
                const gif = JSON.parse(body).data[0].images.original.url;
                collectedGif = gif;
            }
        }
    );

    // API info
    const city = "Charlotte";
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    // Request API data then render API and Data object
    request(url, (err, response, body) => {
        if (err) {
            res.render("windowInfo", {
                weather: null,
                error: "Cannot be found",
            });
        } else {
            let weather = JSON.parse(body);
            if (weather.main == undefined)
                res.render("windowInfo", {
                    weather: null,
                    error: "No weather data",
                });

            let weatherText = weather.main.temp;
            console.log(weatherText);
            res.render("windowInfo", {
                weather: weatherText,
                gif: collectedGif,
                data: data.window,
                error: null,
            });
        }
    });
});

// Retrieves data from param if exist
router.get("/:object", (req, res) => {
    const item = req.params.object;

    // check if req exists
    if (!data[item]) {
        // Set status code to not found and display message
        return res.status(404).send("Object cannot be found");
    }

    request(
        `http://api.giphy.com/v1/gifs/search?q=${item}&limit=1&api_key=${gifApiKey}`,
        (err, response, body) => {
            if (err) {
                res.render("info", { gif: null, error: "Gif Not Found" });
            } else {
                // let gif = response.data[0].images.fixed_height.url;
                // console.log(response);
                const gif = JSON.parse(body).data[0].images.original.url;
                // Send result to page
                res.render("info", { data: data[item], gif: gif });
            }
        }
    );
});

// Post method for email
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

    // Render message
    res.send(formattedText);
});

module.exports = router;
