import api from "@/lib/axios";

export interface MatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface SuggestedCourse {
  _id: string;
  name: string;
  teachesSkills: string[];
  link: string;
}

export interface SuggestionsResult {
  missingSkills: string[];
  recommendedCourses: SuggestedCourse[];
}

interface MatchApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const matchService = {
  async getMatch(studentId: string, internshipId: string): Promise<MatchResult> {
    const { data } = await api.get<MatchApiResponse<MatchResult>>(
      `/match/${studentId}/${internshipId}`,
    );

    return data.data;
  },

  async getSuggestions(
    studentId: string,
    internshipId: string,
  ): Promise<SuggestionsResult> {
    const { data } = await api.get<MatchApiResponse<SuggestionsResult>>(
      `/suggestions/${studentId}/${internshipId}`,
    );

    return data.data;
  },
};
