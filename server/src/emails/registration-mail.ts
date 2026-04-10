import { mailGenerator } from "../lib/mailgen.js";

const email = {
  body: {
    name: "John Appleseed",
    intro: "Welcome to Mailgen! We're very excited to have you on board.",
    action: {
      instructions: "To get started with Mailgen, please click here:",
      button: {
        color: "#22BC66", // Optional action button color
        text: "Confirm your account",
        link: "https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010",
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
};

// Generate an HTML email with the provided contents
const emailBody = mailGenerator.generate(email);

// Generate the plaintext version of the e-mail (for clients that do not support HTML)
const emailText = mailGenerator.generatePlaintext(email);

export { emailBody, emailText };
