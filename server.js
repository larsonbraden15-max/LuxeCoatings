```js
const express = require("express");
const { Resend } = require("resend");

const app = express();

// Render provides the PORT automatically.
// 3000 is used when running locally.
const PORT = process.env.PORT || 3000;


// ========================================
// MIDDLEWARE
// ========================================

// Read form information
app.use(express.urlencoded({ extended: true }));

// Allow HTML, CSS, images, and other website files to load
app.use(express.static(__dirname));


// ========================================
// WEBSITE
// ========================================

// Open the website
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


// ========================================
// RESEND SETUP
// ========================================

// Your Resend API key should be stored in Render
// as an environment variable called RESEND_API_KEY.
const resend = new Resend(process.env.RESEND_API_KEY);


// ========================================
// HANDLE QUOTE FORM
// ========================================

app.post("/send-email", async (req, res) => {

    // Get information submitted by the customer
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


    // ========================================
    // CHECK REQUIRED INFORMATION
    // ========================================

    if (!fullName || !email) {

        return res.status(400).send(`
            <!DOCTYPE html>

            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>Missing Information | Luxe Coatings</title>
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
                ">
                    Missing Information
                </h1>

                <p>
                    Please provide your name and email address.
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


    // ========================================
    // SEND EMAIL
    // ========================================

    try {

        const result = await resend.emails.send({

            // This must be a verified domain in Resend
            from: "Luxe Coatings <quote@luxecoatingsllc.com>",

            // Your business email
            to: "luxecoatingsllc@gmail.com",

            // Clicking Reply will reply directly to the customer
            replyTo: email,

            // Customer's name appears in the subject
            subject: `New Luxe Coatings Quote Request - ${fullName}`,

            // Email contents
            text: `
NEW LUXE COATINGS QUOTE REQUEST
================================

Name:
${fullName}

Phone:
${phoneNum || "N/A"}

Email:
${email}

Preferred Contact Method:
${contact || "N/A"}

How They Heard About Us:
${howHeard || "N/A"}

Additional Information:
${extraHeard || "N/A"}

Project Description:
${about || "N/A"}

Contact Permission:
${contactConsent || "N/A"}

================================
LUXE COATINGS
luxecoatingsllc.com
            `
        });


        // Show the Resend response in the Render logs
        console.log("EMAIL SENT SUCCESSFULLY:");
        console.log(result);


        // ========================================
        // SUCCESS PAGE
        // ========================================

        res.send(`
            <!DOCTYPE html>

            <html lang="en">

            <head>
                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

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
                    font-size: 42px;
                ">
                    Thank You!
                </h1>

                <p style="
                    font-size: 20px;
                ">
                    Your quote request has been submitted successfully.
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

    }


    // ========================================
    // ERROR HANDLING
    // ========================================

    catch (error) {

        console.error("================================");
        console.error("EMAIL ERROR");
        console.error("================================");
        console.error(error);


        res.status(500).send(`
            <!DOCTYPE html>

            <html lang="en">

            <head>
                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

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
                    Something Went Wrong
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
        `Luxe Coatings server running on port ${PORT}`
    );

});
```
