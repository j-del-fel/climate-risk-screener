import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, TrendingUp, Thermometer, DollarSign, Zap, Factory, Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

interface ModelsResponse {
  models: string[];
  labels: Record<string, string>;
}

interface MetricsResponse {
  labels: Record<string, string>;
}

export default function NGFSPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>("net-zero-2050");
  const [selectedMetric, setSelectedMetric] = useState<string>("temperature");
  const [selectedModel, setSelectedModel] = useState<string>("Average");

  const { data: scenariosData } = useQuery<ScenariosResponse>({
    queryKey: ["/api/ngfs/scenarios"],
  });

  const { data: modelsData } = useQuery<ModelsResponse>({
    queryKey: ["/api/ngfs/models", selectedScenario],
    queryFn: async () => {
      const res = await fetch(`/api/ngfs/models?scenario=${selectedScenario}`);
      return res.json();
    },
  });

  const { data: metricsData } = useQuery<MetricsResponse>({
    queryKey: ["/api/ngfs/metrics"],
  });

  const { data: ngfsData, isLoading } = useQuery<NgfsDataPoint[]>({
    queryKey: ["/api/ngfs/data", selectedScenario, selectedModel],
    queryFn: async () => {
      const res = await fetch(`/api/ngfs/data?scenario=${selectedScenario}&model=${selectedModel}`);
      return res.json();
    },
  });

  const scenarioLabels = scenariosData?.labels || {};
  const scenarioDescriptions = scenariosData?.descriptions || {};
  const modelLabels = modelsData?.labels || {};
  const metricLabels = metricsData?.labels || {};
  const availableScenarios = scenariosData?.scenarios || [];
  const availableModels = modelsData?.models || [];

  const data = ngfsData || [];

  const getMetricData = () => {
    switch (selectedMetric) {
      case "temperature":
        return {
          dataKey: "temperature",
          name: metricLabels.temperature || "Temperature Increase (°C)",
          color: "#ef4444",
          unit: "°C",
          icon: Thermometer
        };
      case "carbonPrice":
        return {
          dataKey: "carbonPrice",
          name: metricLabels.carbonPrice || "Carbon Price (USD/tCO2)",
          color: "#10b981",
          unit: "$/tCO2",
          icon: DollarSign
        };
      case "gdpImpact":
        return {
          dataKey: "gdpImpact",
          name: metricLabels.gdpImpact || "GDP Impact (%)",
          color: "#3b82f6",
          unit: "%",
          icon: TrendingUp
        };
      case "energyDemand":
        return {
          dataKey: "energyDemand",
          name: metricLabels.energyDemand || "Energy Demand (EJ/yr)",
          color: "#f59e0b",
          unit: "EJ/yr",
          icon: Zap
        };
      case "renewableShare":
        return {
          dataKey: "renewableShare",
          name: metricLabels.renewableShare || "Renewable Share (%)",
          color: "#22c55e",
          unit: "%",
          icon: Leaf
        };
      case "fossilFuelDemand":
        return {
          dataKey: "fossilFuelDemand",
          name: metricLabels.fossilFuelDemand || "Fossil Fuel Demand (EJ/yr)",
          color: "#6b7280",
          unit: "EJ/yr",
          icon: Factory
        };
      case "co2Emissions":
        return {
          dataKey: "co2Emissions",
          name: metricLabels.co2Emissions || "CO2 Emissions (GtCO2/yr)",
          color: "#dc2626",
          unit: "GtCO2/yr",
          icon: Factory
        };
      default:
        return {
          dataKey: "temperature",
          name: metricLabels.temperature || "Temperature Increase (°C)",
          color: "#ef4444",
          unit: "°C",
          icon: Thermometer
        };
    }
  };

  const handleExport = () => {
    const csvData = [
      ["Year", "Temperature (°C)", "Carbon Price ($/tCO2)", "GDP Impact (%)", "Energy Demand (EJ/yr)", "Renewable Share (%)", "Fossil Fuel Demand (EJ/yr)", "CO2 Emissions (GtCO2/yr)", "Model", "Data Source"],
      ...data.map(point => [
        point.year,
        point.temperature,
        point.carbonPrice,
        point.gdpImpact,
        point.energyDemand,
        point.renewableShare,
        point.fossilFuelDemand,
        point.co2Emissions,
        point.model,
        point.dataSource || "NGFS Phase III"
      ])
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `ngfs-scenario-${selectedScenario}-${selectedModel}-data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const metricConfig = getMetricData();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back-dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 border-l border-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">NGFS Climate Scenarios</h1>
            </div>
            <Button onClick={handleExport} variant="outline" data-testid="button-export-data">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">NGFS Phase V (Nov 2024)</Badge>
              <span>Latest Climate Scenario Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Explore projections from the Network for Greening the Financial System (NGFS) Phase V scenarios (November 2024).
              This data reflects the latest climate policies, updated damage functions, and integrated assessment model outputs from REMIND-MAgPIE, MESSAGEix-GLOBIOM, and GCAM.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Select Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger data-testid="select-scenario">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {availableScenarios.length > 0 ? (
                    availableScenarios.map((scenario) => (
                      <SelectItem key={scenario} value={scenario}>
                        {scenarioLabels[scenario] || scenario}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="net-zero-2050">Net Zero 2050</SelectItem>
                      <SelectItem value="below-2c">Below 2°C</SelectItem>
                      <SelectItem value="delayed-transition">Delayed Transition</SelectItem>
                      <SelectItem value="divergent-net-zero">Divergent Net Zero</SelectItem>
                      <SelectItem value="ndcs">NDCs</SelectItem>
                      <SelectItem value="current-policies">Current Policies</SelectItem>
                      <SelectItem value="hot-house-world">Hot House World</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Select Model</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger data-testid="select-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Average">Average (All Models)</SelectItem>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {modelLabels[model] || model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Select Metric</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger data-testid="select-metric">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature Increase</SelectItem>
                  <SelectItem value="carbonPrice">Carbon Price</SelectItem>
                  <SelectItem value="gdpImpact">GDP Impact</SelectItem>
                  <SelectItem value="energyDemand">Energy Demand</SelectItem>
                  <SelectItem value="renewableShare">Renewable Share</SelectItem>
                  <SelectItem value="fossilFuelDemand">Fossil Fuel Demand</SelectItem>
                  <SelectItem value="co2Emissions">CO2 Emissions</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <metricConfig.icon className="w-5 h-5" style={{ color: metricConfig.color }} />
              {scenarioLabels[selectedScenario] || selectedScenario}: {metricConfig.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {scenarioDescriptions[selectedScenario] || "Climate scenario projections from NGFS Phase III."}
            </p>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-80">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading data from database...</span>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value?.toFixed(2)} ${metricConfig.unit}`, metricConfig.name]}
                      labelFormatter={(year) => `Year: ${year}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={metricConfig.dataKey} 
                      stroke={metricConfig.color} 
                      strokeWidth={3}
                      name={metricConfig.name}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {data.length > 0 && (
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>
                      By 2050, temperature is projected to reach{" "}
                      <strong>{data.find(d => d.year === 2050)?.temperature?.toFixed(1) || "N/A"}°C</strong> above pre-industrial levels
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      Carbon price expected to reach{" "}
                      <strong>${data.find(d => d.year === 2050)?.carbonPrice?.toFixed(0) || "N/A"}/tCO2</strong> by 2050
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>
                      Renewable energy share projected at{" "}
                      <strong>{data.find(d => d.year === 2050)?.renewableShare?.toFixed(0) || "N/A"}%</strong> by 2050
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>
                      GDP impact projected at{" "}
                      <strong>{data.find(d => d.year === 2050)?.gdpImpact?.toFixed(1) || "N/A"}%</strong> deviation from baseline by 2050
                    </span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Data Source:</span>
                  <Badge variant="outline">NGFS Phase V (Nov 2024)</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Scenario:</span>
                  <span className="font-medium">{scenarioLabels[selectedScenario] || selectedScenario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Model:</span>
                  <span className="font-medium">{selectedModel === "Average" ? "Multi-Model Average" : (modelLabels[selectedModel] || selectedModel)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Range:</span>
                  <span className="font-medium">2020 - 2050</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data Points:</span>
                  <span className="font-medium">{data.length} records</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">About NGFS Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(scenarioLabels).map(([key, label]) => (
                <div 
                  key={key} 
                  className={`p-4 rounded-lg border ${selectedScenario === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <h4 className="font-medium text-gray-900">{label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{scenarioDescriptions[key] || ""}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
