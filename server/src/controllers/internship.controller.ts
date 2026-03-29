import type { Request, Response } from "express";
import { internshipScraperService } from "../services/internship-scraper.service.js";
import { sendError, sendSuccess } from "../utils/response.utils.js";

export const getScrapedInternships = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const keyword =
      typeof req.query["keyword"] === "string" ? req.query["keyword"] : undefined;
    const location =
      typeof req.query["location"] === "string" ? req.query["location"] : undefined;
    const limitRaw =
      typeof req.query["limit"] === "string" ? Number(req.query["limit"]) : undefined;

    const searchParams: {
      keyword?: string;
      location?: string;
      limit?: number;
    } = {};

    if (keyword) {
      searchParams.keyword = keyword;
    }

    if (location) {
      searchParams.location = location;
    }

    if (typeof limitRaw === "number" && Number.isFinite(limitRaw)) {
      searchParams.limit = limitRaw;
    }

    const { internships, sourceWarnings } =
      await internshipScraperService.search(searchParams);

    sendSuccess(res, 200, "Internships fetched successfully", {
      internships,
      sourceWarnings,
    });
  } catch (error) {
    console.error("Failed to fetch internships:", error);
    sendError(res, 500, "Failed to fetch internships from web sources");
  }
};
