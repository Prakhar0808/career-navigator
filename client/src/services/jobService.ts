import api from "@/lib/axios";

export interface InternshipJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skills: string[];
  postedDate: string;
  applicants: number;
  matchScore?: number;
  applyUrl?: string;
  source?: string;
}

interface JobsResponse {
  success: boolean;
  message: string;
  data: {
    internships: InternshipJob[];
    sourceWarnings?: string[];
  };
}

export const jobService = {
  getJobs: async (filters?: {
    keyword?: string;
    location?: string;
    limit?: number;
  }): Promise<{ data: InternshipJob[]; sourceWarnings: string[] }> => {
    const { data } = await api.get<JobsResponse>("/internships", {
      params: {
        keyword: filters?.keyword,
        location: filters?.location,
        limit: filters?.limit,
      },
    });

    return {
      data: data.data.internships,
      sourceWarnings: data.data.sourceWarnings ?? [],
    };
  },

  getRecommended: async () => {
    const result = await jobService.getJobs({ limit: 20 });
    return {
      data: result.data
        .filter((job) => (job.matchScore ?? 0) >= 80)
        .slice(0, 6),
      sourceWarnings: result.sourceWarnings,
    };
  },

  getJobById: async (id: string) => {
    const result = await jobService.getJobs({ limit: 100 });
    return { data: result.data.find((job) => job.id === id) ?? null };
  },

  postJob: async (_data: unknown) => {
    return { data: { id: "new-job" } };
  },
};
