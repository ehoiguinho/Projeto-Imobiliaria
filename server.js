import express from "express";
import cors from 'cors';
import usuarioRouter from './routes/usuarioRoute.js'
import imovelRouter from './routes/imovelRoute.js'
import locacaoRouter from './routes/locacaoRoute.js'
import loginRouter from './routes/loginRoute.js'
import aluguelRouter from './routes/aluguelRoute.js'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const outputJson = require("./swaggerOutput.json");
const server = express();

server.use('/uploads', express.static('uploads'));
server.use(express.json());
server.use(cookieParser());
server.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001'], // endereço do frontend da nossa documentação (temporariamente ele está sendo o nosso cliente)
  credentials: true                // cookies com http only serão enviadados automaticamente apenas se essa flag estiver true
}));
server.use("/docs", swaggerUi.serve, swaggerUi.setup(outputJson, {
    swaggerOptions: {
        withCredentials: true //para permitir o envio de cookies da nossa rota /docs
    }
}))

server.use("/usuario", usuarioRouter);
server.use("/imovel", imovelRouter);
server.use("/locacao", locacaoRouter);
server.use("/login", loginRouter);
server.use("/aluguel", aluguelRouter);

server.listen(3000, function(){
    console.log("backend rodando!");
})