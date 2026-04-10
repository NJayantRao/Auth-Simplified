import { registrationMail } from "../emails/registration-mail.js";
import { verificationMail } from "../emails/verify-email.js";
import { transporter } from "../lib/nodemailer.js";

const sendRegistrationMail = async (
  username: string,
  email: string,
  verifyLink: string
) => {
  try {
    const { html, plainText } = await registrationMail(username, verifyLink);
    const info = await transporter.sendMail({
      from: '"Auth System Team" <auth-system@gmail.com>',
      to: email,
      subject: "Welcome to Auth System",
      text: plainText,
      html: html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

const sendVerificationMail = async (
  username: string,
  email: string,
  verifyLink: string
) => {
  try {
    const { html, plainText } = await verificationMail(username, verifyLink);
    const info = await transporter.sendMail({
      from: '"Auth System Team" <auth-system@gmail.com>',
      to: email,
      subject: "Welcome to Auth System",
      text: plainText,
      html: html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export { sendRegistrationMail, sendVerificationMail };
