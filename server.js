import express from "express";
import cors from "cors";
import "dotenv/config";

import usuarioRouter from "./routes/usuarioRoute.js";
import imovelRouter from "./routes/imovelRoute.js";
import locacaoRouter from "./routes/locacaoRoute.js";
import loginRouter from "./routes/loginRoute.js";
import adminRouter from "./routes/adminRoute.js";
import aluguelRouter from "./routes/aluguelRoute.js";
import pagamentoRouter from "./routes/pagamentoRoute.js";
import webhookRouter from "./routes/webhookRoute.js";

import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const outputJson = require("./swaggerOutput.json");

const server = express();

server.use("/uploads", express.static("uploads"));

// O webhook precisa preservar o corpo original da requisição
// para validação da assinatura da AbacatePay.
// Por isso, esta rota deve ser registrada antes do express.json().
server.use(
    "/webhook",
    express.raw({
        type: "application/json"
    }),
    webhookRouter
);

server.use(express.json());
server.use(cookieParser());

server.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5001",
        credentials: true
    })
);

server.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(outputJson, {
        swaggerOptions: {
            withCredentials: true
        }
    })
);

server.use("/usuario", usuarioRouter);
server.use("/imovel", imovelRouter);
server.use("/locacao", locacaoRouter);
server.use("/login", loginRouter);
server.use("/admin", adminRouter);
server.use("/aluguel", aluguelRouter);
server.use("/pagamento", pagamentoRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
    console.log(`backend rodando na porta ${PORT}!`);
});
