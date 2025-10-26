import { Router } from "express";
import { getVacancy, getVacancyById } from "../controllers/vacancyController.js";

const router = Router();

router.get('/', getVacancy);
router.get('/:id', getVacancyById);

export default router;