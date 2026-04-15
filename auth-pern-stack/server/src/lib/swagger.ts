import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Auth System",
    description:
      "A simple authentication system built with Node.js, Express, and Prisma.",
  },
  host: "localhost:5000",
};

const outputFile = "../../swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, endpointsFiles, doc);
