const express = require("express");
const router = require("./routes/router");
// Документация API
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "App Instagram API with Swagger",
            version: "1.0.0",
            description: "Это приложение основано на NodeJS Express и документировано при помощи Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Instagram",
                url: "https://instagram.lern.dev",
                email: "dev@email.com",
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },

        servers: [
            {
            url: "https://instagram.lern.dev/api/v1/",
            },
        ],
    },
    apis: ["./routes/*.js", "./controllers/*.js", "./middlewares/*.js", "./models/*.js"],
};
const specification = swaggerJsdoc(options);

app.use(express.json());
app.use('/v1/', router)

app.use( '/v1/documentation', swaggerUi.serve, swaggerUi.setup(specification) );

module.exports = app;