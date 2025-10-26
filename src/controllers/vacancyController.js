import { vacancyModel } from "../models/vacancyModel.js"

export const getVacancy = async (req, res) => {
    try {
        const vacancies = await vacancyModel.getAllVacancies();
        res.json(vacancies);
    } catch (error) {
        console.error(`Erro ao buscar vagas`, error);
        res.status(500).json({ error: "Erro ao buscar vagas" });
    }
}

export const getVacancyById = async (req, res) => {
    const { id } = req.params
    try {
        const vacancy = await vacancyModel.getVacancy(id);
        res.json(vacancy);
    } catch (error) {
        console.error(`Erro ao buscar vaga`, error);
        res.status(500).json({ error: "Erro ao buscar vaga" });
    }
}