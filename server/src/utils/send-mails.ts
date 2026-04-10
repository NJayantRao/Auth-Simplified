import { transporter } from "../lib/nodemailer.js";

const sendRegistrationMail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Example Team" <team@example.com>', // sender address
      to: "njayantrao@gmail.com", // list of recipients
      subject: "Hello", // subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // HTML body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export { sendRegistrationMail };
