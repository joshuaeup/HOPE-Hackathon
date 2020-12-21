const express = require("express");
const router = express.Router();
const data = require("../data.json");
// Transporter configurations
const transporter = require("../config/transporter");
const request = require("request");

// API Keys
const apiKey = "decf8780916542018d312ec3ef91935b";
const gifApiKey = "LXPwL17v1pWKIxBUdVOv468Ss3LVvpBK";

// Gif API guidelines
const gifLimit = 2;
const gifIndex = gifLimit - 1;

// Home route
router.get("/", (req, res) => {
    res.render("landing");
});

//portal
router.get("/portal", (req, res) => {
    res.render("home");
});

// Window has a higher specificity to run this code on the window route instead of the :object route
router.get("/portal/window", (req, res) => {
    try {
        // API info
        const city = "Charlotte";
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

        // check if req exists
        if (!data["window"]) {
            // Set status code to not found and display message
            return res.status(404).send("Object cannot be found");
        }

        // Item variable
        const item = "window";

        // Checks the length of the window object in the JSON file
        const amount = data["window"].length;
        let format = "";

        // Passes in correct css style based on the length of the object
        if (amount > 1) {
            format = "text-container__grid__dual";
        } else {
            format = "text-container__grid__single";
        }

        // Request API data then render API and Data object
        request(url, (err, response, body) => {
            // Checks for error
            if (err) {
                res.render("windowInfo", {
                    weather: null,
                    error: "Cannot be found",
                    title: "Window",
                });
            } else {
                // Checks if weather is undefined for location
                let weather = JSON.parse(body);
                if (weather.main == undefined)
                    res.render("windowInfo", {
                        weather: null,
                        error: "No weather data",
                    });

                // Sets weather text template to empty
                let weatherText = "";

                // Request GIF from API and passes in global variables
                request(
                    `http://api.giphy.com/v1/gifs/search?q=window&limit=${gifLimit}&api_key=${gifApiKey}`,
                    (err, response, body) => {
                        // Checks for error
                        if (err) {
                            res.render("info", {
                                gif: null,
                                error: "Gif Not Found",
                            });
                        } else {
                            // conditional for weatherText
                            if (weather.main.temp > 60) {
                                weatherText = `It's currently ${weather.main.temp} degrees in Charlotte. Perfect time to open the window`;
                            } else {
                                weatherText = `It's currently ${weather.main.temp} degrees in Charlotte. Maybe not the best time to open the window...`;
                            }
                            // Pulls GIF from API
                            const gif = JSON.parse(body).data[gifIndex].images
                                .original.url;
                            // Render to view
                            res.render("windowInfo", {
                                weather: weatherText,
                                data: data.window,
                                gif: gif,
                                title:
                                    item.charAt(0).toUpperCase() +
                                    item.slice(1, item.length),
                                format: format,
                                error: null,
                            });
                        }
                    }
                );
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Retrieves data from param if exist
router.get("/portal/:object", (req, res) => {
    try {
        const item = req.params.object;

        // check if req exists
        if (!data[item]) {
            // Set status code to not found and display message
            return res.status(404).send("Object cannot be found");
        }

        // Checks the length of the window object in the JSON file
        const amount = data[item].length;
        // Item variable
        let format = "";

        // Passes in correct css style based on the length of the object
        if (amount > 1) {
            format = "text-container__grid__dual";
        } else {
            format = "text-container__grid__single";
        }

        // Request GIF from API and passes in global variables
        request(
            `http://api.giphy.com/v1/gifs/search?q=${item}&limit=${gifLimit}&api_key=${gifApiKey}`,
            (err, response, body) => {
                // Checks for error
                if (err) {
                    res.render("info", { gif: null, error: "Gif Not Found" });
                } else {
                    // Pulls GIF from API
                    const gif = JSON.parse(body).data[gifIndex].images.original
                        .url;
                    // Send result to page
                    res.render("info", {
                        data: data[item],
                        gif: gif,
                        title:
                            item.charAt(0).toUpperCase() +
                            item.slice(1, item.length),
                        format: format,
                        error: null,
                    });
                }
            }
        );
    } catch (err) {
        console.log(err);
    }
});

// Post method for email
router.post("/portal/:object", (req, res) => {
    try {
        // Grabs object from url param
        const item = req.params.object;
        // Grab email from form
        const email = req.body.email;
        // Formatted text variable that will have values appended
        let formattedText = "Here are your helpful tips! ";
        // Loop through selected data then append object values within template literal
        for (let i = 0; i < data[item].length; i++) {
            let number = i + 1;
            formattedText += `
            ${number}. ${data[item][i].title}
            ${data[item][i].info}
            `;
        }
        // Mail Object
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
        res.render("home");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
