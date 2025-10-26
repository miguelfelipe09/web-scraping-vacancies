import { pool } from "../config/db.js";

export const vacancyModel = {
    async createTable() {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS vacancies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                link VARCHAR(500),
                enterprise VARCHAR(50)
            )    
        `);        
    },

    async addVacancy({ name, link, enterprise, tags }) {
    if (!name || !link || !enterprise) {
        console.warn("⚠️ Vaga ignorada — dados incompletos:", { name, link, enterprise });
        return;
    }

    const [rows] = await pool.execute(
        `SELECT id FROM vacancies WHERE name = ?`,
        [name]
    );

    if (rows.length === 0) {
        await pool.execute(
        `INSERT INTO vacancies (name, link, enterprise, tags) VALUES (?, ?, ?, ?)`,
        [name, link, enterprise, JSON.stringify(tags)]
        );
    }
    },

    async getAllVacancies() {
        const [rows] = await pool.execute(`
           SELECT * FROM vacancies
        `);

        return rows;
    },

    async getVacancy(id) {
        const [rows] = await pool.execute(`
            SELECT * FROM vacancies WHERE id = ?    
        `, [id]);

        return rows;
    },
}