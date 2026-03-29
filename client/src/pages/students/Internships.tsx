import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { jobService, type InternshipJob } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";

const Internships = () => {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("all");
  const [internships, setInternships] = useState<InternshipJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchInternships = async (showLoading: boolean): Promise<void> => {
    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setErrorMessage(null);

    try {
      const result = await jobService.getJobs({ limit: 60 });
      setInternships(result.data);

      if (result.sourceWarnings.length > 0) {
        toast({
          title: "Web source warning",
          description: result.sourceWarnings[0],
        });
      }
    } catch (error) {
      console.error("Failed to load internships:", error);
      setErrorMessage("Could not load live internships. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchInternships(true);
  }, []);

  const locations = useMemo(
    () => ["all", ...new Set(internships.map((i) => i.location))],
    [internships],
  );

  let filtered = internships.filter(
    (i) =>
      (keyword === "" ||
        i.title.toLowerCase().includes(keyword.toLowerCase()) ||
        i.company.toLowerCase().includes(keyword.toLowerCase()) ||
        i.skills.some((s) => s.toLowerCase().includes(keyword.toLowerCase()))) &&
      (locationFilter === "all" || i.location === locationFilter),
  );

  if (sortBy === "match") {
    filtered = [...filtered].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Browse Internships</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by keyword, skill..." className="pl-10" value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l === "all" ? "All Locations" : l}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="match">Highest Match</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => void fetchInternships(false)}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} internships found</p>

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Fetching internships from web sources...</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-4">
          {!isLoading && filtered.map((i) => <InternshipCard key={i.id} {...i} />)}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No internships found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships;
