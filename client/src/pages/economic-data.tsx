import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Database, TrendingUp, Globe, Building2, BarChart3, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

interface EconomicDataPoint {
  date: string;
  value: number | null;
  source: string;
  seriesId: string;
  seriesName: string;
  units?: string;
  frequency?: string;
}

interface EconomicSeries {
  id: string;
  name: string;
  description: string;
  source: string;
  category: string;
  units: string;
  frequency: string;
}

interface DataSourceStatus {
  source: string;
  available: boolean;
  lastChecked: string;
  error?: string;
}

const SOURCE_COLORS: Record<string, string> = {
  FRED: '#3B82F6',
  BEA: '#10B981',
  IMF: '#8B5CF6',
  OECD: '#F59E0B',
  DBnomics: '#EC4899',
  'Data.gov': '#6366F1'
};

const SOURCE_ICONS: Record<string, typeof Database> = {
  FRED: Building2,
  BEA: BarChart3,
  IMF: Globe,
  OECD: TrendingUp,
  DBnomics: Database,
  'Data.gov': Database
};

export default function EconomicDataPage() {
  const [selectedSource, setSelectedSource] = useState<string>("FRED");
  const [selectedSeries, setSelectedSeries] = useState<string>("DCOILWTICO");
  const [chartType, setChartType] = useState<"line" | "area">("line");

  const { data: statusData, isLoading: statusLoading } = useQuery<{ sources: DataSourceStatus[] }>({
    queryKey: ["/api/economic/status"],
  });

  const { data: seriesData } = useQuery<{ series: EconomicSeries[] }>({
    queryKey: ["/api/economic/series"],
  });

  const getApiEndpoint = () => {
    switch (selectedSource) {
      case 'FRED':
        return `/api/economic/fred/${selectedSeries}`;
      case 'BEA':
        return `/api/economic/bea/NIPA/T10101`;
      case 'IMF':
        return `/api/economic/imf/${selectedSeries}`;
      case 'OECD':
        return `/api/economic/oecd/${selectedSeries}`;
      case 'DBnomics':
        return `/api/economic/dbnomics?seriesId=${encodeURIComponent(selectedSeries)}`;
      case 'Data.gov':
        return `/api/economic/datagov/${selectedSeries}`;
      default:
        return `/api/economic/fred/${selectedSeries}`;
    }
  };

  const { data: chartData, isLoading: chartLoading, refetch } = useQuery<{ data: EconomicDataPoint[] }>({
    queryKey: ["/api/economic/data", selectedSource, selectedSeries],
    queryFn: async () => {
      const res = await fetch(getApiEndpoint());
      return res.json();
    },
    enabled: !!selectedSeries
  });

  const { data: climateData, isLoading: climateLoading } = useQuery<{
    energy: EconomicDataPoint[];
    economic: EconomicDataPoint[];
    emissions: EconomicDataPoint[];
  }>({
    queryKey: ["/api/economic/climate-data"],
  });

  const filteredSeries = seriesData?.series?.filter(s => s.source === selectedSource) || [];

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

  const formattedData = formatChartData(chartData?.data);
  const energyData = formatChartData(climateData?.energy?.filter(d => d.seriesId === 'DCOILWTICO'));
  const gdpData = formatChartData(climateData?.economic?.filter(d => d.seriesId === 'GDP'));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Database className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Economic Data Explorer</h1>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              6 Data Sources Connected
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {statusData?.sources?.map((source) => {
            const Icon = SOURCE_ICONS[source.source] || Database;
            return (
              <Card 
                key={source.source} 
                className={`cursor-pointer transition-all ${selectedSource === source.source ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => {
                  setSelectedSource(source.source);
                  const firstSeries = seriesData?.series?.find(s => s.source === source.source);
                  if (firstSeries) setSelectedSeries(firstSeries.id);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" style={{ color: SOURCE_COLORS[source.source] }} />
                    {source.available ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm">{source.source}</h3>
                  <p className="text-xs text-gray-500">
                    {source.available ? 'Available' : 'Sample Data'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="explorer" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="explorer">Data Explorer</TabsTrigger>
            <TabsTrigger value="climate">Climate Indicators</TabsTrigger>
            <TabsTrigger value="compare">Compare Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="explorer" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Data Series</CardTitle>
                  <CardDescription>Select a series from {selectedSource}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSeries.map((series) => (
                        <SelectItem key={series.id} value={series.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{series.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chart Type</label>
                    <Select value={chartType} onValueChange={(v) => setChartType(v as "line" | "area")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={() => refetch()} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>

                  {chartData?.data?.[0] && (
                    <div className="pt-4 border-t space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Source:</span>
                        <span className="font-medium">{chartData.data[0].source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Frequency:</span>
                        <span>{chartData.data[0].frequency || 'Various'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Points:</span>
                        <span>{formattedData.length}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{filteredSeries.find(s => s.id === selectedSeries)?.name || selectedSeries}</span>
                    <Badge style={{ backgroundColor: SOURCE_COLORS[selectedSource] }}>
                      {selectedSource}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {filteredSeries.find(s => s.id === selectedSeries)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {chartLoading ? (
                    <div className="h-80 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                  ) : formattedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      {chartType === 'line' ? (
                        <LineChart data={formattedData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="displayDate" 
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value: number) => [value.toLocaleString(), 'Value']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={SOURCE_COLORS[selectedSource]} 
                            strokeWidth={2}
                            dot={false}
                            name={filteredSeries.find(s => s.id === selectedSeries)?.name || 'Value'}
                          />
                        </LineChart>
                      ) : (
                        <AreaChart data={formattedData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="displayDate" 
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value: number) => [value.toLocaleString(), 'Value']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={SOURCE_COLORS[selectedSource]} 
                            fill={SOURCE_COLORS[selectedSource]}
                            fillOpacity={0.3}
                            name={filteredSeries.find(s => s.id === selectedSeries)?.name || 'Value'}
                          />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-500">
                      No data available for this series
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="climate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-amber-500" />
                    Crude Oil Prices (WTI)
                  </CardTitle>
                  <CardDescription>Key energy market indicator from FRED</CardDescription>
                </CardHeader>
                <CardContent>
                  {climateLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} />
                        <Area type="monotone" dataKey="value" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                    US GDP
                  </CardTitle>
                  <CardDescription>Gross Domestic Product from FRED</CardDescription>
                </CardHeader>
                <CardContent>
                  {climateLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={gdpData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number) => [`$${(value / 1000).toFixed(1)}T`, 'GDP']} />
                        <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Climate-Relevant Economic Indicators</CardTitle>
                <CardDescription>
                  Key economic data for climate risk analysis from FRED, IMF, and other sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Oil Price', value: energyData[energyData.length - 1]?.value, unit: '$/barrel', trend: 'up' },
                    { name: 'GDP', value: gdpData[gdpData.length - 1]?.value, unit: 'B USD', trend: 'up' },
                    { name: 'Industrial Production', value: 111.2, unit: 'Index', trend: 'stable' },
                    { name: 'Energy CPI', value: 285.4, unit: 'Index', trend: 'up' },
                  ].map((indicator, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">{indicator.name}</p>
                      <p className="text-2xl font-bold">
                        {typeof indicator.value === 'number' 
                          ? indicator.value > 1000 
                            ? `${(indicator.value / 1000).toFixed(1)}K`
                            : indicator.value.toFixed(1)
                          : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-400">{indicator.unit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Source Comparison</CardTitle>
                <CardDescription>
                  Compare coverage and availability across different economic data providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Source</th>
                        <th className="text-left py-3 px-4">Coverage</th>
                        <th className="text-left py-3 px-4">Update Frequency</th>
                        <th className="text-left py-3 px-4">API Key Required</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { source: 'FRED', coverage: 'US Federal Reserve Data', frequency: 'Daily/Monthly', apiKey: true },
                        { source: 'BEA', coverage: 'US Economic Accounts', frequency: 'Quarterly/Annual', apiKey: true },
                        { source: 'IMF', coverage: 'International Financial Statistics', frequency: 'Annual', apiKey: false },
                        { source: 'OECD', coverage: 'OECD Member Countries', frequency: 'Monthly/Annual', apiKey: false },
                        { source: 'DBnomics', coverage: 'Aggregated Global Data', frequency: 'Various', apiKey: false },
                        { source: 'Data.gov', coverage: 'US Government Open Data', frequency: 'Various', apiKey: false },
                      ].map((row) => {
                        const status = statusData?.sources?.find(s => s.source === row.source);
                        return (
                          <tr key={row.source} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: SOURCE_COLORS[row.source] }}
                                />
                                <span className="font-medium">{row.source}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{row.coverage}</td>
                            <td className="py-3 px-4 text-gray-600">{row.frequency}</td>
                            <td className="py-3 px-4">
                              {row.apiKey ? (
                                <Badge variant="outline" className="text-amber-600 border-amber-200">Required</Badge>
                              ) : (
                                <Badge variant="outline" className="text-green-600 border-green-200">Not Required</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {status?.available ? (
                                <Badge className="bg-green-100 text-green-700">Connected</Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-700">Sample Data</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Series by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['energy', 'economic', 'emissions'].map((category) => {
                      const count = seriesData?.series?.filter(s => s.category === category).length || 0;
                      return (
                        <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="capitalize font-medium">{category}</span>
                          <Badge variant="secondary">{count} series</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Configuration</CardTitle>
                  <CardDescription>Configure API keys to access live data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">FRED API Key</p>
                        <p className="text-xs text-gray-500">Federal Reserve Economic Data</p>
                      </div>
                      {statusData?.sources?.find(s => s.source === 'FRED')?.available ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Badge variant="outline">Not Set</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">BEA API Key</p>
                        <p className="text-xs text-gray-500">Bureau of Economic Analysis</p>
                      </div>
                      {statusData?.sources?.find(s => s.source === 'BEA')?.available ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Badge variant="outline">Not Set</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Note: IMF, OECD, DBnomics, and Data.gov APIs are free and don't require API keys.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
