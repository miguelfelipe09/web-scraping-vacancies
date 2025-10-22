import { pool } from "../config/db.js";

export const ProductModel = {
    async createTable() {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price VARCHAR(50),
                link VARCHAR(500),
                enterprise VARCHAR(50)
            )    
        `);
    },

    async saveProduct({ name, price, link, enterprise }) {
        const [rows] = await pool.execute(
            "SELECT id FROM products WHERE name = ?",
            [name]
        )

        if(rows.length === 0) {
            await pool.execute(
                "INSERT INTO products (name, price, link, enterprise) VALUES (?, ?, ?, ?)",
                [name, price, link, enterprise]
            )
        }
    },

    async getAllProducts() {
        const [rows] = await pool.execute("SELECT * from products");
        return rows;
    },

    async getProduct(id) {
        const [rows] = pool.execute(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );
        return rows;
    },
}