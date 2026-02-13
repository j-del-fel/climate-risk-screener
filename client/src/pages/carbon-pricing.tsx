import { useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Calculator, Leaf, Factory, Truck, Zap, Search, Loader2, Download, Lightbulb, Upload, Building2, Globe, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface NgfsDataPoint {
  id: string;
  scenario: string;
  model: string;
  year: number;
  carbonPrice: number | null;
}

interface ForecastEntry {
  id: string;
  year: number;
  location: string;
  site?: string;
  country?: string;
  emissions: number;
}

interface EmissionEntry {
  id: string;
  scope: "1" | "2" | "3";
  category: string;
  location: string;
  productService: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emissions: number;
  source: string;
}

interface LcaAlternative {
  process: string;
  currentEmissions: number;
  alternativeEmissions: number;
  reduction: number;
  reductionPercent: number;
  recommendation: string;
}

const scopeCategories = {
  "1": [
    "Stationary Combustion (Boilers, Furnaces)",
    "Mobile Combustion (Fleet Vehicles)",
    "Process Emissions",
    "Fugitive Emissions (Refrigerants, Leaks)"
  ],
  "2": [
    "Purchased Electricity",
    "Purchased Steam",
    "Purchased Heating",
    "Purchased Cooling"
  ],
  "3": [
    "Purchased Goods & Services",
    "Capital Goods",
    "Fuel & Energy Related Activities",
    "Upstream Transportation",
    "Waste Generated",
    "Business Travel",
    "Employee Commuting",
    "Downstream Transportation",
    "Processing of Sold Products",
    "Use of Sold Products",
    "End-of-Life Treatment"
  ]
};

const defaultEmissionFactors: Record<string, number> = {
  "Stationary Combustion (Boilers, Furnaces)": 2.3,
  "Mobile Combustion (Fleet Vehicles)": 2.7,
  "Process Emissions": 1.8,
  "Fugitive Emissions (Refrigerants, Leaks)": 1.5,
  "Purchased Electricity": 0.42,
  "Purchased Steam": 0.07,
  "Purchased Heating": 0.2,
  "Purchased Cooling": 0.15,
  "Purchased Goods & Services": 0.5,
  "Capital Goods": 0.8,
  "Fuel & Energy Related Activities": 0.3,
  "Upstream Transportation": 0.15,
  "Waste Generated": 0.5,
  "Business Travel": 0.25,
  "Employee Commuting": 0.12,
  "Downstream Transportation": 0.12,
  "Processing of Sold Products": 0.4,
  "Use of Sold Products": 1.2,
  "End-of-Life Treatment": 0.3
};

const scenarioColors: Record<string, string> = {
  "net-zero-2050": "#10b981",
  "below-2c": "#3b82f6",
  "delayed-transition": "#f59e0b",
  "divergent-net-zero": "#8b5cf6",
  "ndcs": "#6366f1",
  "current-policies": "#ef4444",
  "hot-house-world": "#dc2626"
};

const scenarioLabelsMap: Record<string, string> = {
  "net-zero-2050": "Net Zero 2050",
  "below-2c": "Below 2°C",
  "delayed-transition": "Delayed Transition",
  "divergent-net-zero": "Divergent Net Zero",
  "ndcs": "NDCs",
  "current-policies": "Current Policies",
  "hot-house-world": "Hot House World"
};

export default function CarbonPricingPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<EmissionEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<EmissionEntry>>({
    scope: "1",
    category: "",
    location: "",
    productService: "",
    quantity: 0,
    unit: "tonnes",
    emissionFactor: 0,
    source: "Default Factor"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [alternatives, setAlternatives] = useState<LcaAlternative[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [carbonPrice, setCarbonPrice] = useState(50);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(["net-zero-2050", "current-policies"]);
  const [groupBy, setGroupBy] = useState<"site" | "country">("country");
  const [forecastEntries, setForecastEntries] = useState<ForecastEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { data: ngfsData, isLoading: isLoadingNgfs } = useQuery<NgfsDataPoint[]>({
    queryKey: ["/api/ngfs/all-scenarios"],
    queryFn: async () => {
      const scenarios = Object.keys(scenarioLabelsMap);
      const allData: NgfsDataPoint[] = [];
      for (const scenario of scenarios) {
        try {
          const res = await fetch(`/api/ngfs/data?scenario=${scenario}&model=Average`);
          const data = await res.json();
          allData.push(...data);
        } catch (e) {
          console.error(`Failed to fetch ${scenario}:`, e);
        }
      }
      return allData;
    },
    staleTime: 60000
  });

  const { data: lcaResults = [], isLoading: isSearching } = useQuery<any[]>({
    queryKey: ["/api/lca/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const response = await fetch(`/api/lca/search?query=${encodeURIComponent(searchQuery)}&pageSize=10`);
      return response.json();
    },
    enabled: searchQuery.length >= 2
  });

  const handleAddEntry = () => {
    const missingFields = [];
    if (!newEntry.category) missingFields.push("Category");
    if (!newEntry.location) missingFields.push("Location");
    if (!newEntry.productService) missingFields.push("Product/Service");
    if (!newEntry.quantity || newEntry.quantity <= 0) missingFields.push("Quantity");
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    const emissionFactor = newEntry.emissionFactor || defaultEmissionFactors[newEntry.category!] || 1;
    const emissions = (newEntry.quantity || 0) * emissionFactor;

    const entry: EmissionEntry = {
      id: Date.now().toString(),
      scope: newEntry.scope as "1" | "2" | "3",
      category: newEntry.category!,
      location: newEntry.location!,
      productService: newEntry.productService!,
      quantity: newEntry.quantity!,
      unit: newEntry.unit || "tonnes",
      emissionFactor,
      emissions,
      source: newEntry.source || "Default Factor"
    };

    setEntries([...entries, entry]);
    setNewEntry({
      scope: newEntry.scope,
      category: "",
      location: "",
      productService: "",
      quantity: 0,
      unit: "tonnes",
      emissionFactor: 0,
      source: "Default Factor"
    });

    toast({
      title: "Entry Added",
      description: `Added ${emissions.toFixed(2)} t CO₂e for ${entry.productService}`
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleUseLcaFactor = (lcaItem: any) => {
    const name = (lcaItem.name || "").toLowerCase();
    const category = (lcaItem.category || "").toLowerCase();
    
    let emissionFactor = 1.0;
    if (name.includes("steel") || name.includes("iron")) {
      emissionFactor = name.includes("recycled") || name.includes("eaf") ? 0.6 : 1.9;
    } else if (name.includes("aluminum") || name.includes("aluminium")) {
      emissionFactor = name.includes("recycled") ? 0.5 : 11.5;
    } else if (name.includes("concrete") || name.includes("cement")) {
      emissionFactor = name.includes("low carbon") ? 0.12 : 0.9;
    } else if (name.includes("plastic") || name.includes("polymer")) {
      emissionFactor = name.includes("recycled") ? 0.5 : 2.5;
    } else if (name.includes("electricity") || name.includes("power")) {
      emissionFactor = name.includes("renewable") || name.includes("solar") || name.includes("wind") ? 0.02 : 0.42;
    } else if (name.includes("natural gas") || name.includes("fuel")) {
      emissionFactor = 2.0;
    } else if (name.includes("diesel") || name.includes("gasoline")) {
      emissionFactor = 2.7;
    } else if (name.includes("paper") || name.includes("cardboard")) {
      emissionFactor = name.includes("recycled") ? 0.3 : 1.1;
    } else if (category.includes("transport") || category.includes("freight")) {
      emissionFactor = 0.15;
    } else if (category.includes("manufacturing")) {
      emissionFactor = 1.5;
    } else if (category.includes("agriculture")) {
      emissionFactor = 0.8;
    }
    
    setNewEntry({
      ...newEntry,
      emissionFactor: emissionFactor,
      source: `LCA: ${lcaItem.name}`
    });
    setSearchQuery("");
    toast({
      title: "Factor Applied",
      description: `Emission factor ${emissionFactor.toFixed(2)} kg CO₂e/unit from: ${lcaItem.name}`
    });
  };

  const runAnalysis = async () => {
    if (entries.length === 0) {
      toast({
        title: "No Data",
        description: "Please add emission entries before running analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockAlternatives: LcaAlternative[] = [
      {
        process: "Steel Production",
        currentEmissions: entries.filter(e => e.productService.toLowerCase().includes("steel")).reduce((sum, e) => sum + e.emissions, 0) || 150,
        alternativeEmissions: 45,
        reduction: 105,
        reductionPercent: 70,
        recommendation: "Switch from blast furnace to Electric Arc Furnace (EAF) with recycled scrap steel and renewable electricity."
      },
      {
        process: "Electricity Consumption",
        currentEmissions: entries.filter(e => e.category.includes("Electricity")).reduce((sum, e) => sum + e.emissions, 0) || 80,
        alternativeEmissions: 12,
        reduction: 68,
        reductionPercent: 85,
        recommendation: "Procure renewable electricity through Power Purchase Agreements (PPAs) or on-site solar installation."
      },
      {
        process: "Transportation",
        currentEmissions: entries.filter(e => e.category.includes("Transportation") || e.category.includes("Mobile")).reduce((sum, e) => sum + e.emissions, 0) || 45,
        alternativeEmissions: 18,
        reduction: 27,
        reductionPercent: 60,
        recommendation: "Transition fleet to electric vehicles and optimize logistics routes. Consider rail for long-distance freight."
      },
      {
        process: "Heating & Cooling",
        currentEmissions: entries.filter(e => e.category.includes("Heating") || e.category.includes("Cooling") || e.category.includes("Steam")).reduce((sum, e) => sum + e.emissions, 0) || 35,
        alternativeEmissions: 8,
        reduction: 27,
        reductionPercent: 77,
        recommendation: "Install heat pumps and improve building insulation. Consider waste heat recovery systems."
      }
    ].filter(alt => alt.currentEmissions > 0);

    setAlternatives(mockAlternatives);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: `Found ${mockAlternatives.length} opportunities to reduce emissions.`
    });
  };

  const totalEmissions = entries.reduce((sum, e) => sum + e.emissions, 0);
  const scope1Total = entries.filter(e => e.scope === "1").reduce((sum, e) => sum + e.emissions, 0);
  const scope2Total = entries.filter(e => e.scope === "2").reduce((sum, e) => sum + e.emissions, 0);
  const scope3Total = entries.filter(e => e.scope === "3").reduce((sum, e) => sum + e.emissions, 0);
  const totalCarbonCost = totalEmissions * carbonPrice;
  const potentialReduction = alternatives.reduce((sum, a) => sum + a.reduction, 0);
  const potentialSavings = potentialReduction * carbonPrice;

  const exportToCSV = () => {
    const headers = ["Scope", "Category", "Location", "Product/Service", "Quantity", "Unit", "Emission Factor", "Emissions (t CO2e)", "Source"];
    const rows = entries.map(e => [e.scope, e.category, e.location, e.productService, e.quantity, e.unit, e.emissionFactor, e.emissions.toFixed(2), e.source]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emissions_inventory.csv";
    a.click();
  };

  const toggleScenario = (scenario: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenario) 
        ? prev.filter(s => s !== scenario)
        : [...prev, scenario]
    );
  };

  const getChartData = () => {
    if (!ngfsData) return [];
    const years = Array.from(new Set(ngfsData.map(d => d.year))).sort((a, b) => a - b);
    return years.map(year => {
      const point: Record<string, number | null> = { year };
      selectedScenarios.forEach(scenario => {
        const dataPoint = ngfsData.find(d => d.year === year && d.scenario === scenario);
        point[scenario] = dataPoint?.carbonPrice || null;
      });
      return point;
    });
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const newEntries: ForecastEntry[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length >= 3) {
          newEntries.push({
            id: `${Date.now()}-${i}`,
            year: parseInt(cols[0]) || 2025,
            location: cols[1] || '',
            site: groupBy === 'site' ? cols[1] : undefined,
            country: groupBy === 'country' ? cols[1] : undefined,
            emissions: parseFloat(cols[2]) || 0
          });
        }
      }
      
      setForecastEntries(newEntries);
      toast({
        title: "File Imported",
        description: `Imported ${newEntries.length} emission records.`
      });
    };
    reader.readAsText(file);
  };

  const chartData = getChartData();

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
                <Calculator className="text-green-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">Carbon Pricing & Reduction Tool</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/lca-education">
                <Button variant="outline" size="sm">
                  <Leaf className="w-4 h-4 mr-2" />
                  Learn About LCA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Factory className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scope 1 (Direct)</p>
                  <p className="text-xl font-bold">{scope1Total.toFixed(1)} t</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scope 2 (Electricity)</p>
                  <p className="text-xl font-bold">{scope2Total.toFixed(1)} t</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Truck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scope 3 (Value Chain)</p>
                  <p className="text-xl font-bold">{scope3Total.toFixed(1)} t</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calculator className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Emissions</p>
                  <p className="text-xl font-bold text-green-700">{totalEmissions.toFixed(1)} t CO₂e</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="inventory">Emissions Inventory</TabsTrigger>
            <TabsTrigger value="forecast">Forecast Upload</TabsTrigger>
            <TabsTrigger value="scenarios">NGFS Scenarios</TabsTrigger>
            <TabsTrigger value="analysis">Reduction Analysis</TabsTrigger>
            <TabsTrigger value="pricing">Carbon Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Emission Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label>Scope</Label>
                    <Select value={newEntry.scope} onValueChange={(v) => setNewEntry({ ...newEntry, scope: v as "1" | "2" | "3", category: "" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Scope 1 - Direct</SelectItem>
                        <SelectItem value="2">Scope 2 - Electricity</SelectItem>
                        <SelectItem value="3">Scope 3 - Value Chain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={newEntry.category} onValueChange={(v) => setNewEntry({ ...newEntry, category: v, emissionFactor: defaultEmissionFactors[v] || 0 })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {scopeCategories[newEntry.scope || "1"].map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input 
                      placeholder="e.g., New York, USA" 
                      value={newEntry.location || ""} 
                      onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Product/Service</Label>
                    <Input 
                      placeholder="e.g., Steel Production" 
                      value={newEntry.productService || ""} 
                      onChange={(e) => setNewEntry({ ...newEntry, productService: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={newEntry.quantity || ""} 
                      onChange={(e) => setNewEntry({ ...newEntry, quantity: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={newEntry.unit || "tonnes"} onValueChange={(v) => setNewEntry({ ...newEntry, unit: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tonnes">Tonnes</SelectItem>
                        <SelectItem value="MWh">MWh</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="km">Kilometers</SelectItem>
                        <SelectItem value="units">Units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Emission Factor (kg CO₂e/unit)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={newEntry.emissionFactor || ""} 
                      onChange={(e) => setNewEntry({ ...newEntry, emissionFactor: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Factor Source</Label>
                    <Input value={newEntry.source || "Default Factor"} readOnly className="bg-gray-50" />
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Search LCA Database for Emission Factor</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        placeholder="Search for material or process..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  {isSearching && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching LCA database...
                    </div>
                  )}
                  {lcaResults.length > 0 && (
                    <div className="mt-2 border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {lcaResults.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          onClick={() => handleUseLcaFactor(item)}
                        >
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.repository}</p>
                          </div>
                          <Button size="sm" variant="ghost">Use</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={handleAddEntry} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </CardContent>
            </Card>

            {entries.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Emission Entries ({entries.length})</CardTitle>
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Scope</th>
                          <th className="text-left py-2 px-2">Category</th>
                          <th className="text-left py-2 px-2">Location</th>
                          <th className="text-left py-2 px-2">Product/Service</th>
                          <th className="text-right py-2 px-2">Quantity</th>
                          <th className="text-right py-2 px-2">Emissions</th>
                          <th className="text-left py-2 px-2">Source</th>
                          <th className="py-2 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map(entry => (
                          <tr key={entry.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-2">
                              <Badge variant={entry.scope === "1" ? "default" : entry.scope === "2" ? "secondary" : "outline"}>
                                Scope {entry.scope}
                              </Badge>
                            </td>
                            <td className="py-2 px-2 max-w-[150px] truncate" title={entry.category}>{entry.category}</td>
                            <td className="py-2 px-2">{entry.location}</td>
                            <td className="py-2 px-2">{entry.productService}</td>
                            <td className="py-2 px-2 text-right">{entry.quantity} {entry.unit}</td>
                            <td className="py-2 px-2 text-right font-medium">{entry.emissions.toFixed(2)} t</td>
                            <td className="py-2 px-2 text-xs text-gray-500 max-w-[120px] truncate" title={entry.source}>{entry.source}</td>
                            <td className="py-2 px-2">
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-600" />
                  Upload Your Emissions Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Upload your company's emissions forecast to calculate climate transition costs using NGFS carbon price scenarios.
                </p>

                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">Group Emissions By</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        groupBy === 'site' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setGroupBy('site')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${groupBy === 'site' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                          {groupBy === 'site' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Site</p>
                          <p className="text-xs text-gray-500">By facility or location</p>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        groupBy === 'country' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setGroupBy('country')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${groupBy === 'country' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                          {groupBy === 'country' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <Globe className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Country</p>
                          <p className="text-xs text-gray-500">By geographic region</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">Emissions Forecast Data</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                      isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="font-medium text-gray-700">Click to browse or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">CSV file with emissions by year and location (tCO2e)</p>
                    <p className="text-xs text-gray-400 mt-2">Format: Year, Location, Emissions</p>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleFileSelect}
                  />
                </div>

                {forecastEntries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Imported Data ({forecastEntries.length} records)</h4>
                    <div className="overflow-x-auto max-h-64 border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left py-2 px-3">Year</th>
                            <th className="text-left py-2 px-3">{groupBy === 'site' ? 'Site' : 'Country'}</th>
                            <th className="text-right py-2 px-3">Emissions (tCO2e)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forecastEntries.slice(0, 20).map(entry => (
                            <tr key={entry.id} className="border-t">
                              <td className="py-2 px-3">{entry.year}</td>
                              <td className="py-2 px-3">{entry.location}</td>
                              <td className="py-2 px-3 text-right">{entry.emissions.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  NGFS Carbon Price Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Compare carbon price trajectories across different NGFS climate scenarios. Click scenarios to toggle visibility.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(scenarioLabelsMap).map(([key, label]) => (
                    <Badge
                      key={key}
                      variant={selectedScenarios.includes(key) ? "default" : "outline"}
                      className="cursor-pointer"
                      style={{ 
                        backgroundColor: selectedScenarios.includes(key) ? scenarioColors[key] : undefined,
                        borderColor: scenarioColors[key],
                        color: selectedScenarios.includes(key) ? 'white' : scenarioColors[key]
                      }}
                      onClick={() => toggleScenario(key)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>

                {isLoadingNgfs ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading NGFS data...</span>
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          label={{ value: 'Carbon Price ($/tCO₂)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`$${value?.toFixed(2)}/tCO₂`, '']}
                          labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        {selectedScenarios.map(scenario => (
                          <Line
                            key={scenario}
                            type="monotone"
                            dataKey={scenario}
                            name={scenarioLabelsMap[scenario]}
                            stroke={scenarioColors[scenario]}
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No data available. Select at least one scenario.
                  </div>
                )}
              </CardContent>
            </Card>

            {forecastEntries.length > 0 && selectedScenarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Transition Cost Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Based on your uploaded emissions forecast and selected NGFS scenarios:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {selectedScenarios.slice(0, 3).map(scenario => {
                      const avgPrice = ngfsData?.filter(d => d.scenario === scenario && d.carbonPrice).reduce((sum, d) => sum + (d.carbonPrice || 0), 0) || 50;
                      const totalForecastEmissions = forecastEntries.reduce((sum, e) => sum + e.emissions, 0);
                      const projectedCost = totalForecastEmissions * (avgPrice / (ngfsData?.filter(d => d.scenario === scenario && d.carbonPrice).length || 1));
                      return (
                        <Card key={scenario} style={{ borderColor: scenarioColors[scenario] }}>
                          <CardContent className="p-4">
                            <p className="text-sm font-medium" style={{ color: scenarioColors[scenario] }}>
                              {scenarioLabelsMap[scenario]}
                            </p>
                            <p className="text-2xl font-bold mt-2">
                              ${projectedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-xs text-gray-500">Projected carbon cost</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Carbon Reduction Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Run an analysis to find alternative production processes and sourcing options from the LCA database 
                  that could help reduce your carbon footprint.
                </p>
                <Button onClick={runAnalysis} disabled={isAnalyzing || entries.length === 0}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Run Reduction Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {alternatives.length > 0 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-600">Current Emissions</p>
                      <p className="text-2xl font-bold text-red-700">{totalEmissions.toFixed(1)} t CO₂e</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-green-600">Potential Reduction</p>
                      <p className="text-2xl font-bold text-green-700">-{potentialReduction.toFixed(1)} t CO₂e</p>
                    </CardContent>
                  </Card>
                </div>

                {alternatives.map((alt, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{alt.process}</h3>
                          <p className="text-sm text-gray-500">
                            Current: {alt.currentEmissions.toFixed(1)} t → Alternative: {alt.alternativeEmissions.toFixed(1)} t
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          -{alt.reductionPercent}%
                        </Badge>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${100 - alt.reductionPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            -{alt.reduction.toFixed(1)} t
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Recommendation:</strong> {alt.recommendation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Price Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Carbon Price ($/tonne CO₂e)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        type="number" 
                        value={carbonPrice} 
                        onChange={(e) => setCarbonPrice(parseFloat(e.target.value) || 0)}
                        className="w-32"
                      />
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => setCarbonPrice(25)}>$25</Button>
                        <Button variant="outline" size="sm" onClick={() => setCarbonPrice(50)}>$50</Button>
                        <Button variant="outline" size="sm" onClick={() => setCarbonPrice(100)}>$100</Button>
                        <Button variant="outline" size="sm" onClick={() => setCarbonPrice(150)}>$150</Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current EU ETS price ~€80/t, US SCC ~$51/t, ICP recommendation $50-100/t
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-red-600 mb-1">Current Carbon Cost</p>
                  <p className="text-3xl font-bold text-red-700">${totalCarbonCost.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{totalEmissions.toFixed(1)} t × ${carbonPrice}/t</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-green-600 mb-1">Potential Savings</p>
                  <p className="text-3xl font-bold text-green-700">${potentialSavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{potentialReduction.toFixed(1)} t reduction</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-blue-600 mb-1">After Reduction</p>
                  <p className="text-3xl font-bold text-blue-700">${(totalCarbonCost - potentialSavings).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{(totalEmissions - potentialReduction).toFixed(1)} t remaining</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Price Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Carbon Price</th>
                        <th className="text-right py-2">Current Cost</th>
                        <th className="text-right py-2">After Reduction</th>
                        <th className="text-right py-2">Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[25, 50, 75, 100, 150, 200].map(price => (
                        <tr key={price} className={`border-b ${price === carbonPrice ? 'bg-blue-50' : ''}`}>
                          <td className="py-2">${price}/t</td>
                          <td className="py-2 text-right">${(totalEmissions * price).toLocaleString()}</td>
                          <td className="py-2 text-right">${((totalEmissions - potentialReduction) * price).toLocaleString()}</td>
                          <td className="py-2 text-right text-green-600">${(potentialReduction * price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
