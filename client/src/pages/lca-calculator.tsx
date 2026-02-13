import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Calculator, Leaf, Factory, Truck, Package, ShoppingCart, Trash2, Recycle, Loader2, ChevronDown, ChevronUp, ArrowRight, Download, Info, Zap, DollarSign, Flame, TrendingDown, TrendingUp, Minus, BookOpen, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

interface ScenarioData {
  emissions_kg_co2e: number;
  energy_mj: number;
  cost_usd: number;
  description: string;
  assumptions: string;
}

interface LcaStage {
  name: string;
  description: string;
  low: ScenarioData;
  medium: ScenarioData;
  high: ScenarioData;
}

interface Hotspot {
  stage: string;
  issue: string;
  reduction_potential: string;
}

interface LcaResult {
  productName: string;
  functionalUnit: string;
  boundary: string;
  methodology: string;
  dataSources: string[];
  stages: LcaStage[];
  totals: {
    low: { emissions_kg_co2e: number; energy_mj: number; cost_usd: number };
    medium: { emissions_kg_co2e: number; energy_mj: number; cost_usd: number };
    high: { emissions_kg_co2e: number; energy_mj: number; cost_usd: number };
  };
  recommendations: string[];
  hotspots: Hotspot[];
}

const BOUNDARIES = [
  { value: "cradle-to-gate", label: "Cradle-to-Gate", description: "Raw material extraction through manufacturing", icon: <Factory className="w-4 h-4" /> },
  { value: "cradle-to-grave", label: "Cradle-to-Grave", description: "Full lifecycle from extraction to disposal", icon: <Trash2 className="w-4 h-4" /> },
  { value: "cradle-to-cradle", label: "Cradle-to-Cradle", description: "Full lifecycle with circular economy loops", icon: <Recycle className="w-4 h-4" /> },
  { value: "gate-to-gate", label: "Gate-to-Gate", description: "Single manufacturing process only", icon: <Package className="w-4 h-4" /> },
];

const ALL_STAGES = [
  { value: "Raw Material Extraction", label: "Raw Material Extraction", icon: <Leaf className="w-4 h-4" /> },
  { value: "Material Processing", label: "Material Processing", icon: <Factory className="w-4 h-4" /> },
  { value: "Manufacturing", label: "Manufacturing", icon: <Package className="w-4 h-4" /> },
  { value: "Packaging", label: "Packaging", icon: <Package className="w-4 h-4" /> },
  { value: "Distribution & Transport", label: "Distribution & Transport", icon: <Truck className="w-4 h-4" /> },
  { value: "Use Phase", label: "Use Phase", icon: <ShoppingCart className="w-4 h-4" /> },
  { value: "End-of-Life", label: "End-of-Life", icon: <Trash2 className="w-4 h-4" /> },
  { value: "Recycling & Recovery", label: "Recycling & Recovery", icon: <Recycle className="w-4 h-4" /> },
];

const BOUNDARY_DEFAULT_STAGES: Record<string, string[]> = {
  "cradle-to-gate": ["Raw Material Extraction", "Material Processing", "Manufacturing"],
  "cradle-to-grave": ["Raw Material Extraction", "Material Processing", "Manufacturing", "Packaging", "Distribution & Transport", "Use Phase", "End-of-Life"],
  "cradle-to-cradle": ["Raw Material Extraction", "Material Processing", "Manufacturing", "Packaging", "Distribution & Transport", "Use Phase", "End-of-Life", "Recycling & Recovery"],
  "gate-to-gate": ["Manufacturing"],
};

const EXAMPLE_PRODUCTS = [
  { name: "1 kg of Structural Steel", unit: "kg" },
  { name: "1 Lithium-ion Battery (60 kWh EV pack)", unit: "unit" },
  { name: "1 kg of Portland Cement", unit: "kg" },
  { name: "1 Cotton T-Shirt (200g)", unit: "unit" },
  { name: "1 kWh of Solar Electricity", unit: "kWh" },
  { name: "1 kg of Polyethylene Plastic", unit: "kg" },
  { name: "1 Aluminum Beverage Can", unit: "unit" },
  { name: "1 Smartphone", unit: "unit" },
];

function formatNumber(n: number, decimals = 2): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toFixed(decimals);
}

function ScenarioCard({ label, data, color, icon, totalEmissions }: { label: string; data: ScenarioData; color: string; icon: React.ReactNode; totalEmissions: number }) {
  const pct = totalEmissions > 0 ? ((data.emissions_kg_co2e / totalEmissions) * 100).toFixed(1) : "0";
  return (
    <div className={`p-4 rounded-lg border ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Emissions</p>
          <p className="text-lg font-bold">{formatNumber(data.emissions_kg_co2e)}</p>
          <p className="text-xs text-gray-400">kg CO₂e</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Energy</p>
          <p className="text-lg font-bold">{formatNumber(data.energy_mj)}</p>
          <p className="text-xs text-gray-400">MJ</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cost</p>
          <p className="text-lg font-bold">${formatNumber(data.cost_usd)}</p>
          <p className="text-xs text-gray-400">USD</p>
        </div>
      </div>
      <p className="text-xs text-gray-600">{data.description}</p>
      <p className="text-xs text-gray-400 mt-1 italic">{data.assumptions}</p>
    </div>
  );
}

export default function LcaCalculatorPage() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [quantityUnit, setQuantityUnit] = useState("unit");
  const [boundary, setBoundary] = useState("");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [result, setResult] = useState<LcaResult | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());
  const [activeView, setActiveView] = useState<"overview" | "stages" | "comparison">("overview");

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const resp = await apiRequest("POST", "/api/lca-calculator/analyze", {
        productName,
        productDescription: productDescription || undefined,
        quantity: parseFloat(quantity) || 1,
        quantityUnit,
        boundary,
        stages: selectedStages.length > 0 ? selectedStages : undefined,
      });
      return resp.json();
    },
    onSuccess: (data: LcaResult) => {
      setResult(data);
      setExpandedStages(new Set(data.stages.map((_, i) => i)));
    },
  });

  const handleBoundaryChange = (val: string) => {
    setBoundary(val);
    setSelectedStages(BOUNDARY_DEFAULT_STAGES[val] || []);
  };

  const toggleStage = (stage: string) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  const toggleExpandStage = (idx: number) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleExampleClick = (ex: typeof EXAMPLE_PRODUCTS[0]) => {
    setProductName(ex.name);
    setQuantityUnit(ex.unit);
    setQuantity("1");
  };

  const exportCsv = () => {
    if (!result) return;
    const rows = [["Stage", "Scenario", "Emissions (kg CO2e)", "Energy (MJ)", "Cost (USD)", "Description"]];
    for (const stage of result.stages) {
      for (const scenario of ["low", "medium", "high"] as const) {
        const d = stage[scenario];
        rows.push([stage.name, scenario, d.emissions_kg_co2e.toString(), d.energy_mj.toString(), d.cost_usd.toString(), d.description]);
      }
    }
    rows.push([]);
    rows.push(["TOTALS"]);
    for (const scenario of ["low", "medium", "high"] as const) {
      const t = result.totals[scenario];
      rows.push(["Total", scenario, t.emissions_kg_co2e.toString(), t.energy_mj.toString(), t.cost_usd.toString(), ""]);
    }
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lca-${result.productName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canSubmit = productName.trim() && boundary && !analyzeMutation.isPending;

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
                <Calculator className="text-blue-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">LCA Calculator</h1>
              </div>
            </div>
            <Link href="/lca-education">
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Learn About LCA
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Lifecycle Analysis</h2>
          <p className="text-gray-600">
            Calculate lifecycle energy use, emissions, and cost for any product across every stage. 
            Get three scenarios—low, medium, and high emissions—to understand the range of environmental impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    placeholder="e.g., 1 kg of Structural Steel"
                  />
                </div>
                <div>
                  <Label htmlFor="productDescription">Description (optional)</Label>
                  <Textarea
                    id="productDescription"
                    value={productDescription}
                    onChange={e => setProductDescription(e.target.value)}
                    placeholder="Additional context about the product, materials, or production process..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">unit</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="tonne">tonne</SelectItem>
                        <SelectItem value="m3">m³</SelectItem>
                        <SelectItem value="kWh">kWh</SelectItem>
                        <SelectItem value="liter">liter</SelectItem>
                        <SelectItem value="m2">m²</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  System Boundary
                </CardTitle>
                <CardDescription>Define which lifecycle stages to include</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {BOUNDARIES.map(b => (
                  <div
                    key={b.value}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      boundary === b.value
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleBoundaryChange(b.value)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={boundary === b.value ? "text-blue-600" : "text-gray-500"}>{b.icon}</span>
                      <span className="font-medium text-sm">{b.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">{b.description}</p>
                  </div>
                ))}

                {boundary && (
                  <div className="mt-4">
                    <Label className="text-xs text-gray-500 mb-2 block">Included Stages (click to toggle)</Label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_STAGES.map(s => (
                        <Badge
                          key={s.value}
                          variant={selectedStages.includes(s.value) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedStages.includes(s.value)
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => toggleStage(s.value)}
                        >
                          {s.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              disabled={!canSubmit}
              onClick={() => analyzeMutation.mutate()}
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Lifecycle...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Run LCA Analysis
                </>
              )}
            </Button>

            {analyzeMutation.isError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">{(analyzeMutation.error as Error).message || "Analysis failed. Please try again."}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Examples</CardTitle>
                <CardDescription>Click to populate the form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {EXAMPLE_PRODUCTS.map((ex, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                      onClick={() => handleExampleClick(ex)}
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {analyzeMutation.isPending && (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Running Life Cycle Assessment</h3>
                  <p className="text-gray-500">Analyzing emissions, energy, and cost across lifecycle stages...</p>
                </div>
              </Card>
            )}

            {!result && !analyzeMutation.isPending && (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Your Analysis</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Enter a product, select a system boundary, and choose which lifecycle stages to include. 
                    You'll receive three scenarios showing low, medium, and high emission pathways with energy use and cost.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-green-500" /> Low emissions</span>
                    <span className="flex items-center gap-1"><Minus className="w-3 h-3 text-yellow-500" /> Medium</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-red-500" /> High emissions</span>
                  </div>
                </div>
              </Card>
            )}

            {result && !analyzeMutation.isPending && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{result.productName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Functional Unit: {result.functionalUnit} | Boundary: {result.boundary}</p>
                        <p className="text-xs text-gray-500 mt-2">{result.methodology}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
                        <Download className="w-3 h-3" />
                        CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <TrendingDown className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Low Emissions</span>
                      </div>
                      <p className="text-2xl font-bold text-green-800">{formatNumber(result.totals.low.emissions_kg_co2e)}</p>
                      <p className="text-xs text-green-600">kg CO₂e</p>
                      <div className="flex justify-center gap-4 mt-2 text-xs text-green-600">
                        <span>{formatNumber(result.totals.low.energy_mj)} MJ</span>
                        <span>${formatNumber(result.totals.low.cost_usd)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Minus className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-700">Medium Emissions</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-800">{formatNumber(result.totals.medium.emissions_kg_co2e)}</p>
                      <p className="text-xs text-yellow-600">kg CO₂e</p>
                      <div className="flex justify-center gap-4 mt-2 text-xs text-yellow-600">
                        <span>{formatNumber(result.totals.medium.energy_mj)} MJ</span>
                        <span>${formatNumber(result.totals.medium.cost_usd)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-700">High Emissions</span>
                      </div>
                      <p className="text-2xl font-bold text-red-800">{formatNumber(result.totals.high.emissions_kg_co2e)}</p>
                      <p className="text-xs text-red-600">kg CO₂e</p>
                      <div className="flex justify-center gap-4 mt-2 text-xs text-red-600">
                        <span>{formatNumber(result.totals.high.energy_mj)} MJ</span>
                        <span>${formatNumber(result.totals.high.cost_usd)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="stages">Stage Details</TabsTrigger>
                    <TabsTrigger value="comparison">Scenario Comparison</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-600" />
                          Emissions by Stage (Medium Scenario)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.stages.map((stage, idx) => {
                            const pct = result.totals.medium.emissions_kg_co2e > 0
                              ? (stage.medium.emissions_kg_co2e / result.totals.medium.emissions_kg_co2e * 100)
                              : 0;
                            return (
                              <div key={idx}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-700 font-medium">{stage.name}</span>
                                  <span className="text-gray-500">{formatNumber(stage.medium.emissions_kg_co2e)} kg CO₂e ({pct.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {result.hotspots && result.hotspots.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            Emission Hotspots
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {result.hotspots.map((h, idx) => (
                              <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-amber-100 text-amber-800">{h.stage}</Badge>
                                </div>
                                <p className="text-sm text-gray-700">{h.issue}</p>
                                <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" />
                                  {h.reduction_potential}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {result.recommendations && result.recommendations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {result.recommendations.map((rec, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-gray-700">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Info className="w-4 h-4 text-gray-500" />
                          Data Sources
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {result.dataSources.map((src, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{src}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="stages" className="space-y-4">
                    {result.stages.map((stage, idx) => (
                      <Card key={idx}>
                        <CardHeader
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleExpandStage(idx)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">{stage.name}</CardTitle>
                              <CardDescription>{stage.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">{formatNumber(stage.medium.emissions_kg_co2e)} kg CO₂e</p>
                                <p className="text-xs text-gray-400">medium scenario</p>
                              </div>
                              {expandedStages.has(idx) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </div>
                        </CardHeader>
                        {expandedStages.has(idx) && (
                          <CardContent>
                            <div className="grid md:grid-cols-3 gap-3">
                              <ScenarioCard
                                label="Low Emissions"
                                data={stage.low}
                                color="bg-green-50 border-green-200"
                                icon={<TrendingDown className="w-4 h-4 text-green-600" />}
                                totalEmissions={result.totals.low.emissions_kg_co2e}
                              />
                              <ScenarioCard
                                label="Medium Emissions"
                                data={stage.medium}
                                color="bg-yellow-50 border-yellow-200"
                                icon={<Minus className="w-4 h-4 text-yellow-600" />}
                                totalEmissions={result.totals.medium.emissions_kg_co2e}
                              />
                              <ScenarioCard
                                label="High Emissions"
                                data={stage.high}
                                color="bg-red-50 border-red-200"
                                icon={<TrendingUp className="w-4 h-4 text-red-600" />}
                                totalEmissions={result.totals.high.emissions_kg_co2e}
                              />
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="comparison" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Emissions Comparison by Stage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4">Stage</th>
                                <th className="text-right py-2 px-2">
                                  <span className="flex items-center justify-end gap-1 text-green-700">
                                    <TrendingDown className="w-3 h-3" /> Low
                                  </span>
                                </th>
                                <th className="text-right py-2 px-2">
                                  <span className="flex items-center justify-end gap-1 text-yellow-700">
                                    <Minus className="w-3 h-3" /> Medium
                                  </span>
                                </th>
                                <th className="text-right py-2 px-2">
                                  <span className="flex items-center justify-end gap-1 text-red-700">
                                    <TrendingUp className="w-3 h-3" /> High
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.stages.map((stage, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                  <td className="py-2 pr-4 font-medium text-gray-700">{stage.name}</td>
                                  <td className="py-2 px-2 text-right text-green-700">{formatNumber(stage.low.emissions_kg_co2e)}</td>
                                  <td className="py-2 px-2 text-right text-yellow-700">{formatNumber(stage.medium.emissions_kg_co2e)}</td>
                                  <td className="py-2 px-2 text-right text-red-700">{formatNumber(stage.high.emissions_kg_co2e)}</td>
                                </tr>
                              ))}
                              <tr className="border-t-2 font-bold">
                                <td className="py-2 pr-4">Total (kg CO₂e)</td>
                                <td className="py-2 px-2 text-right text-green-700">{formatNumber(result.totals.low.emissions_kg_co2e)}</td>
                                <td className="py-2 px-2 text-right text-yellow-700">{formatNumber(result.totals.medium.emissions_kg_co2e)}</td>
                                <td className="py-2 px-2 text-right text-red-700">{formatNumber(result.totals.high.emissions_kg_co2e)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Energy Comparison by Stage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4">Stage</th>
                                <th className="text-right py-2 px-2 text-green-700">Low (MJ)</th>
                                <th className="text-right py-2 px-2 text-yellow-700">Medium (MJ)</th>
                                <th className="text-right py-2 px-2 text-red-700">High (MJ)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.stages.map((stage, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                  <td className="py-2 pr-4 font-medium text-gray-700">{stage.name}</td>
                                  <td className="py-2 px-2 text-right">{formatNumber(stage.low.energy_mj)}</td>
                                  <td className="py-2 px-2 text-right">{formatNumber(stage.medium.energy_mj)}</td>
                                  <td className="py-2 px-2 text-right">{formatNumber(stage.high.energy_mj)}</td>
                                </tr>
                              ))}
                              <tr className="border-t-2 font-bold">
                                <td className="py-2 pr-4">Total (MJ)</td>
                                <td className="py-2 px-2 text-right">{formatNumber(result.totals.low.energy_mj)}</td>
                                <td className="py-2 px-2 text-right">{formatNumber(result.totals.medium.energy_mj)}</td>
                                <td className="py-2 px-2 text-right">{formatNumber(result.totals.high.energy_mj)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Cost Comparison by Stage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4">Stage</th>
                                <th className="text-right py-2 px-2 text-green-700">Low ($)</th>
                                <th className="text-right py-2 px-2 text-yellow-700">Medium ($)</th>
                                <th className="text-right py-2 px-2 text-red-700">High ($)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.stages.map((stage, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                  <td className="py-2 pr-4 font-medium text-gray-700">{stage.name}</td>
                                  <td className="py-2 px-2 text-right">${formatNumber(stage.low.cost_usd)}</td>
                                  <td className="py-2 px-2 text-right">${formatNumber(stage.medium.cost_usd)}</td>
                                  <td className="py-2 px-2 text-right">${formatNumber(stage.high.cost_usd)}</td>
                                </tr>
                              ))}
                              <tr className="border-t-2 font-bold">
                                <td className="py-2 pr-4">Total ($)</td>
                                <td className="py-2 px-2 text-right">${formatNumber(result.totals.low.cost_usd)}</td>
                                <td className="py-2 px-2 text-right">${formatNumber(result.totals.medium.cost_usd)}</td>
                                <td className="py-2 px-2 text-right">${formatNumber(result.totals.high.cost_usd)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
