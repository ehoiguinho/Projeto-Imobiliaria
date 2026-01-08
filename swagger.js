import swaggerAutogen from "swagger-autogen";

const doc = {
    host: "localhost:3000",
    info: {
        title: "API REST",
        description: "API REST para a construção do backend"
    },
    components: {
        schemas: {
            erro: {
                msg: "Mensagem de erro"
            },
             usuario: {
                nome: "exemplo",
                email: "exemplo@email.br",
                senha: "123abc",
                ativo: true,
                perfil: {
                    id: 1
                }
            },
        }
    },
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer"
        }
    }
};

const routes = ["./server.js"];
const outputJson = "./swaggerOutput.json";

swaggerAutogen({ openapi: "3.0.0" })(outputJson, routes, doc)
.then(async () => {
    await import("./server.js");
});
