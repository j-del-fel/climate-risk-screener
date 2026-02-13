import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Leaf, Search, Database, RefreshCw, Download, Filter, Loader2, Factory, Zap, Droplets, TreePine, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/queryClient";

interface LcaSearchResult {
  refId: string;
  name: string;
  category: string;
  repository: string;
  location: string | null;
  type: string;
  description: string | null;
}

interface LcaStats {
  totalRecords: number;
  byRepository: { repository: string; count: number }[];
  byCategory: { category: string; count: number }[];
  lastUpdated: string | null;
}

interface LcaRepository {
  id: string;
  name: string;
  group: string;
  description: string;
}

const REPO_ICONS: Record<string, typeof Leaf> = {
  'USLCI_Database_Public': Factory,
  'US_Electricity_Baseline': Zap,
  'NIST_Building_Systems': Building,
  'USDA_LCA_Digital_Commons': Droplets,
  'Forestry_and_Forest_Products': TreePine,
};

const REPO_COLORS: Record<string, string> = {
  'USLCI_Database_Public': 'bg-blue-100 text-blue-800',
  'USLCI': 'bg-blue-100 text-blue-800',
  'US_Electricity_Baseline': 'bg-yellow-100 text-yellow-800',
  'NIST_Building_Systems': 'bg-purple-100 text-purple-800',
  'USDA_LCA_Digital_Commons': 'bg-green-100 text-green-800',
  'Forestry_and_Forest_Products': 'bg-emerald-100 text-emerald-800',
};

export default function LcaDataPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery<LcaStats>({
    queryKey: ["/api/lca/stats"],
  });

  const { data: repositories } = useQuery<LcaRepository[]>({
    queryKey: ["/api/lca/repositories"],
  });

  const { data: searchResults, isLoading: searchLoading, refetch: refetchSearch } = useQuery<LcaSearchResult[]>({
    queryKey: ["/api/lca/search", debouncedQuery, selectedRepo],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const params = new URLSearchParams({ query: debouncedQuery, pageSize: "100" });
      if (selectedRepo !== "all") params.append("repository", selectedRepo);
      const res = await fetch(`/api/lca/search?${params}`);
      return res.json();
    },
    enabled: debouncedQuery.length >= 2,
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/lca/import", { method: "POST" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lca/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lca/search"] });
    },
  });

  const handleSearch = () => {
    setDebouncedQuery(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const downloadResults = () => {
    if (!searchResults || searchResults.length === 0) return;
    
    const headers = ["Name", "Category", "Repository", "Location", "Type", "Ref ID"];
    const rows = searchResults.map(r => [
      r.name,
      r.category,
      r.repository,
      r.location || "",
      r.type,
      r.refId
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lca-search-${searchQuery}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRepoColor = (repo: string) => {
    return REPO_COLORS[repo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LCA Data Explorer</h1>
              <p className="text-gray-600">
                Search emission factors from Federal LCA Commons (USLCI, NIST, USDA, USFS)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{statsLoading ? "..." : stats?.totalRecords || 0}</p>
                  <p className="text-sm text-gray-600">Cached Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Factory className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.byRepository?.length || 5}</p>
                  <p className="text-sm text-gray-600">Data Sources</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Filter className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.byCategory?.length || 0}</p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <Button 
                onClick={() => importMutation.mutate()}
                disabled={importMutation.isPending}
                className="w-full"
              >
                {importMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {importMutation.isPending ? "Importing..." : "Import Data"}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Last: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : "Never"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Emission Factors
            </CardTitle>
            <CardDescription>
              Search for processes, materials, and emission factors in the Federal LCA Commons database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search for materials, processes, or emission factors (e.g., electricity, steel, concrete)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                />
              </div>
              <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All repositories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Repositories</SelectItem>
                  {repositories?.map(repo => (
                    <SelectItem key={repo.id} value={repo.id}>{repo.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={searchLoading || searchQuery.length < 2}>
                {searchLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
              {searchResults && searchResults.length > 0 && (
                <Button variant="outline" onClick={downloadResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>

            {searchLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-2">Searching Federal LCA Commons...</span>
              </div>
            )}

            {searchResults && searchResults.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Process / Material</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Repository</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((result) => (
                      <TableRow key={result.refId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{result.name}</p>
                            {result.description && (
                              <p className="text-sm text-gray-500 truncate max-w-md">{result.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{result.category || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRepoColor(result.repository)}>
                            {result.repository.replace(/_/g, ' ').replace(' Database Public', '')}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.location || "US"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{result.type}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {searchResults && searchResults.length === 0 && debouncedQuery && !searchLoading && (
              <div className="text-center py-8 text-gray-500">
                No results found for "{debouncedQuery}". Try a different search term.
              </div>
            )}

            {!debouncedQuery && !searchLoading && (
              <div className="text-center py-8">
                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Enter a search term to find emission factors</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["electricity", "natural gas", "steel", "concrete", "aluminum", "plastic", "diesel", "paper"].map(term => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(term);
                        setDebouncedQuery(term);
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Federal agencies providing life cycle assessment data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Factory className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">USLCI Database</p>
                    <p className="text-sm text-gray-600">U.S. Life Cycle Inventory - fuels, transport, materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-medium">US Electricity Baseline (NETL)</p>
                    <p className="text-sm text-gray-600">Electricity generation emission factors by source</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium">NIST Building Systems</p>
                    <p className="text-sm text-gray-600">Construction materials - concrete, gypsum, insulation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Droplets className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium">USDA LCA Commons</p>
                    <p className="text-sm text-gray-600">Agricultural products - crops, livestock, irrigation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <TreePine className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-medium">USFS Forestry Products</p>
                    <p className="text-sm text-gray-600">Lumber, plywood, and forestry operations</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Federal LCA Commons</CardTitle>
              <CardDescription>
                Free, public life cycle assessment data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                The Federal LCA Commons is a collaborative platform maintained by U.S. government agencies 
                including NREL, USDA, EPA, DOE, and NIST. It provides free access to life cycle inventory 
                data for research and analysis.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">550+</p>
                  <p className="text-sm text-gray-600">USLCI Processes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">19,000+</p>
                  <p className="text-sm text-gray-600">Agricultural Datasets</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">Free</p>
                  <p className="text-sm text-gray-600">No API Key Required</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">JSON</p>
                  <p className="text-sm text-gray-600">REST API Format</p>
                </div>
              </div>
              <a 
                href="https://www.lcacommons.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline"
              >
                Visit Federal LCA Commons website
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
