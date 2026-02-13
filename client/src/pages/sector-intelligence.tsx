import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Factory, 
  Zap, 
  Leaf, 
  Cpu, 
  Utensils,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  GitBranch,
  Target,
  Database,
  Loader2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EconomicDataPoint {
  date: string;
  value: number | null;
  source: string;
  seriesId: string;
  seriesName: string;
  units?: string;
  frequency?: string;
}
const SECTOR_ICONS: Record<string, any> = {
  energy: Zap,
  manufacturing: Factory,
  agriculture: Leaf,
  technology: Cpu,
  food_beverage: Utensils
};

const SECTOR_COLORS: Record<string, string> = {
  energy: "bg-amber-500",
  manufacturing: "bg-blue-500",
  agriculture: "bg-green-500",
  technology: "bg-purple-500",
  food_beverage: "bg-orange-500"
};

interface SectorProfileData {
  id: string;
  sectorCode: string;
  sectorName: string;
  description: string | null;
  naicsCodeRange: string | null;
  gdpContributionPercent: number | null;
  employmentPercent: number | null;
  valueAddedBillions: number | null;
  averageRevenueGrowth: number | null;
  annualEmissionsMtCo2: number | null;
  emissionsIntensity: number | null;
  emissionsTrend: string | null;
  primaryEmissionSources: string[] | null;
  transitionRiskLevel: string | null;
  keyRisks: string[] | null;
  keyOpportunities: string[] | null;
}

interface EmissionsHistoryData {
  id: string;
  sectorCode: string;
  year: number;
  emissionsMtCo2: number | null;
}

interface ScenarioImpactData {
  id: string;
  sectorCode: string;
  scenarioName: string;
  year: number;
  gdpImpactPercent: number | null;
  carbonPriceUsd: number | null;
  investmentRequiredBillions: number | null;
  strandedAssetRiskPercent: number | null;
  transitionScore: number | null;
  adaptationNeeds: string[] | null;
}

interface InputOutputData {
  id: string;
  fromSectorCode: string;
  toSectorCode: string;
  flowValueBillions: number | null;
  flowPercent: number | null;
  relationshipType: string | null;
}

interface ComprehensiveSectorData {
  profile: SectorProfileData;
  emissionsHistory: EmissionsHistoryData[];
  scenarioImpacts: ScenarioImpactData[];
  inputOutput: InputOutputData[];
}

export default function SectorIntelligencePage() {
  const [selectedSector, setSelectedSector] = useState<string>("energy");

  const { data: sectors, isLoading: sectorsLoading } = useQuery<SectorProfileData[]>({
    queryKey: ["/api/sectors"],
  });

  const { data: sectorData, isLoading: sectorDataLoading } = useQuery<ComprehensiveSectorData>({
    queryKey: ["/api/sectors", selectedSector, "comprehensive"],
    enabled: !!selectedSector,
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransitionRiskBadge = (risk: string) => {
    switch (risk) {
      case "very_high":
        return <Badge variant="destructive">Very High</Badge>;
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "moderate":
        return <Badge className="bg-yellow-500">Moderate</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const formatCurrency = (billions: number) => {
    if (billions >= 1000) {
      return `$${(billions / 1000).toFixed(1)}T`;
    }
    return `$${billions.toFixed(0)}B`;
  };

  if (sectorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sector intelligence...</p>
        </div>
      </div>
    );
  }

  const SectorIcon = SECTOR_ICONS[selectedSector] || Factory;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sector Intelligence
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real economic and emissions data from Climate TRACE, World Bank, BEA & NGFS
                </p>
              </div>
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors?.map((sector) => {
                  const Icon = SECTOR_ICONS[sector.sectorCode] || Factory;
                  return (
                    <SelectItem key={sector.sectorCode} value={sector.sectorCode}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {sector.sectorName}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sectorDataLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sector data...</p>
          </div>
        ) : sectorData ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${SECTOR_COLORS[selectedSector]} text-white`}>
                      <SectorIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{sectorData.profile.sectorName}</CardTitle>
                      <CardDescription>{sectorData.profile.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTransitionRiskBadge(sectorData.profile.transitionRiskLevel || "moderate")}
                    <Badge variant="outline">NAICS {sectorData.profile.naicsCodeRange}</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">GDP Contribution</p>
                      <p className="text-2xl font-bold">{sectorData.profile.gdpContributionPercent}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Employment Share</p>
                      <p className="text-2xl font-bold">{sectorData.profile.employmentPercent}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Value Added</p>
                      <p className="text-2xl font-bold">{formatCurrency(sectorData.profile.valueAddedBillions || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Growth</p>
                      <p className="text-2xl font-bold">{sectorData.profile.averageRevenueGrowth}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="emissions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="emissions">Emissions Profile</TabsTrigger>
                <TabsTrigger value="scenarios">NGFS Scenarios</TabsTrigger>
                <TabsTrigger value="dependencies">Supply Chain</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="economic">Economic Data</TabsTrigger>
              </TabsList>

              <TabsContent value="emissions" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Emissions</CardTitle>
                      <CardDescription>Annual greenhouse gas emissions (Mt CO2e)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{formatNumber(sectorData.profile.annualEmissionsMtCo2 || 0, 2)}</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(sectorData.profile.emissionsTrend || "stable")}
                            <span className="text-sm text-gray-500 capitalize">{sectorData.profile.emissionsTrend}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Emissions Intensity (tCO2/$M)</p>
                          <Progress value={Math.min((sectorData.profile.emissionsIntensity || 0) / 50, 100)} className="h-2" />
                          <p className="text-xs text-gray-400 mt-1">{sectorData.profile.emissionsIntensity} tCO2/$M revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Primary Emission Sources</CardTitle>
                      <CardDescription>Key contributors to sector emissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sectorData.profile.primaryEmissionSources?.map((source, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm">{source}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historical Emissions Trend</CardTitle>
                    <CardDescription>Data from Climate TRACE</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {sectorData.emissionsHistory.map((record, idx) => {
                        const prevRecord = idx > 0 ? sectorData.emissionsHistory[idx - 1] : null;
                        const yoyChange = prevRecord && prevRecord.emissionsMtCo2 && record.emissionsMtCo2
                          ? ((record.emissionsMtCo2 - prevRecord.emissionsMtCo2) / prevRecord.emissionsMtCo2 * 100).toFixed(1)
                          : null;
                        return (
                          <div key={record.year} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500">{record.year}</p>
                            <p className="text-xl font-bold">{formatNumber(record.emissionsMtCo2 || 0, 2)}</p>
                            <p className="text-xs text-gray-400">Mt CO2e</p>
                            {yoyChange !== null && (
                              <div className={`text-xs mt-1 ${parseFloat(yoyChange) < 0 ? "text-green-600" : "text-red-600"}`}>
                                {parseFloat(yoyChange) > 0 ? "+" : ""}{yoyChange}%
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">NGFS Scenario Impacts</CardTitle>
                    <CardDescription>Network for Greening the Financial System Phase 5 projections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {["Net Zero 2050", "Current Policies"].map((scenario) => {
                        const scenarioData = sectorData.scenarioImpacts.filter(s => s.scenarioName === scenario);
                        return (
                          <Card key={scenario} className={scenario === "Net Zero 2050" ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                {scenario === "Net Zero 2050" ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-red-600" />
                                )}
                                <CardTitle className="text-base">{scenario}</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {scenarioData.map((impact) => (
                                  <div key={impact.year} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <Badge variant="outline">{impact.year}</Badge>
                                      <span className="text-sm font-medium">
                                        Transition Score: {impact.transitionScore}/10
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="text-gray-500">GDP Impact</p>
                                        <p className={`font-medium ${impact.gdpImpactPercent && impact.gdpImpactPercent < 0 ? "text-red-600" : "text-green-600"}`}>
                                          {impact.gdpImpactPercent && impact.gdpImpactPercent > 0 ? "+" : ""}{impact.gdpImpactPercent}%
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Carbon Price</p>
                                        <p className="font-medium">${impact.carbonPriceUsd}/tCO2</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Investment Required</p>
                                        <p className="font-medium">${impact.investmentRequiredBillions}B</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Stranded Asset Risk</p>
                                        <p className="font-medium">{impact.strandedAssetRiskPercent}%</p>
                                      </div>
                                    </div>
                                    {impact.adaptationNeeds && impact.adaptationNeeds.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Key Adaptation Needs:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {impact.adaptationNeeds.slice(0, 3).map((need, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">{need}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dependencies" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        <CardTitle className="text-lg">Upstream Dependencies</CardTitle>
                      </div>
                      <CardDescription>Sectors this industry purchases from (BEA Input-Output)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sectorData.inputOutput
                          .filter(io => io.relationshipType === "input")
                          .sort((a, b) => (b.flowPercent || 0) - (a.flowPercent || 0))
                          .map((io, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium capitalize">{io.fromSectorCode.replace("_", " ")}</span>
                                <span className="text-sm text-gray-500">{io.flowPercent}%</span>
                              </div>
                              <Progress value={io.flowPercent || 0} className="h-2" />
                              <p className="text-xs text-gray-400">
                                Flow value: ${io.flowValueBillions}B
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        <CardTitle className="text-lg">Downstream Customers</CardTitle>
                      </div>
                      <CardDescription>Sectors that purchase from this industry</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sectorData.inputOutput
                          .filter(io => io.relationshipType === "output")
                          .sort((a, b) => (b.flowPercent || 0) - (a.flowPercent || 0))
                          .map((io, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium capitalize">{io.toSectorCode.replace("_", " ")}</span>
                                <span className="text-sm text-gray-500">{io.flowPercent}%</span>
                              </div>
                              <Progress value={io.flowPercent || 0} className="h-2" />
                              <p className="text-xs text-gray-400">
                                Flow value: ${io.flowValueBillions}B
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Climate Transition Opportunities</CardTitle>
                    <CardDescription>Key opportunities for this sector in the low-carbon transition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sectorData.profile.keyOpportunities?.map((opp, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-green-900 dark:text-green-100">{opp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Risks</CardTitle>
                    <CardDescription>Primary climate transition risks for this sector</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sectorData.profile.keyRisks?.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-red-900 dark:text-red-100">{risk}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="economic" className="space-y-4">
                <EconomicIndicatorsSection sectorCode={selectedSector || 'energy'} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Select a sector to view intelligence data</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function EconomicIndicatorsSection({ sectorCode }: { sectorCode: string }) {
  const SECTOR_SERIES: Record<string, string[]> = {
    energy: ['DCOILWTICO', 'DHHNGSP', 'GASREGW'],
    manufacturing: ['INDPRO', 'MANEMP'],
    agriculture: ['GDP', 'CPIENGSL'],
    technology: ['INDPRO', 'GDP'],
    food_beverage: ['CPIENGSL', 'GDP']
  };

  const seriesIds = SECTOR_SERIES[sectorCode] || ['GDP'];
  const primarySeries = seriesIds[0];

  const { data: economicData, isLoading } = useQuery<{ data: EconomicDataPoint[] }>({
    queryKey: ["/api/economic/fred", primarySeries],
    queryFn: async () => {
      const res = await fetch(`/api/economic/fred/${primarySeries}`);
      return res.json();
    }
  });

  const { data: climateData, isLoading: climateLoading } = useQuery<{
    energy: EconomicDataPoint[];
    economic: EconomicDataPoint[];
    emissions: EconomicDataPoint[];
  }>({
    queryKey: ["/api/economic/climate-data"],
  });

  const formatChartData = (data: EconomicDataPoint[] | undefined) => {
    if (!data) return [];
    return data
      .filter(d => d.value !== null)
      .map(d => ({
        ...d,
        date: d.date.split('T')[0],
        displayDate: new Date(d.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = formatChartData(economicData?.data);
  const latestValue = chartData[chartData.length - 1]?.value ?? 0;
  const previousValue = chartData[chartData.length - 2]?.value ?? 0;
  const changePercent = previousValue ? ((latestValue - previousValue) / previousValue) * 100 : 0;

  const getIndicatorName = (seriesId: string) => {
    const names: Record<string, string> = {
      'DCOILWTICO': 'Crude Oil (WTI)',
      'DHHNGSP': 'Natural Gas',
      'GASREGW': 'Gasoline Price',
      'INDPRO': 'Industrial Production',
      'MANEMP': 'Manufacturing Employment',
      'GDP': 'GDP',
      'CPIENGSL': 'Energy CPI'
    };
    return names[seriesId] || seriesId;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Key Economic Indicator
          </CardTitle>
          <CardDescription>
            {getIndicatorName(primarySeries)} - Relevant to {sectorCode.replace('_', ' ')} sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : chartData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{latestValue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-sm text-gray-500">{economicData?.data?.[0]?.units || 'Index'}</p>
                </div>
                <div className={`flex items-center gap-1 ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-medium">{Math.abs(changePercent).toFixed(1)}%</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Value']} />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Sector-Relevant Indicators
          </CardTitle>
          <CardDescription>Economic data from FRED, IMF, and other sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seriesIds.map((seriesId, index) => (
              <div key={seriesId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{getIndicatorName(seriesId)}</p>
                  <p className="text-xs text-gray-500">Source: FRED</p>
                </div>
                <Badge variant={index === 0 ? 'default' : 'outline'}>
                  {index === 0 ? 'Primary' : 'Secondary'}
                </Badge>
              </div>
            ))}
            <Link href="/economic-data">
              <Button variant="outline" className="w-full mt-4">
                <Database className="w-4 h-4 mr-2" />
                Explore All Economic Data
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Data Sources Overview</CardTitle>
          <CardDescription>Connected economic data providers for climate risk analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: 'FRED', desc: 'Federal Reserve', color: 'bg-blue-100 text-blue-700' },
              { name: 'BEA', desc: 'Bureau of Economic Analysis', color: 'bg-green-100 text-green-700' },
              { name: 'IMF', desc: 'International Monetary Fund', color: 'bg-purple-100 text-purple-700' },
              { name: 'OECD', desc: 'Organisation for Economic Co-operation', color: 'bg-amber-100 text-amber-700' },
              { name: 'DBnomics', desc: 'Global Data Aggregator', color: 'bg-pink-100 text-pink-700' },
              { name: 'Data.gov', desc: 'US Government Open Data', color: 'bg-indigo-100 text-indigo-700' },
            ].map((source) => (
              <div key={source.name} className={`p-3 rounded-lg text-center ${source.color}`}>
                <p className="font-semibold text-sm">{source.name}</p>
                <p className="text-xs opacity-80">{source.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
