```js
const express = require("express");
const { Resend } = require("resend");

const app = express();
const PORT = 3000;

// ========================================
// MIDDLEWARE
// ========================================

// Read form information
app.use(express.urlencoded({ extended: true }));

// Allow website files to load
app.use(express.static(__dirname));

// ========================================
// WEBSITE
// ========================================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// ========================================
// RESEND SETUP
// ========================================

const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Send quote request through Resend
        await resend.emails.send({

            from: "Luxe Coatings <quote@luxecoatingsllc.com>",

            to: "luxecoatingsllc@gmail.com",

            replyTo: email,

            // The customer's name will appear here
            subject: `New Luxe Coatings Quote Request - ${fullName}`,

            // Email body
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

        // ========================================
        // SUCCESS PAGE
        // ========================================

        res.send(`
            <!DOCTYPE html>

            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>Thank You | Luxe Coatings</title>
            </head>

            <body style="
                background-color: black;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding-top: 100px;
                padding-left: 20px;
                padding-right: 20px;
            ">

                <h1 style="
                    color: #d4af37;
                    font-size: 40px;
                ">
                    Thank You!
                </h1>

                <p style="
                    font-size: 20px;
                ">
                    Your quote request has been submitted.
                </p>

                <p>
                    We will be in touch with you soon.
                </p>

                <br>

                <a href="/" style="
                    color: #d4af37;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 18px;
                ">
                    Return to Luxe Coatings
                </a>

            </body>

            </html>
        `);

    } catch (error) {

        // ========================================
        // EMAIL ERROR
        // ========================================

        console.error("EMAIL ERROR:");
        console.error(error);

        res.status(500).send(`
            <!DOCTYPE html>

            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>Error | Luxe Coatings</title>
            </head>

            <body style="
                background-color: black;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding-top: 100px;
                padding-left: 20px;
                padding-right: 20px;
            ">

                <h1 style="
                    color: #d4af37;
                    font-size: 40px;
                ">
                    Something went wrong.
                </h1>

                <p style="
                    font-size: 20px;
                ">
                    We were unable to submit your quote request.
                </p>

                <p>
                    Please try again later or contact us directly.
                </p>

                <br>

                <a href="/" style="
                    color: #d4af37;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 18px;
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
        `Luxe Coatings website running at http://localhost:${PORT}`
    );

});
```
