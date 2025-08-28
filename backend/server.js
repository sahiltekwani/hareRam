const express = require("express");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server, curl, Postman

      const allowed = [
        "http://localhost:3000",
        "https://hareram-p0msckhjv-sahils-projects-59dff70b.vercel.app",
        "https://your-production-domain.com",
      ];

      // also allow any subdomain on vercel.app
      if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// contact route with email sending
app.post("/api/contact", async (req, res) => {
  const {
    formName,
    formEmail,
    formPhone,
    formCompany,
    formProjectType,
    formBudget,
    formMessage,
  } = req.body;

  console.log(
    "Form submission:",
    formName,
    formEmail,
    formPhone,
    formCompany,
    formProjectType,
    formBudget,
    formMessage
  );

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "outlook", "yahoo"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: formEmail,
      to: process.env.EMAIL_RECEIVER, // where you want to receive
      subject: `New Contact Form Submission from ${formName}`,
      text: `
        Name: ${formName}
        Email: ${formEmail}
        Phone: ${formPhone}
        Company: ${formCompany}
        Project Type: ${formProjectType}
        Budget: ${formBudget}
        Message: ${formMessage}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Form submitted & email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
