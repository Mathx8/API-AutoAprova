import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API AutoAprova",
            version: "1.0.0",
            description: "API para gerenciamento de usuários (alunos e professores), carros, aulas, chat e avaliações"
        },
        servers: [
            {
                url: "http://localhost:8000"
            }
        ],
        tags: [
            { name: "Auth", description: "Autenticação e registro de usuários" },
            { name: "Usuários", description: "Operações com usuários" },
            { name: "Alunos", description: "Operações com alunos" },
            { name: "Professores", description: "Operações com professores" },
            { name: "Aulas", description: "Operações com aulas" },
            { name: "Carros", description: "Operações com carros" },
            { name: "Chat", description: "Mensagens entre aluno e professor" }
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
                },
                Avaliacao: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        aula_id: { type: "string" },
                        autor_id: { type: "string" },
                        nota: { type: "integer", minimum: 1, maximum: 5 },
                        comentario: { type: "string", nullable: true },
                        criado_em: { type: "string", format: "date-time" }
                    }
                },
                Mensagem: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        autor_id: { type: "string" },
                        mensagem: { type: "string" },
                        criado_em: { type: "string", format: "date-time" },
                        autor: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                nome: { type: "string" },
                                foto_perfil: { type: "string", nullable: true }
                            }
                        }
                    }
                }
            }
        },
    },
    apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);