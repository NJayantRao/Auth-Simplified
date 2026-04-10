import Mailgen from "mailgen";

// Configure mailgen by setting a theme and your product info
export const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "Mailgen",
    link: "https://mailgen.js/",
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});
