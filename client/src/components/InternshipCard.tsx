import { MapPin, Clock, Users, Building2 } from "lucide-react";
import SkillTag from "./SkillTag";
import MatchScoreBadge from "./MatchScoreBadge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface InternshipCardProps {
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
  description?: string;
  requirements?: string[];
  applyUrl?: string;
  showApply?: boolean;
}

const InternshipCard = ({
  id, title, company, location, type, duration, stipend,
  skills, postedDate, applicants, matchScore, description, requirements, applyUrl, showApply = true,
}: InternshipCardProps) => (
  <div className="glass-card rounded-lg p-5 hover-lift group">
    <div className="flex items-start justify-between mb-3">
      <div>
        <Link
          to={`/internships/${id}`}
          state={{
            internship: {
              id,
              title,
              company,
              location,
              type,
              duration,
              stipend,
              skills,
              postedDate,
              applicants,
              matchScore,
              description,
              requirements,
              applyUrl,
            },
          }}
          className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors"
        >
          {title}
        </Link>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
          <Building2 className="h-3.5 w-3.5" />
          <span>{company}</span>
        </div>
      </div>
      {matchScore && <MatchScoreBadge score={matchScore} size="sm" />}
    </div>

    <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{location}</span>
      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duration}</span>
      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{applicants} applicants</span>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-4">
      {skills.map(s => <SkillTag key={s} skill={s} />)}
    </div>

    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-foreground">{stipend}</span>
        <span className="text-xs text-muted-foreground ml-2">• {type}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{postedDate}</span>
        {showApply && (
          <Link
            to={`/internships/${id}`}
            state={{
              internship: {
                id,
                title,
                company,
                location,
                type,
                duration,
                stipend,
                skills,
                postedDate,
                applicants,
                matchScore,
                description,
                requirements,
                applyUrl,
              },
            }}
          >
            <Button size="sm">View & Apply</Button>
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default InternshipCard;
