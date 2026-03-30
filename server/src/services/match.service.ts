const normalizeSkill = (skill: string): string => skill.trim().toLowerCase();

const dedupeSkills = (skills: string[]): string[] => {
  const seen = new Set<string>();

  return skills.filter((skill) => {
    const normalized = normalizeSkill(skill);
    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
};

const findMatches = (studentSkills: string[], targetSkills: string[]): string[] => {
  const studentSkillSet = new Set(studentSkills.map(normalizeSkill));

  return dedupeSkills(targetSkills).filter((skill) =>
    studentSkillSet.has(normalizeSkill(skill)),
  );
};

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

interface DummyInternshipProfile {
  requiredSkills: string[];
  preferredSkills: string[];
}

const dummyStudentProfiles: Record<string, string[]> = {
  "demo-student": ["React", "TypeScript", "Git", "HTML", "CSS"],
  "student-demo": ["React", "TypeScript", "Git", "HTML", "CSS"],
};

const dummyInternshipProfiles: Record<string, DummyInternshipProfile> = {
  "1": {
    requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
    preferredSkills: ["Git", "Responsive Design"],
  },
  "2": {
    requiredSkills: ["Python", "SQL", "Machine Learning"],
    preferredSkills: ["Pandas", "Statistics"],
  },
  "3": {
    requiredSkills: ["Figma", "Prototyping", "UX Research"],
    preferredSkills: ["Wireframing", "Communication"],
  },
  "4": {
    requiredSkills: ["Node.js", "Express", "MongoDB"],
    preferredSkills: ["REST APIs", "Problem Solving"],
  },
  "5": {
    requiredSkills: ["React Native", "JavaScript", "Firebase"],
    preferredSkills: ["Mobile UI", "Debugging"],
  },
  "6": {
    requiredSkills: ["Docker", "AWS", "CI/CD"],
    preferredSkills: ["Linux", "Shell Scripting"],
  },
};

const dummyCourses: SuggestedCourse[] = [
  {
    _id: "course-1",
    name: "Tailwind CSS Starter Bootcamp",
    teachesSkills: ["Tailwind CSS", "Responsive Design"],
    link: "https://www.youtube.com/watch?v=ft30zcMlFao",
  },
  {
    _id: "course-2",
    name: "Node.js and Express Fundamentals",
    teachesSkills: ["Node.js", "Express", "REST APIs"],
    link: "https://www.youtube.com/watch?v=Oe421EPjeBE",
  },
  {
    _id: "course-3",
    name: "MongoDB for Beginners",
    teachesSkills: ["MongoDB"],
    link: "https://www.youtube.com/watch?v=ofme2o29ngU",
  },
  {
    _id: "course-4",
    name: "Python and SQL for Data Roles",
    teachesSkills: ["Python", "SQL", "Pandas"],
    link: "https://www.youtube.com/watch?v=rfscVS0vtbw",
  },
  {
    _id: "course-5",
    name: "Machine Learning Foundations",
    teachesSkills: ["Machine Learning", "Statistics"],
    link: "https://www.youtube.com/watch?v=Gv9_4yMHFhI",
  },
  {
    _id: "course-6",
    name: "UX Research and Figma Essentials",
    teachesSkills: ["Figma", "UX Research", "Prototyping"],
    link: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc",
  },
  {
    _id: "course-7",
    name: "React Native App Development",
    teachesSkills: ["React Native", "JavaScript", "Mobile UI"],
    link: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
  },
  {
    _id: "course-8",
    name: "Firebase Crash Course",
    teachesSkills: ["Firebase"],
    link: "https://www.youtube.com/watch?v=9kRgVxULbag",
  },
  {
    _id: "course-9",
    name: "DevOps Basics with Docker and AWS",
    teachesSkills: ["Docker", "AWS", "CI/CD", "Linux"],
    link: "https://www.youtube.com/watch?v=3c-iBn73dDE",
  },
];

class MatchService {
  calculateMatch(
    studentSkills: string[],
    requiredSkills: string[],
    preferredSkills: string[],
  ): MatchResult {
    const uniqueStudentSkills = dedupeSkills(studentSkills);
    const uniqueRequiredSkills = dedupeSkills(requiredSkills);
    const uniquePreferredSkills = dedupeSkills(preferredSkills);

    const matchedRequired = findMatches(uniqueStudentSkills, uniqueRequiredSkills);
    const matchedPreferred = findMatches(
      uniqueStudentSkills,
      uniquePreferredSkills,
    );
    const missingSkills = this.findMissingSkills(
      uniqueStudentSkills,
      uniqueRequiredSkills,
    );

    const matchScore =
      uniqueRequiredSkills.length === 0
        ? 100
        : Math.round((matchedRequired.length / uniqueRequiredSkills.length) * 100);

    return {
      matchScore,
      matchedSkills: dedupeSkills([...matchedRequired, ...matchedPreferred]),
      missingSkills,
    };
  }

  findMissingSkills(studentSkills: string[], requiredSkills: string[]): string[] {
    const studentSkillSet = new Set(studentSkills.map(normalizeSkill));

    return dedupeSkills(requiredSkills).filter(
      (skill) => !studentSkillSet.has(normalizeSkill(skill)),
    );
  }

  resolveStudentSkills(studentId: string): string[] {
    return dummyStudentProfiles[studentId] ?? dummyStudentProfiles["demo-student"];
  }

  resolveInternshipProfile(internshipId: string): DummyInternshipProfile {
    const directMatch = dummyInternshipProfiles[internshipId];
    if (directMatch) {
      return directMatch;
    }

    const normalizedId = internshipId.toLowerCase();

    if (normalizedId.includes("frontend")) {
      return dummyInternshipProfiles["1"];
    }

    if (
      normalizedId.includes("data") ||
      normalizedId.includes("ml") ||
      normalizedId.includes("science")
    ) {
      return dummyInternshipProfiles["2"];
    }

    if (
      normalizedId.includes("design") ||
      normalizedId.includes("ux") ||
      normalizedId.includes("ui")
    ) {
      return dummyInternshipProfiles["3"];
    }

    if (normalizedId.includes("backend") || normalizedId.includes("node")) {
      return dummyInternshipProfiles["4"];
    }

    if (normalizedId.includes("mobile") || normalizedId.includes("react-native")) {
      return dummyInternshipProfiles["5"];
    }

    if (normalizedId.includes("devops") || normalizedId.includes("cloud")) {
      return dummyInternshipProfiles["6"];
    }

    return {
      requiredSkills: ["React", "Communication", "Problem Solving"],
      preferredSkills: ["Git", "Teamwork"],
    };
  }

  async suggestCourses(missingSkills: string[]): Promise<SuggestedCourse[]> {
    const uniqueMissingSkills = dedupeSkills(missingSkills);

    if (uniqueMissingSkills.length === 0) {
      return [];
    }

    return dummyCourses.filter((course) =>
      course.teachesSkills.some((skill) =>
        uniqueMissingSkills.includes(normalizeSkill(skill)),
      ),
    );
  }
}

export const matchService = new MatchService();
