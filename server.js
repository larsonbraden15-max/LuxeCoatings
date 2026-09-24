const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// Read form information
app.use(express.urlencoded({ extended: true }));

// Allow website files to load
app.use(express.static(__dirname));

// Open LuxeCoating.html when visiting localhost:3000
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


// ========================================
// GMAIL SETUP
// ========================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// ========================================
// HANDLE QUOTE FORM
// ========================================

app.post("/send-email", async (req, res) => {

    const {
        fullName,
        phoneNum,
        email,
        contact,
        howHeard,
        extraHeard,
        about,
        contactConsent
    } = req.body;


    try {

        await transporter.sendMail({

            from: "luxecoatingsllc@gmail.com",

            to: "luxecoatingsllc@gmail.com",

            subject: "New Luxe Coatings Quote Request",

            text: `
NEW LUXE COATINGS QUOTE REQUEST
================================

Name:
${fullName}

Phone:
${phoneNum}

Email:
${email}

Preferred Contact Method:
${contact}

How They Heard About Us:
${howHeard}

Additional Information:
${extraHeard || "N/A"}

Project Description:
${about}

Contact Permission:
${contactConsent}
            `
        });


        // Successful submission
        res.send(`
            <html>
            <head>
                <title>Thank You</title>
            </head>

            <body style="
                background-color: black;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding-top: 100px;
            ">

                <h1 style="color: #d4af37;">
                    Thank You!
                </h1>

                <p>
                    Your quote request has been submitted.
                </p>

                <br>

                <a href="/" style="
                    color: #d4af37;
                    text-decoration: none;
                    font-weight: bold;
                ">
                    Return to Luxe Coatings
                </a>

            </body>
            </html>
        `);

    } catch (error) {

        console.error("EMAIL ERROR:");
        console.error(error);

        res.status(500).send(`
            <html>
            <head>
                <title>Error</title>
            </head>

            <body style="
                background-color: black;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding-top: 100px;
            ">

                <h1 style="color: #d4af37;">
                    Something went wrong.
                </h1>

                <p>
                    Please try again later.
                </p>

                <br>

                <a href="/" style="
                    color: #d4af37;
                    text-decoration: none;
                    font-weight: bold;
                ">
                    Return to Luxe Coatings
                </a>

            </body>
            </html>
        `);
    }
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `Luxe Coating website running at http://localhost:${PORT}`
    );

});
