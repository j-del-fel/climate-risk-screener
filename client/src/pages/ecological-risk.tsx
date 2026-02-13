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
import { ArrowLeft, TreePine, Play, Loader2, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Download, BookOpen, Info } from "lucide-react";

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

interface EcologicalRisk {
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
  risks: EcologicalRisk[];
  industry: string;
  message: string;
}

const categoryColors: Record<string, string> = {
  "Natural Capital Depletion": "bg-amber-100 text-amber-800 border-amber-300",
  "Ecosystem Services Disruption": "bg-green-100 text-green-800 border-green-300",
  "Planetary Boundary Transgression": "bg-red-100 text-red-800 border-red-300",
  "Throughput & Material Limits": "bg-blue-100 text-blue-800 border-blue-300",
  "Biodiversity & Habitat Loss": "bg-purple-100 text-purple-800 border-purple-300",
  "Circular Economy Transition": "bg-teal-100 text-teal-800 border-teal-300"
};

const categoryDescriptions: Record<string, string> = {
  "Natural Capital Depletion": "Risks from depletion of natural resource stocks that the business depends on, including minerals, soil, water, and biological resources.",
  "Ecosystem Services Disruption": "Risks from degradation of services nature provides for free - pollination, water purification, flood protection, climate regulation.",
  "Planetary Boundary Transgression": "Risks arising from humanity exceeding the safe operating space defined by the 9 planetary boundaries.",
  "Throughput & Material Limits": "Risks from thermodynamic limits on material/energy throughput and dependency on linear production models.",
  "Biodiversity & Habitat Loss": "Risks from species extinction, habitat destruction, and ecosystem collapse affecting supply chains and operations.",
  "Circular Economy Transition": "Risks from regulatory and market shifts toward circular economy models requiring fundamental business model changes."
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

function ScoreBar({ score, label }: { score: number; label: string }) {
  const percentage = (score / 5) * 100;
  const color = score >= 4 ? "bg-red-500" : score >= 3 ? "bg-orange-500" : score >= 2 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${getRiskColor(score)}`}>{score}/5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function RiskCard({ risk, index }: { risk: EcologicalRisk; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-l-4" style={{ borderLeftColor: risk.overallRisk >= 4 ? '#ef4444' : risk.overallRisk >= 3 ? '#f97316' : risk.overallRisk >= 2 ? '#eab308' : '#22c55e' }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={categoryColors[risk.category] || "bg-gray-100 text-gray-800"}>
                {risk.category}
              </Badge>
              <Badge className={getRiskBadgeColor(risk.overallRisk)}>
                {getRiskLabel(risk.overallRisk)} ({risk.overallRisk.toFixed(1)})
              </Badge>
            </div>
            <h4 className="font-semibold text-gray-900 mt-1">{risk.subcategory}</h4>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">{risk.narrative}</p>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <ScoreBar score={risk.impactScore} label="Impact" />
          <ScoreBar score={risk.likelihoodScore} label="Likelihood" />
          <ScoreBar score={risk.vulnerabilityScore} label="Vulnerability" />
        </div>

        <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
          {expanded ? "Show Less" : "Detailed Analysis & Sources"}
        </Button>

        {expanded && (
          <div className="mt-3 space-y-4 border-t pt-3">
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-1">Ecological Economics Analysis</h5>
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
                        <p className="text-xs text-gray-500">Impact Rank</p>
                        <p className="font-semibold text-sm">{risk.peerComparison.rankings.impact}/6</p>
                      </div>
                    )}
                    {risk.peerComparison.rankings.likelihood && (
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Likelihood Rank</p>
                        <p className="font-semibold text-sm">{risk.peerComparison.rankings.likelihood}/6</p>
                      </div>
                    )}
                    {risk.peerComparison.rankings.vulnerability && (
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Vulnerability Rank</p>
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

export default function EcologicalRiskPage() {
  const [companyName, setCompanyName] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/ecological-risk/analyze", {
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
        description: `Ecological risk assessment for ${companyName} generated successfully.`,
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

  const categories = analysisResult ? Array.from(new Set(analysisResult.risks.map(r => r.category))) : [];
  const filteredRisks = analysisResult?.risks.filter(r => activeTab === "all" || r.category === activeTab) || [];

  const avgOverall = analysisResult ? (analysisResult.risks.reduce((s, r) => s + r.overallRisk, 0) / analysisResult.risks.length) : 0;
  const avgImpact = analysisResult ? (analysisResult.risks.reduce((s, r) => s + r.impactScore, 0) / analysisResult.risks.length) : 0;
  const avgLikelihood = analysisResult ? (analysisResult.risks.reduce((s, r) => s + r.likelihoodScore, 0) / analysisResult.risks.length) : 0;
  const avgVulnerability = analysisResult ? (analysisResult.risks.reduce((s, r) => s + r.vulnerabilityScore, 0) / analysisResult.risks.length) : 0;
  const highRiskCount = analysisResult ? analysisResult.risks.filter(r => r.overallRisk >= 3.5).length : 0;
  const criticalCount = analysisResult ? analysisResult.risks.filter(r => r.overallRisk >= 4.5).length : 0;

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

    const header = "Category,Subcategory,Impact Score,Likelihood Score,Vulnerability Score,Overall Risk,Risk Level,Narrative,Reasoning,Sources\n";
    const rows = analysisResult.risks.map(r => {
      const sources = r.sources?.map((s: any) => `${s.title} (${s.organization})`).join('; ') || '';
      return [
        escapeCSV(r.category),
        escapeCSV(r.subcategory),
        r.impactScore,
        r.likelihoodScore,
        r.vulnerabilityScore,
        r.overallRisk.toFixed(2),
        escapeCSV(getRiskLabel(r.overallRisk)),
        escapeCSV(r.narrative),
        escapeCSV(r.reasoning),
        escapeCSV(sources)
      ].join(',');
    }).join('\n');

    const csvContent = `Ecological Risk Assessment - ${companyName}\nIndustry: ${analysisResult.industry}\nGenerated: ${new Date().toLocaleDateString()}\n\n${header}${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecological-risk-${companyName.replace(/\s+/g, '-').toLowerCase()}.csv`;
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
                <TreePine className="text-green-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">Ecological Risk Assessment</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/ecological-economics">
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn About Ecological Economics
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

        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  This assessment uses <strong>ecological economics</strong> as its foundation - analyzing risks through 
                  planetary boundaries, natural capital dependency, ecosystem services, and throughput limits. Unlike conventional 
                  climate transition risk assessments, this framework recognizes that natural capital cannot be substituted by 
                  manufactured capital and that the economy operates within biophysical limits.
                </p>
                <Link href="/ecological-economics">
                  <span className="text-sm text-green-700 hover:text-green-900 underline cursor-pointer">
                    Learn more about ecological economics concepts
                  </span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Ecological Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="companyName" className="mb-2 block">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name (e.g., Nestle, Rio Tinto, Amazon)"
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
                  className="bg-green-700 hover:bg-green-800"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Ecological Risk Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>

            {analyzeMutation.isPending && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing 18 ecological risk factors across 6 categories using AI...
                </div>
                <Progress value={analyzeMutation.isPending ? 45 : 100} className="h-2" />
                <p className="text-xs text-gray-500">
                  This analysis evaluates natural capital dependency, ecosystem service exposure, planetary boundary 
                  proximity, throughput constraints, biodiversity risks, and circular economy readiness.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {analysisResult && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Overall Ecological Risk</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgOverall)}`}>{avgOverall.toFixed(1)}</p>
                  <Badge className={getRiskBadgeColor(avgOverall)}>{getRiskLabel(avgOverall)}</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">High/Critical Risks</p>
                  <p className="text-3xl font-bold text-red-600">{highRiskCount}</p>
                  <p className="text-xs text-gray-500">of {analysisResult.risks.length} total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Avg Impact</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgImpact)}`}>{avgImpact.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">out of 5.0</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Avg Vulnerability</p>
                  <p className={`text-3xl font-bold ${getRiskColor(avgVulnerability)}`}>{avgVulnerability.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">out of 5.0</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {categories.map(cat => {
                const catRisks = analysisResult.risks.filter(r => r.category === cat);
                const catAvg = catRisks.reduce((s, r) => s + r.overallRisk, 0) / catRisks.length;
                return (
                  <Card key={cat} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab(cat)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoryColors[cat] || "bg-gray-100 text-gray-800"}>{cat}</Badge>
                        <Badge className={getRiskBadgeColor(catAvg)}>{catAvg.toFixed(1)}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{categoryDescriptions[cat]}</p>
                      <div className="mt-2 flex gap-1">
                        {catRisks.map((r, i) => (
                          <div key={i} className={`h-2 flex-1 rounded-full ${r.overallRisk >= 4 ? 'bg-red-400' : r.overallRisk >= 3 ? 'bg-orange-400' : r.overallRisk >= 2 ? 'bg-yellow-400' : 'bg-green-400'}`} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap h-auto gap-1">
                <TabsTrigger value="all">All Risks ({analysisResult.risks.length})</TabsTrigger>
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="text-xs">
                    {cat} ({analysisResult.risks.filter(r => r.category === cat).length})
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
                      <h4 className="font-semibold text-red-900">Critical Ecological Risks Identified</h4>
                      <p className="text-sm text-red-800 mt-1">
                        {criticalCount} risk factor{criticalCount > 1 ? 's' : ''} scored at Critical level (4.5+/5). 
                        These represent ecological risks that conventional financial analysis likely underestimates. 
                        Consider engaging with TNFD disclosure frameworks and conducting detailed natural capital assessments 
                        for these areas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!analysisResult && !analyzeMutation.isPending && (
          <div className="text-center py-12">
            <TreePine className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ecological Risk Assessment</h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-4">
              Enter a company name above to generate an AI-powered ecological risk assessment. 
              The analysis evaluates 18 risk factors across 6 ecological economics categories: 
              natural capital depletion, ecosystem services disruption, planetary boundary transgression, 
              throughput limits, biodiversity loss, and circular economy transition.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {Object.keys(categoryColors).map(cat => (
                <Badge key={cat} className={`${categoryColors[cat]} text-xs py-1`}>{cat}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}