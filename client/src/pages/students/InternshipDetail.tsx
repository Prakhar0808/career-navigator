import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { jobService, type InternshipJob } from "@/services/jobService";
import {
  matchService,
  type MatchResult,
  type SuggestionsResult,
} from "@/services/matchService";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

type InternshipDetailRecord = InternshipJob & {
  description?: string;
  requirements?: string[];
};

interface InternshipLocationState {
  internship?: InternshipDetailRecord;
}

const InternshipDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as InternshipLocationState | null;

  const [internship, setInternship] = useState<InternshipDetailRecord | null>(
    state?.internship ?? null,
  );
  const [similar, setSimilar] = useState<InternshipJob[]>([]);
  const [isLoading, setIsLoading] = useState(!state?.internship);
  const [matchData, setMatchData] = useState<MatchResult | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionsResult | null>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const studentId = user?.role === "student" ? user._id : "demo-student";
  const isUsingDemoProfile = !user || user.role !== "student";

  useEffect(() => {
    const loadDetail = async (): Promise<void> => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        if (!state?.internship) {
          const detailResult = await jobService.getJobById(id);
          setInternship(detailResult.data);
        }

        const listResult = await jobService.getJobs({ limit: 20 });
        setSimilar(listResult.data.filter((item) => item.id !== id).slice(0, 3));
      } catch (error) {
        console.error("Failed to load internship details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDetail();
  }, [id, state?.internship]);

  useEffect(() => {
    const loadMatchInsights = async (): Promise<void> => {
      if (!id) {
        setMatchData(null);
        setSuggestions(null);
        setMatchError(null);
        return;
      }

      setIsMatchLoading(true);
      setMatchError(null);

      try {
        const [matchResult, suggestionsResult] = await Promise.all([
          matchService.getMatch(studentId, id),
          matchService.getSuggestions(studentId, id),
        ]);

        setMatchData(matchResult);
        setSuggestions(suggestionsResult);
      } catch (error) {
        console.error("Failed to load match insights:", error);
        setMatchData(null);
        setSuggestions(null);
        setMatchError(
          "We couldn't load personalized matching insights for this internship yet.",
        );
      } finally {
        setIsMatchLoading(false);
      }
    };

    void loadMatchInsights();
  }, [id, studentId]);

  const description = useMemo(() => {
    if (!internship) {
      return "";
    }

    if (internship.description) {
      return internship.description;
    }

    return `This is a live internship listing from ${internship.company}. Review the details and use the apply link to submit your application on the source platform.`;
  }, [internship]);

  const requirements = useMemo(() => {
    if (!internship) {
      return [];
    }

    if (internship.requirements && internship.requirements.length > 0) {
      return internship.requirements;
    }

    const skillRequirements = internship.skills.map(
      (skill) => `Working knowledge of ${skill}`,
    );

    return [
      ...skillRequirements,
      "Strong communication and collaboration skills",
      "Willingness to learn and adapt quickly",
    ].slice(0, 6);
  }, [internship]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3" />
          <p>Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Internship not found.</p>
          <Link to="/internships">
            <Button variant="outline" className="mt-4">
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/internships"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="glass-card rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {internship.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {internship.company}
              </div>
            </div>
            <MatchScoreBadge
              score={matchData?.matchScore ?? internship.matchScore ?? 0}
              size="lg"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {internship.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {internship.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {internship.applicants} applicants
            </span>
            <span className="font-semibold text-foreground">
              {internship.stipend}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {internship.skills.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>

          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground mb-6">{description}</p>

          <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
          <ul className="space-y-1.5 mb-6">
            {requirements.map((requirement, index) => (
              <li
                key={`${requirement}-${index}`}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                {requirement}
              </li>
            ))}
          </ul>

          {internship.applyUrl ? (
            <a href={internship.applyUrl} target="_blank" rel="noreferrer">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground border-0"
              >
                Apply Now
              </Button>
            </a>
          ) : (
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground border-0"
              disabled
            >
              Apply Link Unavailable
            </Button>
          )}
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Profile Match Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isUsingDemoProfile && (
              <p className="text-sm text-muted-foreground">
                Showing suggestions with a demo student profile for now.
              </p>
            )}

            {isMatchLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading match insights...
              </div>
            )}

            {!isMatchLoading && matchError && (
              <p className="text-sm text-muted-foreground">{matchError}</p>
            )}

            {!isMatchLoading && matchData && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">
                      Match Score
                    </span>
                    <MatchScoreBadge score={matchData.matchScore} size="md" />
                  </div>
                  <Progress value={matchData.matchScore} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {matchData.matchedSkills.length} matched skill
                    {matchData.matchedSkills.length === 1 ? "" : "s"} found from
                    your profile.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Matched Skills
                  </h3>
                  {matchData.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {matchData.matchedSkills.map((skill) => (
                        <SkillTag key={skill} skill={skill} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No required skills from this internship are present in your
                      profile yet.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Missing Skills
                  </h3>
                  {matchData.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {matchData.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You already cover all required skills for this internship.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Suggested Courses
                  </h3>
                  {suggestions?.recommendedCourses &&
                  suggestions.recommendedCourses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {suggestions.recommendedCourses.map((course) => (
                        <a
                          key={course._id}
                          href={course.link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/5"
                        >
                          <h4 className="font-semibold text-foreground">
                            {course.name}
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Covers: {course.teachesSkills.join(", ")}
                          </p>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No course suggestions are available for the missing skills right now.
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Similar Internships
            </h2>
            <div className="grid gap-4">
              {similar.map((item) => (
                <InternshipCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetail;
