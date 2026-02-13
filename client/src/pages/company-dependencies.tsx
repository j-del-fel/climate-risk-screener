import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Building2,
  Loader2,
  Factory,
  Droplets,
  Zap,
  Globe2,
  Package,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Database,
  AlertTriangle,
  BarChart3,
  X,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CompanyDependency, MaterialDependency, EnergyDependency, WaterDependency, GeographicDependency } from "@shared/schema";

const CRITICALITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

const WATER_USAGE_COLORS: Record<string, string> = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-green-600",
};

function CriticalityBadge({ level }: { level: string }) {
  return (
    <Badge variant="outline" className={`text-xs ${CRITICALITY_COLORS[level] || "bg-gray-100 text-gray-800"}`}>
      {level}
    </Badge>
  );
}

function CompanyCard({ company, onSelect }: { company: CompanyDependency; onSelect: () => void }) {
  const materials = (company.materialDependencies as MaterialDependency[]) || [];
  const energy = (company.energyDependencies as EnergyDependency[]) || [];
  const water = company.waterDependency as WaterDependency | null;
  const geo = (company.geographicDependencies as GeographicDependency[]) || [];
  const highCritCount = materials.filter(m => m.criticality === "high").length +
    energy.filter(e => e.criticality === "high").length +
    geo.filter(g => g.criticality === "high").length;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{company.companyName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {company.ticker && <span className="font-mono">{company.ticker}</span>}
              <span>{company.sector}</span>
              {company.subsector && <span className="text-gray-400">/ {company.subsector}</span>}
            </div>
          </div>
          {highCritCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {highCritCount} high
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="text-center p-2 bg-blue-50 rounded">
            <Package className="w-4 h-4 mx-auto text-blue-600 mb-1" />
            <span className="text-xs text-gray-600">{materials.length} materials</span>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded">
            <Zap className="w-4 h-4 mx-auto text-amber-600 mb-1" />
            <span className="text-xs text-gray-600">{energy.length} energy</span>
          </div>
          <div className="text-center p-2 bg-cyan-50 rounded">
            <Droplets className={`w-4 h-4 mx-auto mb-1 ${WATER_USAGE_COLORS[(water as WaterDependency)?.usageLevel] || "text-gray-400"}`} />
            <span className="text-xs text-gray-600">{(water as WaterDependency)?.usageLevel || "n/a"}</span>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <Globe2 className="w-4 h-4 mx-auto text-green-600 mb-1" />
            <span className="text-xs text-gray-600">{geo.length} regions</span>
          </div>
        </div>
        {company.hqState && (
          <div className="mt-2 text-xs text-gray-400">HQ: {company.hqState}</div>
        )}
      </CardContent>
    </Card>
  );
}

function CompanyDetail({ company, onClose }: { company: CompanyDependency; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"materials" | "energy" | "water" | "geographic">("materials");
  const materials = (company.materialDependencies as MaterialDependency[]) || [];
  const energy = (company.energyDependencies as EnergyDependency[]) || [];
  const water = company.waterDependency as WaterDependency | null;
  const geo = (company.geographicDependencies as GeographicDependency[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{company.companyName}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            {company.ticker && <Badge variant="outline" className="font-mono">{company.ticker}</Badge>}
            <span>{company.sector}</span>
            {company.subsector && <span>/ {company.subsector}</span>}
            {company.naicsCode && <span className="font-mono text-xs">NAICS: {company.naicsCode}</span>}
          </div>
          {company.naicsDescription && (
            <p className="text-sm text-gray-400 mt-1">{company.naicsDescription}</p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {company.hqState && (
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500">Headquarters</div>
            <div className="font-medium">{company.hqState}</div>
          </div>
        )}
        {company.revenueRange && (
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500">Revenue</div>
            <div className="font-medium">{company.revenueRange}</div>
          </div>
        )}
        {company.employees && (
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500">Employees</div>
            <div className="font-medium">{company.employees}</div>
          </div>
        )}
        {company.hqRegion && (
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500">Region</div>
            <div className="font-medium">{company.hqRegion}</div>
          </div>
        )}
      </div>

      {company.climateRiskExposure && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-orange-800 mb-1">Climate Risk Exposure</div>
                <p className="text-sm text-orange-700">{company.climateRiskExposure}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: "materials" as const, label: "Materials", icon: Package, count: materials.length },
          { key: "energy" as const, label: "Energy", icon: Zap, count: energy.length },
          { key: "water" as const, label: "Water", icon: Droplets, count: 1 },
          { key: "geographic" as const, label: "Geographic", icon: Globe2, count: geo.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <Badge variant="secondary" className="text-xs ml-1">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {activeTab === "materials" && (
        <div className="space-y-3">
          {materials.map((m, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-sm text-gray-500 mt-1">Source: {m.primarySource}</div>
                    {m.notes && <p className="text-sm text-gray-400 mt-1">{m.notes}</p>}
                  </div>
                  <CriticalityBadge level={m.criticality} />
                </div>
              </CardContent>
            </Card>
          ))}
          {materials.length === 0 && <p className="text-gray-400 text-center py-4">No material dependencies recorded</p>}
        </div>
      )}

      {activeTab === "energy" && (
        <div className="space-y-3">
          {energy.map((e, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{e.source}</div>
                    <div className="text-sm text-gray-500 mt-1">{e.percentOfTotal}% of total energy</div>
                    {e.notes && <p className="text-sm text-gray-400 mt-1">{e.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${e.percentOfTotal}%` }}
                      />
                    </div>
                    <CriticalityBadge level={e.criticality} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {energy.length === 0 && <p className="text-gray-400 text-center py-4">No energy dependencies recorded</p>}
        </div>
      )}

      {activeTab === "water" && water && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Usage Level</div>
                <Badge variant="outline" className={`${CRITICALITY_COLORS[(water as WaterDependency).usageLevel] || ""}`}>
                  {(water as WaterDependency).usageLevel}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Primary Use</div>
                <div className="font-medium text-sm">{(water as WaterDependency).primaryUse}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Annual Volume Estimate</div>
                <div className="font-medium text-sm">{(water as WaterDependency).annualVolumeEstimate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Water Stress Exposure</div>
                <div className="font-medium text-sm">{(water as WaterDependency).waterStressExposure}</div>
              </div>
            </div>
            {(water as WaterDependency).notes && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Notes</div>
                <p className="text-sm text-gray-600">{(water as WaterDependency).notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "geographic" && (
        <div className="space-y-3">
          {geo.map((g, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{g.region}</div>
                    <div className="text-sm text-gray-500 mt-1">{g.dependencyType}</div>
                    {g.notes && <p className="text-sm text-gray-400 mt-1">{g.notes}</p>}
                  </div>
                  <CriticalityBadge level={g.criticality} />
                </div>
              </CardContent>
            </Card>
          ))}
          {geo.length === 0 && <p className="text-gray-400 text-center py-4">No geographic dependencies recorded</p>}
        </div>
      )}

      {company.supplyChainNotes && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Supply Chain Notes</h4>
            <p className="text-sm text-gray-600">{company.supplyChainNotes}</p>
          </div>
        </>
      )}
    </div>
  );
}

function AiSuggestDialog({ onAdd }: { onAdd: () => void }) {
  const [companyName, setCompanyName] = useState("");
  const [naicsCode, setNaicsCode] = useState("");
  const [description, setDescription] = useState("");
  const [suggestion, setSuggestion] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const suggestMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/company-dependencies/ai-suggest", {
        companyName,
        naicsCode: naicsCode || undefined,
        description: description || undefined,
      });
      return res.json();
    },
    onSuccess: (data) => setSuggestion(data),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const body = {
        companyName,
        naicsCode: suggestion.naicsCode || naicsCode || "999999",
        naicsDescription: suggestion.naicsDescription || "",
        sector: suggestion.sector || "Other",
        subsector: suggestion.subsector || null,
        materialDependencies: suggestion.materialDependencies || [],
        energyDependencies: suggestion.energyDependencies || [],
        waterDependency: suggestion.waterDependency || {},
        geographicDependencies: suggestion.geographicDependencies || [],
        supplyChainNotes: suggestion.supplyChainNotes || null,
        climateRiskExposure: suggestion.climateRiskExposure || null,
      };
      const res = await apiRequest("POST", "/api/company-dependencies", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-dependencies"] });
      setOpen(false);
      setSuggestion(null);
      setCompanyName("");
      setNaicsCode("");
      setDescription("");
      onAdd();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Company Analysis
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Company Name *</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Tesla Inc."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">NAICS Code (optional)</label>
              <Input
                value={naicsCode}
                onChange={(e) => setNaicsCode(e.target.value)}
                placeholder="e.g., 336111"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description (optional)</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
          </div>
          <Button
            onClick={() => suggestMutation.mutate()}
            disabled={!companyName || suggestMutation.isPending}
            className="w-full"
          >
            {suggestMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Dependencies
              </>
            )}
          </Button>

          {suggestMutation.isError && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
              Failed to get AI suggestions. Please try again.
            </div>
          )}

          {suggestion && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">AI Suggested Dependencies</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Sector:</span> {suggestion.sector}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">NAICS:</span> {suggestion.naicsCode}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Materials ({suggestion.materialDependencies?.length || 0})</h5>
                <div className="space-y-1">
                  {suggestion.materialDependencies?.map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded">
                      <span>{m.name} - {m.primarySource}</span>
                      <CriticalityBadge level={m.criticality} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Energy ({suggestion.energyDependencies?.length || 0})</h5>
                <div className="space-y-1">
                  {suggestion.energyDependencies?.map((e: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-amber-50 p-2 rounded">
                      <span>{e.source} ({e.percentOfTotal}%)</span>
                      <CriticalityBadge level={e.criticality} />
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => addMutation.mutate()}
                disabled={addMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add to Database
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CompanyDependenciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<CompanyDependency | null>(null);

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/company-dependencies/seed", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-dependencies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company-dependencies/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company-dependencies/sectors"] });
    },
  });

  const companiesQuery = useQuery<CompanyDependency[]>({
    queryKey: ["/api/company-dependencies", { search: searchTerm, sector: selectedSector }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedSector && selectedSector !== "all") params.set("sector", selectedSector);
      const res = await fetch(`/api/company-dependencies?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const sectorsQuery = useQuery<string[]>({
    queryKey: ["/api/company-dependencies/sectors"],
  });

  const statsQuery = useQuery<{ total: number; sectors: Record<string, number> }>({
    queryKey: ["/api/company-dependencies/stats"],
  });

  useEffect(() => {
    if (companiesQuery.data && companiesQuery.data.length === 0 && !searchTerm && selectedSector === "all") {
      seedMutation.mutate();
    }
  }, [companiesQuery.data]);

  const companies = companiesQuery.data || [];
  const sectors = sectorsQuery.data || [];
  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <Database className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Company Dependencies Explorer</h1>
              </div>
            </div>
            <AiSuggestDialog onAdd={() => {}} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-gray-500">Companies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Factory className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="text-2xl font-bold">{Object.keys(stats.sectors).length}</div>
                    <div className="text-xs text-gray-500">Sectors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {companies.reduce((sum, c) => sum + ((c.materialDependencies as any[])?.length || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-500">Material Deps</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {companies.reduce((sum, c) => {
                        const mats = (c.materialDependencies as any[]) || [];
                        return sum + mats.filter((m: any) => m.criticality === "high").length;
                      }, 0)}
                    </div>
                    <div className="text-xs text-gray-500">High Criticality</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies, sectors, or materials..."
              className="pl-10"
            />
          </div>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(companiesQuery.isLoading || seedMutation.isPending) && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-gray-500">
              {seedMutation.isPending ? "Loading seed data..." : "Loading companies..."}
            </span>
          </div>
        )}

        {!companiesQuery.isLoading && !seedMutation.isPending && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${selectedCompany ? "lg:col-span-1" : "lg:col-span-3"}`}>
              <div className={`grid gap-4 ${selectedCompany ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {companies.map(c => (
                  <CompanyCard
                    key={c.id}
                    company={c}
                    onSelect={() => setSelectedCompany(c)}
                  />
                ))}
              </div>
              {companies.length === 0 && !companiesQuery.isLoading && (
                <div className="text-center py-12 text-gray-400">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No companies found matching your criteria</p>
                </div>
              )}
            </div>

            {selectedCompany && (
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <CompanyDetail
                      company={selectedCompany}
                      onClose={() => setSelectedCompany(null)}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-lg mb-4">About This Database</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Purpose</h4>
              <p>
                This database captures material, energy, water, and geographic dependencies for major US companies. 
                It enables high-level economic simulation and narrative generation about how sectors interact through 
                shared resource dependencies and geographic supply chain overlaps.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Use Cases</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Identify overlapping material dependencies across sectors</li>
                <li>Map geographic supply chain concentration risks</li>
                <li>Assess energy transition exposure by company</li>
                <li>Evaluate water stress vulnerability across portfolios</li>
                <li>Support climate scenario analysis with real dependency data</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}