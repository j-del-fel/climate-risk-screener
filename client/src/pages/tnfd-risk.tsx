import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TreePine, Play, Loader2, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Download, BookOpen, Info, TrendingUp, Leaf, Globe, Droplets, Fish, Bug, Shield, Sprout, Recycle, Landmark } from "lucide-react";

interface RiskSource {
  title: string;
  url: string;
  organization: string;
  relevance: string;
}

interface PeerComparison {
  peers: string[];
  rankings: {
    impact?: number;
    likelihood?: number;
    vulnerability?: number;
  };
  rationale: string;
}

interface TnfdRisk {
  category: string;
  subcategory: string;
  impactScore: number;
  likelihoodScore: number;
  vulnerabilityScore: number;
  overallRisk: number;
  narrative: string;
  reasoning: string;
  peerComparison: PeerComparison;
  sources: RiskSource[];
}

interface AnalysisResult {
  risks: TnfdRisk[];
  industry: string;
  message: string;
}

const categoryColors: Record<string, string> = {
  "Dependencies - Land & Freshwater": "bg-green-100 text-green-800 border-green-300",
  "Dependencies - Ocean & Coastal": "bg-cyan-100 text-cyan-800 border-cyan-300",
  "Impacts - Pollution & Waste": "bg-rose-100 text-rose-800 border-rose-300",
  "Impacts - Land Use Change": "bg-amber-100 text-amber-800 border-amber-300",
  "Risks - Ecosystem Service Loss": "bg-red-100 text-red-800 border-red-300",
  "Risks - Regulatory & Legal": "bg-violet-100 text-violet-800 border-violet-300",
  "Risks - Market & Reputation": "bg-orange-100 text-orange-800 border-orange-300",
  "Opportunities - Nature-Based Solutions": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Opportunities - Sustainable Products": "bg-teal-100 text-teal-800 border-teal-300",
  "Opportunities - Nature-Positive Finance": "bg-lime-100 text-lime-800 border-lime-300"
};

const categoryDescriptions: Record<string, string> = {
  "Dependencies - Land & Freshwater": "Dependencies on terrestrial ecosystems including soil health, freshwater, and pollination services.",
  "Dependencies - Ocean & Coastal": "Dependencies on marine resources, coastal protection, and ocean-based supply chains.",
  "Impacts - Pollution & Waste": "Impacts from chemical pollution, waste generation, and emissions on biodiversity.",
  "Impacts - Land Use Change": "Impacts from deforestation, habitat conversion, and agricultural expansion.",
  "Risks - Ecosystem Service Loss": "Risks from declining ecosystem services including pollination, water purification, and carbon sequestration.",
  "Risks - Regulatory & Legal": "Risks from biodiversity regulations, nature-related litigation, and mandatory TNFD disclosure.",
  "Risks - Market & Reputation": "Risks from stakeholder scrutiny on nature impacts and supply chain disruption from ecosystem degradation.",
  "Opportunities - Nature-Based Solutions": "Opportunities from ecosystem restoration, biodiversity credits, and nature-based infrastructure.",
  "Opportunities - Sustainable Products": "Opportunities from certified sustainable products, circular economy, and regenerative practices.",
  "Opportunities - Nature-Positive Finance": "Opportunities from biodiversity-linked finance, natural capital accounting, and conservation investment."
};

function getRiskColor(score: number): string {
  if (score >= 4) return "text-red-600";
  if (score >= 3) return "text-orange-600";
  if (score >= 2) return "text-yellow-600";
  return "text-green-600";
}

function getRiskLabel(score: number): string {
  if (score >= 4.5) return "Critical";
  if (score >= 3.5) return "High";
  if (score >= 2.5) return "Moderate";
  if (score >= 1.5) return "Low";
  return "Minimal";
}

function getRiskBadgeColor(score: number): string {
  if (score >= 4) return "bg-red-100 text-red-800 border-red-300";
  if (score >= 3) return "bg-orange-100 text-orange-800 border-orange-300";
  if (score >= 2) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-green-100 text-green-800 border-green-300";
}

function getOpportunityColor(score: number): string {
  if (score >= 4) return "text-emerald-600";
  if (score >= 3) return "text-teal-600";
  if (score >= 2) return "text-green-600";
  return "text-gray-600";
}

function getOpportunityBadgeColor(score: number): string {
  if (score >= 4) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (score >= 3) return "bg-teal-100 text-teal-800 border-teal-300";
  if (score >= 2) return "bg-green-100 text-green-800 border-green-300";
  return "bg-gray-100 text-gray-800 border-gray-300";
}

function getOpportunityLabel(score: number): string {
  if (score >= 4.5) return "Very High";
  if (score >= 3.5) return "High";
  if (score >= 2.5) return "Moderate";
  if (score >= 1.5) return "Low";
  return "Minimal";
}

function ScoreBar({ score, label, isOpportunity = false }: { score: number; label: string; isOpportunity?: boolean }) {
  const percentage = (score / 5) * 100;
  const color = isOpportunity 
    ? (score >= 4 ? "bg-emerald-500" : score >= 3 ? "bg-teal-500" : score >= 2 ? "bg-green-500" : "bg-gray-400")
    : (score >= 4 ? "bg-red-500" : score >= 3 ? "bg-orange-500" : score >= 2 ? "bg-yellow-500" : "bg-green-500");
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${isOpportunity ? getOpportunityColor(score) : getRiskColor(score)}`}>{score}/5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function RiskCard({ risk, index }: { risk: TnfdRisk; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isOpportunity = risk.category.startsWith("Opportunities");

  return (
    <Card className="border-l-4" style={{ 
      borderLeftColor: isOpportunity 
        ? (risk.overallRisk >= 4 ? '#059669' : risk.overallRisk >= 3 ? '#14b8a6' : risk.overallRisk >= 2 ? '#22c55e' : '#9ca3af')
        : (risk.overallRisk >= 4 ? '#ef4444' : risk.overallRisk >= 3 ? '#f97316' : risk.overallRisk >= 2 ? '#eab308' : '#22c55e')
    }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={categoryColors[risk.category] || "bg-gray-100 text-gray-800"}>
                {risk.category}
              </Badge>
              <Badge className={isOpportunity ? getOpportunityBadgeColor(risk.overallRisk) : getRiskBadgeColor(risk.overallRisk)}>
                {isOpportunity ? getOpportunityLabel(risk.overallRisk) : getRiskLabel(risk.overallRisk)} ({risk.overallRisk.toFixed(1)})
              </Badge>
            </div>
            <h4 className="font-semibold text-gray-900 mt-1">{risk.subcategory}</h4>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">{risk.narrative}</p>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <ScoreBar score={risk.impactScore} label={isOpportunity ? "Value Potential" : "Nature Impact"} isOpportunity={isOpportunity} />
          <ScoreBar score={risk.likelihoodScore} label={isOpportunity ? "Feasibility" : "Likelihood"} isOpportunity={isOpportunity} />
          <ScoreBar score={risk.vulnerabilityScore} label={isOpportunity ? "Readiness" : "Vulnerability"} isOpportunity={isOpportunity} />
        </div>

        <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
          {expanded ? "Show Less" : "Detailed TNFD LEAP Analysis & Sources"}
        </Button>

        {expanded && (
          <div className="mt-3 space-y-4 border-t pt-3">
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-1">TNFD LEAP-Aligned Analysis</h5>
              <p className="text-sm text-gray-600">{risk.reasoning}</p>
            </div>

            {risk.peerComparison?.peers?.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Peer Comparison</h5>
                <div className="flex flex-wrap gap-1 mb-2">
                  {risk.peerComparison.peers.map((peer) => (
                    <Badge key={peer} variant="outline" className="text-xs">{peer}</Badge>
                  ))}
                </div>
                {risk.peerComparison.rankings && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {risk.peerComparison.rankings.impact && (
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <p className="text-xs text-gray-500">{isOpportunity ? "Value Rank" : "Impact Rank"}</p>
                        <p className="font-semibold text-sm">{risk.peerComparison.rankings.impact}/6</p>
                      </div>
                    )}
                    {risk.peerComparison.rankings.likelihood && (
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <p className="text-xs text-gray-500">{isOpportunity ? "Feasibility Rank" : "Likelihood Rank"}</p>
                        <p className="font-semibold text-sm">{risk.peerComparison.rankings.likelihood}/6</p>
                      </div>
                    )}
                    {risk.peerComparison.rankings.vulnerability && (
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <p className="text-xs text-gray-500">{isOpportunity ? "Readiness Rank" : "Vulnerability Rank"}</p>
                        <p className="font-semibold text-sm">{risk.peerComparison.rankings.vulnerability}/6</p>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-600">{risk.peerComparison.rationale}</p>
              </div>
            )}

            {risk.sources?.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Sources</h5>
                <div className="space-y-1">
                  {risk.sources.map((source: any, idx: number) => (
                    <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-emerald-600 hover:text-emerald-800 hover:underline">
                      <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                      <span>{source.title} ({source.organization})</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TnfdRiskPage() {
  const [companyName, setCompanyName] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"all" | "dependencies" | "impacts" | "risks" | "opportunities">("all");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/tnfd-risk/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: name }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Analysis failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: `TNFD nature-related risk assessment for ${companyName} generated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = () => {
    if (!companyName.trim()) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name to analyze.",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate(companyName.trim());
  };

  const allRisks = analysisResult?.risks || [];
  const dependencies = allRisks.filter(r => r.category.startsWith("Dependencies"));
  const impacts = allRisks.filter(r => r.category.startsWith("Impacts"));
  const risks = allRisks.filter(r => r.category.startsWith("Risks"));
  const opportunities = allRisks.filter(r => r.category.startsWith("Opportunities"));

  const displayRisks = viewMode === "dependencies" ? dependencies
    : viewMode === "impacts" ? impacts
    : viewMode === "risks" ? risks
    : viewMode === "opportunities" ? opportunities 
    : allRisks;

  const categories = Array.from(new Set(displayRisks.map(r => r.category)));
  const filteredRisks = displayRisks.filter(r => activeTab === "all" || r.category === activeTab);

  const avgOverall = allRisks.length ? (allRisks.reduce((s, r) => s + r.overallRisk, 0) / allRisks.length) : 0;
  const avgDependencies = dependencies.length ? (dependencies.reduce((s, r) => s + r.overallRisk, 0) / dependencies.length) : 0;
  const avgImpacts = impacts.length ? (impacts.reduce((s, r) => s + r.overallRisk, 0) / impacts.length) : 0;
  const avgRisks = risks.length ? (risks.reduce((s, r) => s + r.overallRisk, 0) / risks.length) : 0;
  const avgOpportunity = opportunities.length ? (opportunities.reduce((s, r) => s + r.overallRisk, 0) / opportunities.length) : 0;
  const highRiskCount = allRisks.filter(r => !r.category.startsWith("Opportunities") && r.overallRisk >= 3.5).length;
  const criticalCount = allRisks.filter(r => !r.category.startsWith("Opportunities") && r.overallRisk >= 4.5).length;

  const handleExport = () => {
    if (!analysisResult) return;
    const escapeCSV = (field: any): string => {
      if (field === null || field === undefined) return "";
      let str = String(field)
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[\u2026]/g, "...");
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const header = "TNFD Category,Specific Factor,Nature Impact Score,Likelihood Score,Vulnerability Score,Overall Score,Level,Narrative,TNFD LEAP Analysis,Sources\n";
    const rows = analysisResult.risks.map(r => {
      const sources = r.sources?.map((s: any) => `${s.title} (${s.organization})`).join('; ') || '';
      return [
        escapeCSV(r.category),
        escapeCSV(r.subcategory),
        r.impactScore,
        r.likelihoodScore,
        r.vulnerabilityScore,
        r.overallRisk.toFixed(2),
        escapeCSV(r.category.startsWith("Opportunities") ? getOpportunityLabel(r.overallRisk) : getRiskLabel(r.overallRisk)),
        escapeCSV(r.narrative),
        escapeCSV(r.reasoning),
        escapeCSV(sources)
      ].join(',');
    }).join('\n');

    const csvContent = `TNFD Nature-Related Risk Assessment - ${companyName}\nIndustry: ${analysisResult.industry}\nGenerated: ${new Date().toLocaleDateString()}\n\n${header}${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tnfd-risk-${companyName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <TreePine className="text-emerald-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">TNFD Risk Assessment</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/tnfd-education">
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn About TNFD
                </Button>
              </Link>
              {analysisResult && (
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  This tool performs a comprehensive <strong>TNFD-aligned</strong> nature-related risk and opportunity assessment 
                  using the LEAP approach (Locate, Evaluate, Assess, Prepare). It evaluates your company across nature dependencies, 
                  environmental impacts, nature-related risks, and nature-positive opportunities. Each factor is scored on 
                  impact, likelihood, and vulnerability with AI-powered analysis.
                </p>
                <div className="flex gap-4 mt-2">
                  <Link href="/tnfd-education">
                    <span className="text-sm text-emerald-700 hover:text-emerald-900 underline cursor-pointer">
                      Learn about the TNFD framework
                    </span>
                  </Link>
                  <Link href="/tcfd-risk">
                    <span className="text-sm text-blue-700 hover:text-blue-900 underline cursor-pointer">
                      Run TCFD climate risk assessment
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-600" />
              TNFD Nature-Related Risk & Opportunity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="companyName" className="mb-2 block">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name (e.g., Nestl&eacute;, Cargill, Unilever)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  disabled={analyzeMutation.isPending}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending || !companyName.trim()}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run TNFD Risk Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>

            {analyzeMutation.isPending && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing 30 nature-related factors across 10 TNFD categories using AI...
                </div>
                <Progress value={analyzeMutation.isPending ? 45 : 100} className="h-2" />
                <p className="text-xs text-gray-500">
                  This analysis covers nature dependencies (land, freshwater, ocean), environmental impacts 
                  (pollution, land use change), nature risks (ecosystem loss, regulatory, market), and 
                  nature-positive opportunities (nature-based solutions, sustainable products, finance).
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {analysisResult && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("all"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgOverall)}`}>{avgOverall.toFixed(1)}</p>
                  <Badge className={getRiskBadgeColor(avgOverall)}>{getRiskLabel(avgOverall)}</Badge>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("dependencies"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Dependencies</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgDependencies)}`}>{avgDependencies.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{dependencies.length} factors</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("impacts"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Impacts</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgImpacts)}`}>{avgImpacts.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{impacts.length} factors</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("risks"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Risks</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgRisks)}`}>{avgRisks.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{risks.length} factors</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("opportunities"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Opportunities</p>
                  <p className={`text-3xl font-bold ${getOpportunityColor(avgOpportunity)}`}>{avgOpportunity.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{opportunities.length} factors</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">High/Critical</p>
                  <p className="text-3xl font-bold text-red-600">{highRiskCount}</p>
                  <p className="text-xs text-gray-500">of {dependencies.length + impacts.length + risks.length} factors</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <Button 
                variant={viewMode === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => { setViewMode("all"); setActiveTab("all"); }}
              >
                All ({allRisks.length})
              </Button>
              <Button 
                variant={viewMode === "dependencies" ? "default" : "outline"} 
                size="sm"
                className={viewMode === "dependencies" ? "" : "border-green-300 text-green-700 hover:bg-green-50"}
                onClick={() => { setViewMode("dependencies"); setActiveTab("all"); }}
              >
                <Droplets className="w-3 h-3 mr-1" />
                Dependencies ({dependencies.length})
              </Button>
              <Button 
                variant={viewMode === "impacts" ? "default" : "outline"} 
                size="sm"
                className={viewMode === "impacts" ? "" : "border-amber-300 text-amber-700 hover:bg-amber-50"}
                onClick={() => { setViewMode("impacts"); setActiveTab("all"); }}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Impacts ({impacts.length})
              </Button>
              <Button 
                variant={viewMode === "risks" ? "default" : "outline"}
                size="sm"
                className={viewMode === "risks" ? "" : "border-red-300 text-red-700 hover:bg-red-50"}
                onClick={() => { setViewMode("risks"); setActiveTab("all"); }}
              >
                <Shield className="w-3 h-3 mr-1" />
                Risks ({risks.length})
              </Button>
              <Button 
                variant={viewMode === "opportunities" ? "default" : "outline"}
                size="sm"
                className={viewMode === "opportunities" ? "" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"}
                onClick={() => { setViewMode("opportunities"); setActiveTab("all"); }}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Opportunities ({opportunities.length})
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categories.map(cat => {
                const catRisks = displayRisks.filter(r => r.category === cat);
                const catAvg = catRisks.reduce((s, r) => s + r.overallRisk, 0) / catRisks.length;
                const isOpp = cat.startsWith("Opportunities");
                return (
                  <Card key={cat} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab(cat)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoryColors[cat] || "bg-gray-100 text-gray-800"}>{cat.replace("Dependencies - ", "").replace("Impacts - ", "").replace("Risks - ", "").replace("Opportunities - ", "")}</Badge>
                        <Badge className={isOpp ? getOpportunityBadgeColor(catAvg) : getRiskBadgeColor(catAvg)}>
                          {catAvg.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{categoryDescriptions[cat]}</p>
                      <div className="flex gap-1">
                        {catRisks.map((r, i) => (
                          <div key={i} className={`h-2 flex-1 rounded-full ${
                            isOpp 
                              ? (r.overallRisk >= 4 ? 'bg-emerald-400' : r.overallRisk >= 3 ? 'bg-teal-400' : r.overallRisk >= 2 ? 'bg-green-400' : 'bg-gray-300')
                              : (r.overallRisk >= 4 ? 'bg-red-400' : r.overallRisk >= 3 ? 'bg-orange-400' : r.overallRisk >= 2 ? 'bg-yellow-400' : 'bg-green-400')
                          }`} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap h-auto gap-1">
                <TabsTrigger value="all">All ({displayRisks.length})</TabsTrigger>
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="text-xs">
                    {cat.replace("Dependencies - ", "D: ").replace("Impacts - ", "I: ").replace("Risks - ", "R: ").replace("Opportunities - ", "O: ")} ({displayRisks.filter(r => r.category === cat).length})
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-4 space-y-3">
                {filteredRisks
                  .sort((a, b) => b.overallRisk - a.overallRisk)
                  .map((risk, idx) => (
                    <RiskCard key={`${risk.category}-${risk.subcategory}-${idx}`} risk={risk} index={idx} />
                  ))}
              </div>
            </Tabs>

            {criticalCount > 0 && (
              <Card className="mt-6 bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Critical Nature-Related Risks Identified</h4>
                      <p className="text-sm text-red-800 mt-1">
                        {criticalCount} factor{criticalCount > 1 ? 's' : ''} scored at Critical level (4.5+/5). 
                        The TNFD recommends immediate governance attention for critical nature-related risks. 
                        Consider conducting detailed LEAP assessments and developing specific nature-related 
                        risk management strategies aligned with the Kunming-Montreal Global Biodiversity Framework.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">TNFD Disclosure Guidance</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-semibold text-sm">Governance</h4>
                    </div>
                    <p className="text-xs text-gray-600">Board oversight and management's role in assessing nature-related dependencies, impacts, risks, and opportunities.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-semibold text-sm">Strategy</h4>
                    </div>
                    <p className="text-xs text-gray-600">Nature-related impacts on business model, strategy, and financial planning across short, medium, and long-term horizons.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-semibold text-sm">Risk & Impact Management</h4>
                    </div>
                    <p className="text-xs text-gray-600">Processes for identifying, assessing, prioritizing, and managing nature-related dependencies, impacts, risks, and opportunities.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-semibold text-sm">Metrics & Targets</h4>
                    </div>
                    <p className="text-xs text-gray-600">Nature-related metrics, targets, and performance indicators including biodiversity, water, land use, and ecosystem service metrics.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!analysisResult && !analyzeMutation.isPending && (
          <div className="text-center py-12">
            <TreePine className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">TNFD Nature-Related Risk Assessment</h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-4">
              Enter a company name above to generate an AI-powered TNFD-aligned nature-related risk and opportunity 
              assessment. The analysis evaluates 30 factors across 10 categories covering nature dependencies, 
              environmental impacts, nature risks, and nature-positive opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                "Dependencies - Land & Freshwater",
                "Dependencies - Ocean & Coastal",
                "Impacts - Pollution & Waste",
                "Impacts - Land Use Change",
                "Risks - Ecosystem Service Loss",
                "Risks - Regulatory & Legal",
                "Risks - Market & Reputation",
                "Opportunities - Nature-Based Solutions",
                "Opportunities - Sustainable Products",
                "Opportunities - Nature-Positive Finance"
              ].map(cat => (
                <Badge key={cat} className={`${categoryColors[cat]} text-xs`}>
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
