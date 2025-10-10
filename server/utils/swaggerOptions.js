export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "PAMOJA API",
      description: "PAMOJA API Information",
      contact: {
        name: "Pamoja",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./controllers/*.js"],
};
