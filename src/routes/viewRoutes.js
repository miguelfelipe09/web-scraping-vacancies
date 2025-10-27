import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.get("/", async (req, res) => {
  const search = req.query.q?.toLowerCase() || "";

  try {
    const response = await fetch("http://localhost:3000/vacancies");
    let vacancies = await response.json();

    // 🔍 Filtra vagas pelo nome ou empresa
    if (search) {
      vacancies = vacancies.filter(vacancy =>
        vacancy.name?.toLowerCase().includes(search) ||
        vacancy.enterprise?.toLowerCase().includes(search)
      );
    }

    res.render("pages/vacancies", { vacancies, search });
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    res.render("pages/vacancies", { vacancies: [], search });
  }
});

export default router;
