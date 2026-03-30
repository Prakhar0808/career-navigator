import type { Request, Response } from "express";
import { matchService } from "../services/match.service.js";
import { sendError, sendSuccess } from "../utils/response.utils.js";

export const getMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.params["studentId"] ?? "demo-student";
    const internshipId = req.params["internshipId"];

    if (!internshipId) {
      sendError(res, 400, "internshipId is required");
      return;
    }

    const studentSkills = matchService.resolveStudentSkills(studentId);
    const internshipProfile = matchService.resolveInternshipProfile(internshipId);

    const result = matchService.calculateMatch(
      studentSkills,
      internshipProfile.requiredSkills,
      internshipProfile.preferredSkills,
    );

    sendSuccess(res, 200, "Match calculated successfully", result);
  } catch (error) {
    console.error("Failed to calculate match:", error);
    sendError(res, 500, "Failed to calculate internship match");
  }
};

export const getSuggestions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const studentId = req.params["studentId"] ?? "demo-student";
    const internshipId = req.params["internshipId"];

    if (!internshipId) {
      sendError(res, 400, "internshipId is required");
      return;
    }

    const studentSkills = matchService.resolveStudentSkills(studentId);
    const internshipProfile = matchService.resolveInternshipProfile(internshipId);
    const missingSkills = matchService.findMissingSkills(
      studentSkills,
      internshipProfile.requiredSkills,
    );
    const recommendedCourses = await matchService.suggestCourses(missingSkills);

    sendSuccess(res, 200, "Course suggestions fetched successfully", {
      missingSkills,
      recommendedCourses,
    });
  } catch (error) {
    console.error("Failed to fetch course suggestions:", error);
    sendError(res, 500, "Failed to fetch course suggestions");
  }
};
