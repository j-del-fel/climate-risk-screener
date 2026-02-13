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
import { ArrowLeft, Shield, Play, Loader2, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Download, BookOpen, Info, TrendingUp, Zap, Globe, Building2 } from "lucide-react";

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

interface TcfdRisk {
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
  risks: TcfdRisk[];
  industry: string;
  message: string;
}

const categoryColors: Record<string, string> = {
  "Transition Risk - Policy & Legal": "bg-blue-100 text-blue-800 border-blue-300",
  "Transition Risk - Technology": "bg-violet-100 text-violet-800 border-violet-300",
  "Transition Risk - Market": "bg-amber-100 text-amber-800 border-amber-300",
  "Transition Risk - Reputation": "bg-rose-100 text-rose-800 border-rose-300",
  "Physical Risk - Acute": "bg-red-100 text-red-800 border-red-300",
  "Physical Risk - Chronic": "bg-orange-100 text-orange-800 border-orange-300",
  "Opportunity - Resource Efficiency": "bg-green-100 text-green-800 border-green-300",
  "Opportunity - Energy Source": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Opportunity - Products & Services": "bg-teal-100 text-teal-800 border-teal-300",
  "Opportunity - Markets & Resilience": "bg-cyan-100 text-cyan-800 border-cyan-300"
};

const categoryDescriptions: Record<string, string> = {
  "Transition Risk - Policy & Legal": "Risks from carbon pricing, emissions regulations, mandated reporting, and climate-related litigation.",
  "Transition Risk - Technology": "Risks from clean technology disruption, asset obsolescence, and the cost of adopting new technologies.",
  "Transition Risk - Market": "Risks from shifting consumer preferences, raw material cost volatility, and market signal uncertainty.",
  "Transition Risk - Reputation": "Risks from stakeholder scrutiny, greenwashing claims, and loss of social license to operate.",
  "Physical Risk - Acute": "Risks from extreme weather events including storms, floods, wildfires, and heatwaves.",
  "Physical Risk - Chronic": "Risks from long-term climate shifts including sea level rise, temperature increases, and water stress.",
  "Opportunity - Resource Efficiency": "Opportunities from energy, water, and material efficiency improvements reducing costs.",
  "Opportunity - Energy Source": "Opportunities from transitioning to renewable energy and alternative fuels.",
  "Opportunity - Products & Services": "Opportunities from developing low-carbon products, services, and climate solutions.",
  "Opportunity - Markets & Resilience": "Opportunities from accessing new markets and building climate-resilient operations."
};

const categoryIcons: Record<string, string> = {
  "Transition Risk - Policy & Legal": "policy",
  "Transition Risk - Technology": "technology",
  "Transition Risk - Market": "market",
  "Transition Risk - Reputation": "reputation",
  "Physical Risk - Acute": "acute",
  "Physical Risk - Chronic": "chronic",
  "Opportunity - Resource Efficiency": "efficiency",
  "Opportunity - Energy Source": "energy",
  "Opportunity - Products & Services": "products",
  "Opportunity - Markets & Resilience": "resilience"
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
  if (score >= 4) return "text-green-600";
  if (score >= 3) return "text-teal-600";
  if (score >= 2) return "text-blue-600";
  return "text-gray-600";
}

function getOpportunityBadgeColor(score: number): string {
  if (score >= 4) return "bg-green-100 text-green-800 border-green-300";
  if (score >= 3) return "bg-teal-100 text-teal-800 border-teal-300";
  if (score >= 2) return "bg-blue-100 text-blue-800 border-blue-300";
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
    ? (score >= 4 ? "bg-green-500" : score >= 3 ? "bg-teal-500" : score >= 2 ? "bg-blue-500" : "bg-gray-400")
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

function RiskCard({ risk, index }: { risk: TcfdRisk; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isOpportunity = risk.category.startsWith("Opportunity");

  return (
    <Card className="border-l-4" style={{ 
      borderLeftColor: isOpportunity 
        ? (risk.overallRisk >= 4 ? '#22c55e' : risk.overallRisk >= 3 ? '#14b8a6' : risk.overallRisk >= 2 ? '#3b82f6' : '#9ca3af')
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
          <ScoreBar score={risk.impactScore} label={isOpportunity ? "Value Potential" : "Impact"} isOpportunity={isOpportunity} />
          <ScoreBar score={risk.likelihoodScore} label={isOpportunity ? "Feasibility" : "Likelihood"} isOpportunity={isOpportunity} />
          <ScoreBar score={risk.vulnerabilityScore} label={isOpportunity ? "Readiness" : "Vulnerability"} isOpportunity={isOpportunity} />
        </div>

        <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
          {expanded ? "Show Less" : "Detailed TCFD Analysis & Sources"}
        </Button>

        {expanded && (
          <div className="mt-3 space-y-4 border-t pt-3">
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-1">TCFD-Aligned Analysis</h5>
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
                    <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline">
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

export default function TcfdRiskPage() {
  const [companyName, setCompanyName] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"all" | "risks" | "opportunities">("all");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/tcfd-risk/analyze", {
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
        description: `TCFD risk assessment for ${companyName} generated successfully.`,
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
  const transitionRisks = allRisks.filter(r => r.category.startsWith("Transition Risk"));
  const physicalRisks = allRisks.filter(r => r.category.startsWith("Physical Risk"));
  const opportunities = allRisks.filter(r => r.category.startsWith("Opportunity"));

  const displayRisks = viewMode === "risks" ? [...transitionRisks, ...physicalRisks] 
    : viewMode === "opportunities" ? opportunities 
    : allRisks;

  const categories = Array.from(new Set(displayRisks.map(r => r.category)));
  const filteredRisks = displayRisks.filter(r => activeTab === "all" || r.category === activeTab);

  const avgOverall = allRisks.length ? (allRisks.reduce((s, r) => s + r.overallRisk, 0) / allRisks.length) : 0;
  const avgTransition = transitionRisks.length ? (transitionRisks.reduce((s, r) => s + r.overallRisk, 0) / transitionRisks.length) : 0;
  const avgPhysical = physicalRisks.length ? (physicalRisks.reduce((s, r) => s + r.overallRisk, 0) / physicalRisks.length) : 0;
  const avgOpportunity = opportunities.length ? (opportunities.reduce((s, r) => s + r.overallRisk, 0) / opportunities.length) : 0;
  const highRiskCount = allRisks.filter(r => !r.category.startsWith("Opportunity") && r.overallRisk >= 3.5).length;
  const criticalCount = allRisks.filter(r => !r.category.startsWith("Opportunity") && r.overallRisk >= 4.5).length;

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

    const header = "TCFD Category,Specific Risk/Opportunity,Impact Score,Likelihood Score,Vulnerability Score,Overall Score,Level,Narrative,TCFD Analysis,Sources\n";
    const rows = analysisResult.risks.map(r => {
      const sources = r.sources?.map((s: any) => `${s.title} (${s.organization})`).join('; ') || '';
      return [
        escapeCSV(r.category),
        escapeCSV(r.subcategory),
        r.impactScore,
        r.likelihoodScore,
        r.vulnerabilityScore,
        r.overallRisk.toFixed(2),
        escapeCSV(r.category.startsWith("Opportunity") ? getOpportunityLabel(r.overallRisk) : getRiskLabel(r.overallRisk)),
        escapeCSV(r.narrative),
        escapeCSV(r.reasoning),
        escapeCSV(sources)
      ].join(',');
    }).join('\n');

    const csvContent = `TCFD Risk Assessment - ${companyName}\nIndustry: ${analysisResult.industry}\nGenerated: ${new Date().toLocaleDateString()}\n\n${header}${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tcfd-risk-${companyName.replace(/\s+/g, '-').toLowerCase()}.csv`;
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
                <Shield className="text-blue-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">TCFD Risk Assessment</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/learn">
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn About TCFD
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

        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  This tool performs a comprehensive <strong>TCFD-aligned</strong> climate risk and opportunity assessment. 
                  It evaluates your company across all TCFD categories: transition risks (policy, technology, market, reputation), 
                  physical risks (acute, chronic), and climate opportunities (resource efficiency, energy, products, markets). 
                  Each factor is scored on impact, likelihood, and vulnerability with AI-powered analysis.
                </p>
                <div className="flex gap-4 mt-2">
                  <Link href="/learn">
                    <span className="text-sm text-blue-700 hover:text-blue-900 underline cursor-pointer">
                      Learn about the TCFD framework
                    </span>
                  </Link>
                  <Link href="/tnfd-education">
                    <span className="text-sm text-teal-700 hover:text-teal-900 underline cursor-pointer">
                      Explore the TNFD framework
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
              <Shield className="w-5 h-5 text-blue-600" />
              TCFD Climate Risk & Opportunity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="companyName" className="mb-2 block">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name (e.g., Shell, Toyota, BlackRock)"
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
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run TCFD Risk Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>

            {analyzeMutation.isPending && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing 30 risk and opportunity factors across 10 TCFD categories using AI...
                </div>
                <Progress value={analyzeMutation.isPending ? 45 : 100} className="h-2" />
                <p className="text-xs text-gray-500">
                  This analysis covers transition risks (policy & legal, technology, market, reputation), 
                  physical risks (acute, chronic), and climate opportunities (resource efficiency, energy source, 
                  products & services, markets & resilience).
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {analysisResult && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("all"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgOverall)}`}>{avgOverall.toFixed(1)}</p>
                  <Badge className={getRiskBadgeColor(avgOverall)}>{getRiskLabel(avgOverall)}</Badge>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("risks"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Transition Risks</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgTransition)}`}>{avgTransition.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{transitionRisks.length} factors</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewMode("risks"); setActiveTab("all"); }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Physical Risks</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgPhysical)}`}>{avgPhysical.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{physicalRisks.length} factors</p>
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
                  <p className="text-sm text-gray-500">High/Critical Risks</p>
                  <p className="text-3xl font-bold text-red-600">{highRiskCount}</p>
                  <p className="text-xs text-gray-500">of {transitionRisks.length + physicalRisks.length} risk factors</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2 mb-4">
              <Button 
                variant={viewMode === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => { setViewMode("all"); setActiveTab("all"); }}
              >
                All ({allRisks.length})
              </Button>
              <Button 
                variant={viewMode === "risks" ? "default" : "outline"} 
                size="sm"
                className={viewMode === "risks" ? "" : "border-red-300 text-red-700 hover:bg-red-50"}
                onClick={() => { setViewMode("risks"); setActiveTab("all"); }}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Risks ({transitionRisks.length + physicalRisks.length})
              </Button>
              <Button 
                variant={viewMode === "opportunities" ? "default" : "outline"}
                size="sm"
                className={viewMode === "opportunities" ? "" : "border-green-300 text-green-700 hover:bg-green-50"}
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
                const isOpp = cat.startsWith("Opportunity");
                return (
                  <Card key={cat} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab(cat)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoryColors[cat] || "bg-gray-100 text-gray-800"} >{cat.replace("Transition Risk - ", "").replace("Physical Risk - ", "").replace("Opportunity - ", "")}</Badge>
                        <Badge className={isOpp ? getOpportunityBadgeColor(catAvg) : getRiskBadgeColor(catAvg)}>
                          {catAvg.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{categoryDescriptions[cat]}</p>
                      <div className="flex gap-1">
                        {catRisks.map((r, i) => (
                          <div key={i} className={`h-2 flex-1 rounded-full ${
                            isOpp 
                              ? (r.overallRisk >= 4 ? 'bg-green-400' : r.overallRisk >= 3 ? 'bg-teal-400' : r.overallRisk >= 2 ? 'bg-blue-400' : 'bg-gray-300')
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
                    {cat.replace("Transition Risk - ", "TR: ").replace("Physical Risk - ", "PR: ").replace("Opportunity - ", "O: ")} ({displayRisks.filter(r => r.category === cat).length})
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
                      <h4 className="font-semibold text-red-900">Critical Climate Risks Identified</h4>
                      <p className="text-sm text-red-800 mt-1">
                        {criticalCount} risk factor{criticalCount > 1 ? 's' : ''} scored at Critical level (4.5+/5). 
                        The TCFD recommends immediate board-level governance attention for critical climate risks. 
                        Consider conducting detailed scenario analysis and developing specific risk management strategies 
                        for these areas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">TCFD Disclosure Guidance</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-sm">Governance</h4>
                    </div>
                    <p className="text-xs text-gray-600">Board oversight and management's role in assessing climate risks and opportunities.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-sm">Strategy</h4>
                    </div>
                    <p className="text-xs text-gray-600">Impact on business strategy, financial planning, and scenario analysis results.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-sm">Risk Management</h4>
                    </div>
                    <p className="text-xs text-gray-600">Processes for identifying, assessing, and managing climate-related risks.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-sm">Metrics & Targets</h4>
                    </div>
                    <p className="text-xs text-gray-600">Scope 1, 2, 3 emissions, climate targets, and performance tracking metrics.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!analysisResult && !analyzeMutation.isPending && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">TCFD Climate Risk Assessment</h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-4">
              Enter a company name above to generate an AI-powered TCFD-aligned risk and opportunity assessment. 
              The analysis evaluates 30 factors across 10 categories covering transition risks, physical risks, 
              and climate opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                "Transition Risk - Policy & Legal",
                "Transition Risk - Technology", 
                "Transition Risk - Market",
                "Transition Risk - Reputation",
                "Physical Risk - Acute",
                "Physical Risk - Chronic",
                "Opportunity - Resource Efficiency",
                "Opportunity - Energy Source",
                "Opportunity - Products & Services",
                "Opportunity - Markets & Resilience"
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