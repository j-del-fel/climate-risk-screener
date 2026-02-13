import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Calculator, TrendingUp, DollarSign, Thermometer, Zap, Leaf, Factory, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Assessment, RiskAssessment } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface NgfsDataPoint {
  id: string;
  scenario: string;
  model: string;
  year: number;
  temperature: number | null;
  carbonPrice: number | null;
  gdpImpact: number | null;
  energyDemand: number | null;
  renewableShare: number | null;
  fossilFuelDemand: number | null;
  co2Emissions: number | null;
  dataSource: string | null;
}

interface ScenariosResponse {
  scenarios: string[];
  labels: Record<string, string>;
  descriptions: Record<string, string>;
}

interface MetricsResponse {
  labels: Record<string, string>;
}

interface FinancialImpactResult {
  id: string;
  category: string;
  subcategory: string;
  originalScore: number;
  ngfsMultiplier: number;
  financialImpact: number;
  impactType: string;
  currency: string;
}

export default function FinancialImpactPage() {
  const [match, params] = useRoute("/financial-impact/:id?");
  const assessmentId = params?.id;
  const { toast } = useToast();
  
  // Determine if we're in standalone mode
  const isStandaloneMode = !assessmentId;
  
  const [selectedScenario, setSelectedScenario] = useState<string>("net-zero-2050");
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<number>(2030);
  const [selectedMetric, setSelectedMetric] = useState<string>("carbonPrice");
  const [results, setResults] = useState<FinancialImpactResult[]>([]);
  
  // Standalone mode parameters
  const [companyName, setCompanyName] = useState<string>("Your Organization");
  const [annualRevenue, setAnnualRevenue] = useState<number>(100000000); // $100M default
  const [carbonIntensity, setCarbonIntensity] = useState<number>(2.5); // tCO2e per $1M revenue
  const [energyIntensity, setEnergyIntensity] = useState<number>(150); // MWh per $1M revenue
  const [riskScore, setRiskScore] = useState<number>(3); // Medium risk default

  const { data: currentAssessment } = useQuery<Assessment>({
    queryKey: ["/api/assessments", assessmentId],
    enabled: !!assessmentId,
  });

  const { data: riskAssessments } = useQuery<RiskAssessment[]>({
    queryKey: ["/api/assessments", assessmentId, "risks"],
    enabled: !!assessmentId,
  });

  // Fetch NGFS data from API (Phase V)
  const { data: scenariosData } = useQuery<ScenariosResponse>({
    queryKey: ["/api/ngfs/scenarios"],
  });

  const { data: metricsData } = useQuery<MetricsResponse>({
    queryKey: ["/api/ngfs/metrics"],
  });

  const { data: ngfsData, isLoading: isLoadingNgfs } = useQuery<NgfsDataPoint[]>({
    queryKey: ["/api/ngfs/data", selectedScenario, "Average"],
    queryFn: async () => {
      const res = await fetch(`/api/ngfs/data?scenario=${selectedScenario}&model=Average`);
      return res.json();
    },
  });

  const scenarioLabels = scenariosData?.labels || {};
  const metricLabels = metricsData?.labels || {};
  const scenarioData = ngfsData || [];

  // Calculate financial impacts when parameters change
  const financialImpacts = useMemo(() => {
    if (!selectedScenario || !selectedTimeHorizon || scenarioData.length === 0) {
      return [];
    }

    // Use the API scenario data
    const timeHorizonData = scenarioData.find(d => d.year === selectedTimeHorizon);
    
    if (!timeHorizonData) {
      return [];
    }

    // Standalone mode: create synthetic financial impact calculations
    if (isStandaloneMode) {
      const impacts = [];
      
      // Carbon pricing impact
      if (selectedMetric === 'carbonPrice') {
        const carbonPrice = timeHorizonData.carbonPrice ?? 0;
        const baselinePrice = scenarioData[0]?.carbonPrice ?? 1;
        const priceDifference = carbonPrice - baselinePrice;
        const totalEmissions = (annualRevenue / 1000000) * carbonIntensity; // Total tCO2e
        const financialImpact = totalEmissions * priceDifference * riskScore / 5; // Scale by risk
        
        impacts.push({
          id: 'carbon-impact',
          category: 'transition',
          subcategory: 'Carbon Pricing',
          originalScore: riskScore,
          ngfsMultiplier: baselinePrice > 0 ? carbonPrice / baselinePrice : 1,
          financialImpact: Math.abs(financialImpact),
          impactType: 'Cost Impact',
          currency: '$/year'
        });
      }
      
      // Energy cost impact  
      if (selectedMetric === 'energyDemand') {
        const energyDemand = timeHorizonData.energyDemand ?? 0;
        const baselineEnergyDemand = scenarioData[0]?.energyDemand ?? 1;
        const demandMultiplier = baselineEnergyDemand > 0 ? energyDemand / baselineEnergyDemand : 1;
        const totalEnergy = (annualRevenue / 1000000) * energyIntensity; // Total MWh
        const energyCostIncrease = totalEnergy * 100 * (demandMultiplier - 1) * riskScore / 5; // $100/MWh assumption
        
        impacts.push({
          id: 'energy-impact',
          category: 'transition',
          subcategory: 'Energy Costs',
          originalScore: riskScore,
          ngfsMultiplier: demandMultiplier,
          financialImpact: Math.abs(energyCostIncrease),
          impactType: 'Energy Cost',
          currency: '$/year'
        });
      }
      
      // Temperature physical risk
      if (selectedMetric === 'temperature') {
        const temperature = timeHorizonData.temperature ?? 0;
        const baselineTemp = scenarioData[0]?.temperature ?? 1;
        const tempIncrease = temperature - baselineTemp;
        const physicalRiskCost = annualRevenue * 0.01 * tempIncrease * riskScore / 5; // 1% revenue risk per degree
        
        impacts.push({
          id: 'temperature-impact',
          category: 'physical',
          subcategory: 'Temperature Risk',
          originalScore: riskScore,
          ngfsMultiplier: baselineTemp > 0 ? temperature / baselineTemp : 1,
          financialImpact: Math.abs(physicalRiskCost),
          impactType: 'Physical Risk',
          currency: '$/year'
        });
      }
      
      // GDP impact
      if (selectedMetric === 'gdpImpact') {
        const gdpImpact = Math.abs(timeHorizonData.gdpImpact ?? 0);
        const economicImpact = annualRevenue * (gdpImpact / 100) * riskScore / 5;
        
        impacts.push({
          id: 'gdp-impact',
          category: 'transition',
          subcategory: 'Economic Impact',
          originalScore: riskScore,
          ngfsMultiplier: gdpImpact,
          financialImpact: Math.abs(economicImpact),
          impactType: 'Economic Impact',
          currency: '$/year'
        });
      }
      
      return impacts;
    }

    // Assessment mode: use existing risk assessments
    if (!riskAssessments) {
      return [];
    }

    return riskAssessments.map(risk => {
      let ngfsValue: number;
      let baselineValue: number;
      let impactType: string;
      let currency: string;
      
      // Get NGFS value and baseline for the selected metric
      switch (selectedMetric) {
        case 'carbonPrice':
          ngfsValue = timeHorizonData.carbonPrice ?? 0;
          baselineValue = scenarioData[0]?.carbonPrice ?? 1;
          impactType = 'Cost Impact';
          currency = '$/tCO2';
          break;
        case 'temperature':
          ngfsValue = timeHorizonData.temperature ?? 0;
          baselineValue = scenarioData[0]?.temperature ?? 1;
          impactType = 'Physical Risk';
          currency = '°C';
          break;
        case 'gdpImpact':
          ngfsValue = Math.abs(timeHorizonData.gdpImpact ?? 0);
          baselineValue = 1;
          impactType = 'Economic Impact';
          currency = '%';
          break;
        case 'energyDemand':
          ngfsValue = timeHorizonData.energyDemand ?? 0;
          baselineValue = scenarioData[0]?.energyDemand ?? 1;
          impactType = 'Energy Cost';
          currency = 'EJ/yr';
          break;
        case 'renewableShare':
          ngfsValue = timeHorizonData.renewableShare ?? 0;
          baselineValue = scenarioData[0]?.renewableShare ?? 1;
          impactType = 'Transition Opportunity';
          currency = '%';
          break;
        case 'fossilFuelDemand':
          ngfsValue = timeHorizonData.fossilFuelDemand ?? 0;
          baselineValue = scenarioData[0]?.fossilFuelDemand ?? 1;
          impactType = 'Stranded Asset Risk';
          currency = 'EJ/yr';
          break;
        case 'co2Emissions':
          ngfsValue = timeHorizonData.co2Emissions ?? 0;
          baselineValue = scenarioData[0]?.co2Emissions ?? 1;
          impactType = 'Regulatory Risk';
          currency = 'GtCO2/yr';
          break;
        default:
          ngfsValue = timeHorizonData.carbonPrice ?? 0;
          baselineValue = scenarioData[0]?.carbonPrice ?? 1;
          impactType = 'Cost Impact';
          currency = '$/tCO2';
      }

      // Calculate multiplier (ratio of future to current)
      const ngfsMultiplier = baselineValue > 0 ? ngfsValue / baselineValue : ngfsValue;
      
      // Get average score from impact, likelihood, and vulnerability (only average available scores)
      const impactScore = risk.impactScore || 0;
      const likelihoodScore = risk.likelihoodScore || 0;
      const vulnerabilityScore = (risk as any).vulnerabilityScore || 0;
      
      // Only average scores that are actually present (> 0)
      const scores = [impactScore, likelihoodScore, vulnerabilityScore].filter(score => score > 0);
      const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
      
      // Calculate financial impact (normalized to percentage)
      const financialImpact = averageScore * ngfsMultiplier * 10; // Scale factor for visibility
      
      return {
        id: risk.id,
        category: risk.category,
        subcategory: risk.subcategory,
        originalScore: averageScore,
        ngfsMultiplier,
        financialImpact,
        impactType,
        currency
      };
    });
  }, [riskAssessments, selectedScenario, selectedTimeHorizon, selectedMetric, isStandaloneMode, annualRevenue, carbonIntensity, energyIntensity, riskScore]);

  const handleExport = () => {
    if (!financialImpacts.length) {
      toast({
        title: "Export Failed",
        description: "No financial impact data available to export.",
        variant: "destructive",
      });
      return;
    }

    // Helper function to escape CSV fields and clean up Unicode characters (reused from assessment.tsx)
    const escapeCSV = (field: any): string => {
      if (field === null || field === undefined) return "";
      let str = String(field);
      
      // Replace problematic Unicode characters with their ASCII equivalents
      str = str
        .replace(/[\u2018\u2019]/g, "'")  // Smart single quotes
        .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes
        .replace(/[\u2013\u2014]/g, "-")  // Em-dash and en-dash
        .replace(/[\u2026]/g, "...")      // Ellipsis
        .replace(/[\u00A0]/g, " ")       // Non-breaking space
        .replace(/[^\x00-\x7F]/g, "");   // Remove any remaining non-ASCII characters
      
      // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const csvData = [
      ["Company Name", "Scenario", "Time Horizon", "Metric", "Category", "Subcategory", "Original Score (1-5)", "NGFS Multiplier", "Financial Impact", "Impact Type", "Currency"],
      ...financialImpacts.map(result => [
        escapeCSV(currentAssessment?.companyName || ""),
        escapeCSV(scenarioLabels[selectedScenario]),
        escapeCSV(selectedTimeHorizon.toString()),
        escapeCSV(selectedMetric),
        escapeCSV(result.category),
        escapeCSV(result.subcategory),
        escapeCSV(result.originalScore.toFixed(2)),
        escapeCSV(result.ngfsMultiplier.toFixed(2)),
        escapeCSV(result.financialImpact.toFixed(2)),
        escapeCSV(result.impactType),
        escapeCSV(result.currency)
      ])
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    // Add UTF-8 BOM to ensure Excel recognizes the encoding properly
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-impact-analysis-${currentAssessment?.companyName || 'assessment'}-${selectedScenario}-${selectedTimeHorizon}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Financial impact analysis has been downloaded as properly formatted CSV file.",
    });
  };

  // Prepare chart data
  const chartData = financialImpacts.map(impact => ({
    name: `${impact.category}/${impact.subcategory}`,
    originalScore: impact.originalScore,
    financialImpact: impact.financialImpact,
    category: impact.category
  }));

  // Only check for assessment data if not in standalone mode
  if (!isStandaloneMode) {
    if (!currentAssessment || !riskAssessments) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900">
              {!currentAssessment && !riskAssessments ? "Loading assessment data..." : "No Risk Assessment Data"}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {!currentAssessment && !riskAssessments 
                ? "Please wait while we retrieve your climate risk assessment."
                : "This assessment doesn't have completed risk analysis data. Please complete the climate risk assessment first."
              }
            </div>
            {(!currentAssessment || !riskAssessments) && (
              <Link href={`/assessment/${assessmentId}`} className="mt-4 inline-block">
                <Button variant="outline">Return to Assessment</Button>
              </Link>
            )}
          </div>
        </div>
      );
    }

    if (!riskAssessments.length) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900">No Risk Assessment Data</div>
            <div className="text-sm text-gray-500 mt-2">
              This assessment doesn't have any risk analysis results. Please complete the climate risk assessment first.
            </div>
            <Link href={`/assessment/${assessmentId}`} className="mt-4 inline-block">
              <Button variant="outline">Return to Assessment</Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {isStandaloneMode ? (
                <Link href="/">
                  <Button variant="ghost" size="sm" data-testid="button-back-dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href={`/assessment/${assessmentId}`}>
                  <Button variant="ghost" size="sm" data-testid="button-back-assessment">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Assessment
                  </Button>
                </Link>
              )}
              <div className="h-6 border-l border-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                {isStandaloneMode ? "Standalone Financial Impact Analysis" : "Financial Impact Analysis"}
              </h1>
            </div>
            <Button onClick={handleExport} variant="outline" disabled={!financialImpacts.length} data-testid="button-export-financial-impact">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Financial Impact Analysis for {isStandaloneMode ? companyName : currentAssessment?.companyName}
          </h2>
          <p className="text-gray-600 max-w-4xl">
            {isStandaloneMode 
              ? "Calculate potential financial impacts from climate change using NGFS climate scenario data. Input your organization's parameters to quantify climate-related financial risks and opportunities."
              : "Transform your climate risk screening scores into quantified financial impacts using NGFS climate scenario data. Select different scenarios and time horizons to understand potential financial implications."
            }
          </p>
        </div>

        {/* Standalone Mode Parameters */}
        {isStandaloneMode && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Organization Name</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Organization"
                    data-testid="input-company-name"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Annual Revenue ($)</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="number"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100000000"
                    data-testid="input-annual-revenue"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current: ${(annualRevenue / 1000000).toFixed(0)}M</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Carbon Intensity</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="number"
                    step="0.1"
                    value={carbonIntensity}
                    onChange={(e) => setCarbonIntensity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2.5"
                    data-testid="input-carbon-intensity"
                  />
                  <p className="text-xs text-gray-500 mt-1">tCO2e per $1M revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Energy Intensity</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="number"
                    value={energyIntensity}
                    onChange={(e) => setEnergyIntensity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                    data-testid="input-energy-intensity"
                  />
                  <p className="text-xs text-gray-500 mt-1">MWh per $1M revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Climate Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={riskScore}
                    onChange={(e) => setRiskScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3"
                    data-testid="input-risk-score"
                  />
                  <p className="text-xs text-gray-500 mt-1">Overall risk level (1-5 scale)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">NGFS Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger data-testid="select-financial-scenario">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(scenarioLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Horizon</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTimeHorizon.toString()} onValueChange={(value) => setSelectedTimeHorizon(Number(value))}>
                <SelectTrigger data-testid="select-time-horizon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025 (Short-term)</SelectItem>
                  <SelectItem value="2030">2030 (Medium-term)</SelectItem>
                  <SelectItem value="2040">2040 (Long-term)</SelectItem>
                  <SelectItem value="2050">2050 (Very Long-term)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">NGFS Metric</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger data-testid="select-financial-metric">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carbonPrice">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Carbon Price Impact
                    </div>
                  </SelectItem>
                  <SelectItem value="temperature">
                    <div className="flex items-center">
                      <Thermometer className="w-4 h-4 mr-2" />
                      Temperature Risk
                    </div>
                  </SelectItem>
                  <SelectItem value="gdpImpact">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      GDP Impact
                    </div>
                  </SelectItem>
                  <SelectItem value="energyDemand">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Energy Demand
                    </div>
                  </SelectItem>
                  <SelectItem value="renewableShare">
                    <div className="flex items-center">
                      <Leaf className="w-4 h-4 mr-2" />
                      Renewable Share
                    </div>
                  </SelectItem>
                  <SelectItem value="fossilFuelDemand">
                    <div className="flex items-center">
                      <Factory className="w-4 h-4 mr-2" />
                      Fossil Fuel Demand
                    </div>
                  </SelectItem>
                  <SelectItem value="co2Emissions">
                    <div className="flex items-center">
                      <Factory className="w-4 h-4 mr-2" />
                      CO2 Emissions
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Results Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Financial Impact Visualization - {scenarioLabels[selectedScenario]} ({selectedTimeHorizon})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'originalScore' ? value.toFixed(2) : value.toFixed(2), 
                      name === 'originalScore' ? 'Original Risk Score' : 'Financial Impact'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="originalScore" fill="#8884d8" name="Original Risk Score (1-5)" />
                  <Bar dataKey="financialImpact" fill="#82ca9d" name="Financial Impact (Scaled)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Risk Items</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-total-items">
                    {financialImpacts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Financial Impact</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-avg-impact">
                    {financialImpacts.length > 0 
                      ? (financialImpacts.reduce((sum, item) => sum + item.financialImpact, 0) / financialImpacts.length).toFixed(1)
                      : "0"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Highest Impact</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-max-impact">
                    {financialImpacts.length > 0 
                      ? Math.max(...financialImpacts.map(item => item.financialImpact)).toFixed(1)
                      : "0"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">NGFS Multiplier</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-ngfs-multiplier">
                    {financialImpacts.length > 0 
                      ? (financialImpacts.reduce((sum, item) => sum + item.ngfsMultiplier, 0) / financialImpacts.length).toFixed(2)
                      : "0"
                    }x
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Detailed Financial Impact Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NGFS Multiplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Financial Impact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impact Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialImpacts.map((impact, index) => (
                    <tr key={impact.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {impact.category}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {impact.subcategory.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">
                          {impact.originalScore.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {impact.ngfsMultiplier.toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          impact.financialImpact > 20 ? 'text-red-600' : 
                          impact.financialImpact > 10 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {impact.financialImpact.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {impact.impactType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Methodology */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Calculation Methodology</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>
                    <strong>Financial Impact = (Average Risk Score) × (NGFS Multiplier) × (Scale Factor)</strong>
                  </p>
                  <div className="mt-3 space-y-1">
                    <p>• <strong>Average Risk Score:</strong> Mean of Impact, Likelihood, and Vulnerability scores (1-5 scale)</p>
                    <p>• <strong>NGFS Multiplier:</strong> Ratio of future scenario value to current baseline (e.g., {selectedTimeHorizon} carbon price / 2020 carbon price)</p>
                    <p>• <strong>Scale Factor:</strong> Applied for visualization purposes (×10)</p>
                  </div>
                  <p className="mt-3 text-xs text-blue-600">
                    Note: This is a simplified model for demonstration. Real financial impact assessments should include detailed economic modeling, 
                    industry-specific factors, and company-specific financial data.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}