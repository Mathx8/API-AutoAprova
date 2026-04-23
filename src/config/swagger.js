import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API AutoAprova",
            version: "1.0.0",
            description: "API para gerenciamento de usuários(alunos e professores), carros e aulas"
        },
        servers: [
            {
                url: "http://localhost:8000"
            }
        ],
        tags: [
            { name: "Auth" },
            { name: "Usuários" },
            { name: "Alunos" },
            { name: "Professores" },
            { name: "Aulas" },
            { name: "Carros" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                Usuario: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        nome: { type: "string" },
                        email: { type: "string" },
                        telefone: { type: "string" },
                        tipo: { type: "string" }
                    }
                },
                Aula: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        aluno_id: { type: "string" },
                        professor_id: { type: "string" },
                        data: { type: "string", format: "date-time" },
                        status: { type: "string" }
                    }
                },
                Carro: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        marca: { type: "string" },
                        modelo: { type: "string" },
                        ano: { type: "integer" },
                        cambio: { type: "string" },
                        cor: { type: "string" },
                        placa: { type: "string" }
                    }
                }
            }
        },
    },
    apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);