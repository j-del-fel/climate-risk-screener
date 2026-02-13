import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lightbulb, Play, Loader2, ChevronDown, ChevronUp, ExternalLink, Download, Search, Zap, Beaker, Factory, Building2, Fuel, FlaskConical, AlertTriangle, CheckCircle2, Clock, TrendingUp, Shield, Info, BarChart3, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Technology {
  id: string;
  name: string;
  sector: string;
  trl: number;
  category: string;
  description: string;
  yearAssessed: number;
  netZeroRole: string;
  keyPlayers: string[];
}

interface TrlLevel {
  level: number;
  name: string;
  phase: string;
  description: string;
  color: string;
}

interface TrlSource {
  name: string;
  organization: string;
  url: string;
  description: string;
  citation: string;
  lastUpdated: string;
  coverage: string;
  supportedBy: string;
}

interface TrlData {
  source: TrlSource;
  trlScale: TrlLevel[];
  sectors: string[];
  technologies: Technology[];
  totalCount: number;
  filteredCount: number;
  categories: string[];
  sectorBreakdown: { sector: string; count: number; avgTrl: number }[];
  trlDistribution: { level: number; count: number }[];
}

interface RiskAssessment {
  technologyName: string;
  trl: number;
  riskLevel: string;
  riskScore: number;
  riskType: string;
  timeHorizon: string;
  assessment: string;
  opportunities: string;
  mitigationStrategies: string[];
}

interface AnalysisResult {
  executiveSummary: string;
  technologyRiskAssessment: RiskAssessment[];
  sectorOutlook: {
    overallReadiness: string;
    keyTrends: string[];
    criticalGaps: string[];
    investmentPriorities: string[];
    timelineToCommercialization: string;
  };
  strategicRecommendations: {
    priority: string;
    recommendation: string;
    rationale: string;
    relatedTechnologies: string[];
  }[];
  climateImpactAssessment: {
    emissionReductionPotential: string;
    criticalPathTechnologies: string[];
    innovationGaps: string[];
    policyImplications: string[];
  };
  dataSource: TrlSource;
  technologiesAnalyzed: number;
  analyzedAt: string;
}

const sectorIcons: Record<string, typeof Zap> = {
  "Power Generation": Zap,
  "Energy Storage": Fuel,
  "Transport": Factory,
  "Industry": Factory,
  "Buildings": Building2,
  "Carbon Capture & Hydrogen": FlaskConical,
  "Fuels & Bioenergy": Beaker,
};

function getTrlColor(trl: number): string {
  if (trl <= 2) return "bg-red-100 text-red-800 border-red-300";
  if (trl <= 4) return "bg-orange-100 text-orange-800 border-orange-300";
  if (trl <= 6) return "bg-amber-100 text-amber-800 border-amber-300";
  if (trl <= 8) return "bg-lime-100 text-lime-800 border-lime-300";
  if (trl <= 10) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  return "bg-blue-100 text-blue-800 border-blue-300";
}

function getTrlBarColor(trl: number): string {
  if (trl <= 2) return "bg-red-500";
  if (trl <= 4) return "bg-orange-500";
  if (trl <= 6) return "bg-amber-500";
  if (trl <= 8) return "bg-lime-500";
  if (trl <= 10) return "bg-emerald-500";
  return "bg-blue-500";
}

function getRiskColor(level: string): string {
  switch (level) {
    case "Critical": return "bg-red-100 text-red-800 border-red-300";
    case "High": return "bg-orange-100 text-orange-800 border-orange-300";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Low": return "bg-green-100 text-green-800 border-green-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "High": return "bg-red-50 border-red-200";
    case "Medium": return "bg-amber-50 border-amber-200";
    case "Low": return "bg-green-50 border-green-200";
    default: return "bg-gray-50 border-gray-200";
  }
}

export default function TrlPage() {
  const [activeTab, setActiveTab] = useState("learn");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [analysisSector, setAnalysisSector] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [expandedTechs, setExpandedTechs] = useState<Set<string>>(new Set());
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set());
  const [expandedScaleItem, setExpandedScaleItem] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: trlData, isLoading } = useQuery<TrlData>({
    queryKey: ["/api/trl/technologies", sectorFilter, phaseFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (sectorFilter !== "all") params.append("sector", sectorFilter);
      if (phaseFilter !== "all") params.append("phase", phaseFilter);
      if (searchQuery) params.append("search", searchQuery);
      const res = await fetch(`/api/trl/technologies?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch TRL data");
      return res.json();
    },
  });

  const analysisMutation = useMutation({
    mutationFn: async (data: { sector: string; companyDescription: string }) => {
      const res = await apiRequest("POST", "/api/trl/analyze", data);
      return res.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
      toast({ title: "Analysis Complete", description: `Analyzed ${data.technologiesAnalyzed} technologies from IEA ETP data.` });
    },
    onError: (error: Error) => {
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleAnalyze = () => {
    if (!analysisSector && !companyDescription) {
      toast({ title: "Input Required", description: "Please select a sector or describe your organization.", variant: "destructive" });
      return;
    }
    analysisMutation.mutate({ sector: analysisSector, companyDescription });
  };

  const toggleTech = (id: string) => {
    setExpandedTechs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleRisk = (name: string) => {
    setExpandedRisks(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const maxDistribution = trlData ? Math.max(...trlData.trlDistribution.map(d => d.count)) : 1;

  const exportAnalysisCsv = () => {
    if (!analysisResult) return;
    const rows = [["Technology", "TRL", "Risk Level", "Risk Score", "Risk Type", "Time Horizon", "Assessment", "Opportunities"]];
    analysisResult.technologyRiskAssessment.forEach(r => {
      rows.push([r.technologyName, String(r.trl), r.riskLevel, String(r.riskScore), r.riskType, r.timeHorizon, `"${r.assessment}"`, `"${r.opportunities}"`]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trl-risk-analysis-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h1 className="text-xl font-semibold text-gray-900">Technology Readiness Levels</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">IEA ETP Data</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="learn">Learning & Background</TabsTrigger>
            <TabsTrigger value="explore">Technology Explorer</TabsTrigger>
            <TabsTrigger value="analyze">Risk Analysis</TabsTrigger>
          </TabsList>

          {/* LEARNING TAB */}
          <TabsContent value="learn">
            <div className="space-y-6">
              {/* Intro */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <Lightbulb className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">What are Technology Readiness Levels?</h2>
                      <p className="text-gray-600 mb-3">
                        Technology Readiness Levels (TRLs) are a systematic measurement framework used to assess the maturity of a technology from initial concept to full commercial deployment. Originally developed by NASA in the 1970s for space technology assessment, TRLs have been widely adopted across energy, defense, and industrial sectors.
                      </p>
                      <p className="text-gray-600 mb-3">
                        The <strong>International Energy Agency (IEA)</strong> uses an extended <strong>11-level TRL scale</strong> specifically designed for clean energy technologies, going beyond the traditional 9-level NASA scale to capture the nuances of commercial deployment and market integration that are critical for the energy transition.
                      </p>
                      <p className="text-gray-600">
                        The IEA's <strong>ETP Clean Energy Technology Guide</strong> tracks approximately 600 clean energy technologies across the entire energy system, assessing each against this TRL framework. This data is essential for understanding which technologies are ready for deployment, which need further R&D, and where investment is most needed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Source Attribution */}
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Info className="w-5 h-5" />
                    IEA Data Source
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Source</p>
                      <p className="text-sm text-blue-700">IEA ETP Clean Energy Technology Guide (2024)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Organization</p>
                      <p className="text-sm text-blue-700">International Energy Agency (IEA)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Coverage</p>
                      <p className="text-sm text-blue-700">~600 individual technology designs and components</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Supported By</p>
                      <p className="text-sm text-blue-700">Governments of Canada, Germany, Japan, and the European Commission</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600 italic">
                      Citation: IEA (2024), ETP Clean Energy Technology Guide, IEA, Paris
                    </p>
                    <a href="https://www.iea.org/data-and-statistics/data-tools/etp-clean-energy-technology-guide" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 mt-1 font-medium">
                      View Original Data <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* IEA 11-Level TRL Scale */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                    IEA 11-Level TRL Scale
                  </CardTitle>
                  <p className="text-sm text-gray-500">The IEA extends the traditional NASA 9-level scale to 11 levels, adding granularity for commercial deployment and market maturity stages critical to the energy transition.</p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid md:grid-cols-2 gap-3">
                    {trlData?.trlScale.map((level) => (
                      <div
                        key={level.level}
                        className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setExpandedScaleItem(expandedScaleItem === level.level ? null : level.level)}
                      >
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: level.color }}>
                            {level.level}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-900 truncate">{level.name}</span>
                              <Badge variant="outline" className="text-xs flex-shrink-0">{level.phase}</Badge>
                            </div>
                          </div>
                          {expandedScaleItem === level.level ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                        {expandedScaleItem === level.level && (
                          <div className="px-3 pb-3 border-t bg-gray-50">
                            <p className="text-sm text-gray-600 mt-2">{level.description}</p>
                          </div>
                        )}
                      </div>
                    )) || Array.from({ length: 11 }, (_, i) => (
                      <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Phase Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>IEA Technology Maturity Phases</CardTitle>
                  <p className="text-sm text-gray-500">The IEA groups the 11 TRL levels into four broader maturity categories that describe the commercialization journey of clean energy technologies.</p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { phase: "Prototype", levels: "TRL 1-6", color: "border-orange-300 bg-orange-50", icon: Beaker, description: "From initial concept and basic research through laboratory validation to engineering-scale prototypes. Technologies in this phase require significant R&D investment and carry high technical risk." },
                      { phase: "Demonstration", levels: "TRL 7-8", color: "border-yellow-300 bg-yellow-50", icon: Factory, description: "Pre-commercial and first-of-a-kind commercial systems operating in real-world conditions. Focus on proving technical and economic viability at scale." },
                      { phase: "Early Adoption", levels: "TRL 9-10", color: "border-green-300 bg-green-50", icon: TrendingUp, description: "Commercially available technologies that are competitive but still need market growth, policy support, and system integration efforts for widespread deployment." },
                      { phase: "Mature", levels: "TRL 11", color: "border-blue-300 bg-blue-50", icon: CheckCircle2, description: "Fully mature technologies with predictable growth, established supply chains, and integration into the wider energy system. Stable market performance." }
                    ].map(({ phase, levels, color, icon: Icon, description }) => (
                      <Card key={phase} className={`${color}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-5 h-5" />
                            <h3 className="font-semibold">{phase}</h3>
                          </div>
                          <Badge variant="outline" className="mb-2">{levels}</Badge>
                          <p className="text-xs text-gray-600">{description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Why TRLs Matter */}
              <Card>
                <CardHeader>
                  <CardTitle>Why TRLs Matter for Climate Risk</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Investment Decisions", icon: TrendingUp, text: "TRLs help investors and policymakers understand the risk profile of clean energy technologies. Lower TRLs indicate higher technical risk but potentially transformative impact. Higher TRLs suggest lower risk and nearer-term deployment." },
                      { title: "Net-Zero Pathways", icon: Target, text: "The IEA estimates that ~35% of cumulative emission reductions needed for net-zero by 2050 must come from technologies currently at prototype or demonstration stage (TRL 1-8). Tracking TRL progress is crucial for assessing net-zero feasibility." },
                      { title: "Technology Risk Screening", icon: Shield, text: "Organizations can use TRL assessments to identify transition risks (dependency on technologies that may not mature) and opportunities (early adoption of emerging solutions). TRL-based analysis complements TCFD climate risk frameworks." }
                    ].map(({ title, icon: Icon, text }) => (
                      <div key={title} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-sm">{title}</h3>
                        </div>
                        <p className="text-xs text-gray-600">{text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Distribution */}
              {trlData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      IEA Technology Distribution by TRL Level
                    </CardTitle>
                    <p className="text-sm text-gray-500">Distribution of {trlData.totalCount} clean energy technologies across the IEA's 11-level TRL scale</p>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-2">
                      {trlData.trlDistribution.map((d) => {
                        const level = trlData.trlScale.find(s => s.level === d.level);
                        return (
                          <div key={d.level} className="flex items-center gap-3">
                            <div className="w-20 text-sm font-medium text-gray-700 flex-shrink-0">TRL {d.level}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getTrlBarColor(d.level)}`}
                                style={{ width: `${(d.count / maxDistribution) * 100}%` }}
                              />
                              <span className="absolute inset-0 flex items-center px-2 text-xs font-medium">
                                {d.count > 0 && `${d.count} tech${d.count !== 1 ? 's' : ''}`}
                              </span>
                            </div>
                            <div className="w-32 text-xs text-gray-500 flex-shrink-0 truncate">{level?.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sector Breakdown */}
              {trlData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sector Overview from IEA ETP Data</CardTitle>
                    <p className="text-sm text-gray-500">Average TRL and technology count by sector from the IEA ETP Clean Energy Technology Guide</p>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trlData.sectorBreakdown.map(({ sector, count, avgTrl }) => {
                        const Icon = sectorIcons[sector] || Zap;
                        return (
                          <div key={sector} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => { setSectorFilter(sector); setActiveTab("explore"); }}>
                            <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{sector}</div>
                              <div className="text-xs text-gray-500">{count} technologies</div>
                            </div>
                            <Badge variant="outline">Avg TRL {avgTrl}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setActiveTab("explore")} className="flex-1">
                  Explore IEA Technologies <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
                <Button onClick={() => setActiveTab("analyze")} variant="outline" className="flex-1">
                  Run Risk Analysis <Play className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* TECHNOLOGY EXPLORER TAB */}
          <TabsContent value="explore">
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search technologies, players, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={sectorFilter} onValueChange={setSectorFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
                        {trlData?.sectors.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Phases" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Phases</SelectItem>
                        <SelectItem value="Concept">Concept (TRL 1-2)</SelectItem>
                        <SelectItem value="Prototype">Prototype (TRL 3-6)</SelectItem>
                        <SelectItem value="Demonstration">Demonstration (TRL 7-8)</SelectItem>
                        <SelectItem value="Early adoption">Early Adoption (TRL 9-10)</SelectItem>
                        <SelectItem value="Mature">Mature (TRL 11)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {trlData && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <span>Showing {trlData.filteredCount} of {trlData.totalCount} technologies</span>
                      <span className="text-xs">|</span>
                      <span className="text-xs">Source: IEA ETP Clean Energy Technology Guide (2024)</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technology List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                  <span>Loading IEA technology data...</span>
                </div>
              ) : trlData?.technologies.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No technologies match your filters. Try broadening your search.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {trlData?.technologies.map((tech) => (
                    <Card key={tech.id} className="hover:shadow-md transition-shadow">
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleTech(tech.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <Badge className={`${getTrlColor(tech.trl)} font-bold text-sm px-3`}>
                              TRL {tech.trl}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{tech.name}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Badge variant="outline" className="text-xs">{tech.sector}</Badge>
                              <span>{tech.category}</span>
                              <span className="text-xs">|</span>
                              <span>Net-zero: {tech.netZeroRole}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-100 rounded-full h-2 hidden sm:block">
                              <div className={`h-full rounded-full ${getTrlBarColor(tech.trl)}`} style={{ width: `${(tech.trl / 11) * 100}%` }} />
                            </div>
                            {expandedTechs.has(tech.id) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </div>
                        </div>
                      </div>
                      {expandedTechs.has(tech.id) && (
                        <div className="px-4 pb-4 border-t bg-gray-50">
                          <div className="mt-3 space-y-3">
                            <p className="text-sm text-gray-700">{tech.description}</p>
                            <div className="grid sm:grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">TRL Phase</p>
                                <p className="text-sm">{trlData?.trlScale.find(s => s.level === tech.trl)?.phase} - {trlData?.trlScale.find(s => s.level === tech.trl)?.name}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Year Assessed</p>
                                <p className="text-sm">{tech.yearAssessed}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Net-Zero Role</p>
                                <p className="text-sm">{tech.netZeroRole}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Key Players</p>
                              <div className="flex flex-wrap gap-1">
                                {tech.keyPlayers.map(p => (
                                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 italic">Source: IEA ETP Clean Energy Technology Guide (2024)</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ANALYSIS TAB */}
          <TabsContent value="analyze">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-primary" />
                      Technology Risk Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      AI-powered analysis of technology risks and opportunities using IEA ETP Clean Energy Technology Guide data.
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Sector Focus</label>
                      <Select value={analysisSector} onValueChange={setAnalysisSector}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {trlData?.sectors.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Organization Description (optional)</label>
                      <Textarea
                        placeholder="Describe your organization, industry focus, and what technology areas you're interested in..."
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleAnalyze}
                      disabled={analysisMutation.isPending}
                    >
                      {analysisMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing IEA Data...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run TRL Risk Analysis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-800 font-medium mb-1">Data Used in Analysis</p>
                        <p className="text-xs text-blue-700">
                          This analysis uses technology readiness data from the IEA ETP Clean Energy Technology Guide, covering ~600 technologies with TRL 1-11 assessments. The AI evaluates deployment risk, cost trajectories, and strategic implications based on current maturity levels.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2 space-y-4">
                {!analysisResult && !analysisMutation.isPending && (
                  <Card>
                    <CardContent className="p-12 text-center text-gray-500">
                      <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="font-medium text-gray-700 mb-2">Select a Sector to Analyze</h3>
                      <p className="text-sm">Choose a sector and optionally describe your organization to receive an AI-powered technology risk and opportunity assessment using IEA ETP data.</p>
                    </CardContent>
                  </Card>
                )}

                {analysisMutation.isPending && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                      <h3 className="font-medium mb-2">Analyzing IEA Technology Data...</h3>
                      <p className="text-sm text-gray-500">Evaluating technology readiness, deployment risks, and strategic opportunities</p>
                      <Progress value={65} className="mt-4 max-w-xs mx-auto" />
                    </CardContent>
                  </Card>
                )}

                {analysisResult && (
                  <>
                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Analysis Results
                          </CardTitle>
                          <Button variant="outline" size="sm" onClick={exportAnalysisCsv}>
                            <Download className="w-4 h-4 mr-1" />
                            Export CSV
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">{analysisResult.technologiesAnalyzed} technologies analyzed</Badge>
                          <Badge variant="outline">{new Date(analysisResult.analyzedAt).toLocaleDateString()}</Badge>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">IEA ETP Data Source</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="prose prose-sm max-w-none">
                          {analysisResult.executiveSummary.split('\n').map((p, i) => (
                            <p key={i} className="text-gray-700 text-sm mb-2">{p}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sector Outlook */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Sector Outlook</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Overall Readiness:</span>
                          <Badge>{analysisResult.sectorOutlook.overallReadiness}</Badge>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Key Trends</p>
                          <div className="space-y-1">
                            {analysisResult.sectorOutlook.keyTrends.map((t, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <TrendingUp className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Critical Gaps</p>
                          <div className="space-y-1">
                            {analysisResult.sectorOutlook.criticalGaps.map((g, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 text-amber-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{g}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Investment Priorities</p>
                          <div className="space-y-1">
                            {analysisResult.sectorOutlook.investmentPriorities.map((p, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <Target className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <p className="text-xs font-medium text-gray-500 mb-1">Timeline to Commercialization</p>
                          <p className="text-sm text-gray-700">{analysisResult.sectorOutlook.timelineToCommercialization}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technology Risk Assessment */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Technology Risk Assessment</CardTitle>
                        <p className="text-xs text-gray-500">Individual technology risk evaluation based on IEA TRL data</p>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="space-y-2">
                          {analysisResult.technologyRiskAssessment.map((risk, i) => (
                            <div key={i} className="border rounded-lg overflow-hidden">
                              <div
                                className="p-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3"
                                onClick={() => toggleRisk(risk.technologyName)}
                              >
                                <Badge className={`${getTrlColor(risk.trl)} font-bold text-xs`}>TRL {risk.trl}</Badge>
                                <span className="flex-1 font-medium text-sm">{risk.technologyName}</span>
                                <Badge className={`${getRiskColor(risk.riskLevel)} text-xs`}>{risk.riskLevel} Risk</Badge>
                                <div className="w-16 text-center">
                                  <span className="text-xs text-gray-500">Score: </span>
                                  <span className="text-sm font-bold">{risk.riskScore}/10</span>
                                </div>
                                {expandedRisks.has(risk.technologyName) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                              {expandedRisks.has(risk.technologyName) && (
                                <div className="p-3 border-t bg-gray-50 space-y-3">
                                  <div className="grid sm:grid-cols-2 gap-2">
                                    <div>
                                      <p className="text-xs font-medium text-gray-500">Risk Type</p>
                                      <p className="text-sm">{risk.riskType}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-gray-500">Time Horizon</p>
                                      <p className="text-sm">{risk.timeHorizon}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Assessment</p>
                                    <p className="text-sm text-gray-700">{risk.assessment}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Opportunities</p>
                                    <p className="text-sm text-gray-700">{risk.opportunities}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Mitigation Strategies</p>
                                    <div className="flex flex-wrap gap-1">
                                      {risk.mitigationStrategies.map((s, j) => (
                                        <Badge key={j} variant="outline" className="text-xs">{s}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Strategic Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Strategic Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="space-y-3">
                          {analysisResult.strategicRecommendations.map((rec, i) => (
                            <div key={i} className={`p-4 border rounded-lg ${getPriorityColor(rec.priority)}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"} className="text-xs">{rec.priority} Priority</Badge>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">{rec.recommendation}</p>
                              <p className="text-xs text-gray-600 mb-2">{rec.rationale}</p>
                              {rec.relatedTechnologies.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {rec.relatedTechnologies.map((t, j) => (
                                    <Badge key={j} variant="outline" className="text-xs">{t}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Climate Impact Assessment */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Climate Impact Assessment</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0 space-y-4">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs font-medium text-green-800 mb-1">Emission Reduction Potential</p>
                          <p className="text-sm text-green-700">{analysisResult.climateImpactAssessment.emissionReductionPotential}</p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Critical Path Technologies</p>
                            <div className="space-y-1">
                              {analysisResult.climateImpactAssessment.criticalPathTechnologies.map((t, i) => (
                                <div key={i} className="flex items-start gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-700">{t}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Innovation Gaps</p>
                            <div className="space-y-1">
                              {analysisResult.climateImpactAssessment.innovationGaps.map((g, i) => (
                                <div key={i} className="flex items-start gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-700">{g}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Policy Implications</p>
                            <div className="space-y-1">
                              {analysisResult.climateImpactAssessment.policyImplications.map((p, i) => (
                                <div key={i} className="flex items-start gap-1">
                                  <Shield className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-700">{p}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Data Source Footer */}
                    <Card className="border-blue-200 bg-blue-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-blue-800 font-medium">IEA Data Attribution</p>
                            <p className="text-xs text-blue-700 mt-1">
                              {analysisResult.dataSource.citation}. {analysisResult.dataSource.description}
                            </p>
                            <a href={analysisResult.dataSource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 mt-1 font-medium">
                              View IEA ETP Clean Energy Technology Guide <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
