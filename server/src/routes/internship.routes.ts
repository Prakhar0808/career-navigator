import { Router } from "express";
import { getScrapedInternships } from "../controllers/internship.controller.js";

const router = Router();

router.get("/", getScrapedInternships);

export default router;
