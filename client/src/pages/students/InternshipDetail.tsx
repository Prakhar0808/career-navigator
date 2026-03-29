import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { jobService, type InternshipJob } from "@/services/jobService";
import { MapPin, Clock, Users, Building2, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

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
  const state = location.state as InternshipLocationState | null;

  const [internship, setInternship] = useState<InternshipDetailRecord | null>(
    state?.internship ?? null,
  );
  const [similar, setSimilar] = useState<InternshipJob[]>([]);
  const [isLoading, setIsLoading] = useState(!state?.internship);

  useEffect(() => {
    const loadDetail = async (): Promise<void> => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        // Keep existing state data (faster UX), but refresh from API if needed.
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

    const skillRequirements = internship.skills.map((skill) =>
      `Working knowledge of ${skill}`,
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
        <div className="text-center py-20">
          <p className="text-muted-foreground">Internship not found.</p>
          <Link to="/internships"><Button variant="outline" className="mt-4">Back to Listings</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/internships" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="glass-card rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{internship.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {internship.company}
              </div>
            </div>
            <MatchScoreBadge score={internship.matchScore} size="lg" />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{internship.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{internship.duration}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{internship.applicants} applicants</span>
            <span className="font-semibold text-foreground">{internship.stipend}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {internship.skills.map(s => <SkillTag key={s} skill={s} />)}
          </div>

          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground mb-6">{description}</p>

          <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
          <ul className="space-y-1.5 mb-6">
            {requirements.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> {r}
              </li>
            ))}
          </ul>

          {internship.applyUrl ? (
            <a href={internship.applyUrl} target="_blank" rel="noreferrer">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0">
                Apply Now
              </Button>
            </a>
          ) : (
            <Button size="lg" className="gradient-primary text-primary-foreground border-0" disabled>
              Apply Link Unavailable
            </Button>
          )}
        </div>

        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Similar Internships</h2>
            <div className="grid gap-4">
              {similar.map(i => <InternshipCard key={i.id} {...i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetail;
