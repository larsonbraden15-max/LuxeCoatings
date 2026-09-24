const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "luxecoatingslls@gmail.com",
        pass: "zejmkixlfsqbfxhk"
    }
});

app.post("/send-email", async (req, res) => {
    const { fullName, phoneNum, email, contact } = req.body;

    try {
        await transporter.sendMail({
            from: "luxecoatingslls@gmail.com",
            to: "luxecoatingslls@gmail.com",
            subject: "New Luxe Coatings Customer",
            text: `
New customer submission:

Name: ${fullName}
Phone: ${phoneNum}
Email: ${email}
Preferred contact: ${contact}
`
        });

        res.send("Thank you! Your request has been submitted.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong.");
    }
});

app.listen(3000, () => {
    console.log("Luxe Coatings website running at http://localhost:3000");
});