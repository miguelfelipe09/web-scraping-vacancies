import express from "express";
const server = express();

server.use(express.json());

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
