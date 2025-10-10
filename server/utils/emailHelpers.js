import nodemailer from "nodemailer";

export const sendSuggestionEmail = async (type, suggestion) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_MAIL,
      to: [process.env.GOOGLE_MAIL, "info@keyypress.com"],
      subject: "A user suggestion from your site",
      text: `Someone at Pamoja, suggested a ${type}\n\nMessage: ${suggestion}\n\n\nPamoja Team`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending suggestion email:", error);
  }
};
