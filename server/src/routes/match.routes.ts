import { Router } from "express";
import { getMatch, getSuggestions } from "../controllers/match.controller.js";

const router = Router();

router.get("/match/:studentId/:internshipId", getMatch);
router.get("/suggestions/:studentId/:internshipId", getSuggestions);

export default router;
