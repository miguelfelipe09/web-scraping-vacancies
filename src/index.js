import express from "express";
import vacancyRoutes from './routes/vacancyRoutes.js'
const server = express();

server.use(express.json());

server.use('/vacancy', vacancyRoutes);

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
