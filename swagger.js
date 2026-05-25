import swaggerAutogen from "swagger-autogen";

const doc = {
    host: "localhost:3000",
    info: {
        title: "API REST",
        description: "API para o gerenciamento de locação de imóveis."
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
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            in: 'cookie', // can be 'header', 'query' or 'cookie'
            name: 'token', // name of the header, query parameter or cookie
            description: 'JWT gerado a partir da autenticação'
        }
  }
};

const routes = ["./server.js"];
const outputJson = "./swaggerOutput.json";

swaggerAutogen({ openapi: "3.0.0" })(outputJson, routes, doc)
.then(async () => {
    await import("./server.js");
});
