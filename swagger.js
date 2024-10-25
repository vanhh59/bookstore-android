import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger Options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            description: "API endpoints for a mini blog services documented on swagger",
            contact: {
                name: "Bookstore API",
                email: "vanhhh59@gmail.com",
                url: "https://github.com/vanhh59/bookstore-api-nodejs"
            },
            version: '1.0.0',
        },
        servers: [
            // {
            //     url: "https://bookstore-api-nodejs.onrender.com",
            //     description: "Live server"
            // },
            {
                url: "http://localhost:10000/",
                description: "Local server"
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    // looks for configuration in specified directories
    // Đây là nơi chứa các file route cần được tạo swagger docs
    apis: ['./backend/routes/*.js', './backend/controllers/*.js'], // Thêm cả controller
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

export default swaggerDocs;
