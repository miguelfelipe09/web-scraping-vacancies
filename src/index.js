import express from "express";
import vacancyRoutes from './routes/vacancyRoutes.js'
import viewRoutes from './routes/viewRoutes.js'
import path from "path";
import { fileURLToPath } from "url";
import nodeCron from "node-cron";
import { scrape } from "./scrape.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

server.use(express.static(path.join(__dirname, "../public")));

server.use(express.json());

nodeCron.schedule('0 0 * * *', () => {
    scrape();
})

server.use('/vacancies', vacancyRoutes);
server.use("/", viewRoutes);

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
