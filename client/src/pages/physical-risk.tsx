import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, MapPin, Upload, Download, Layers, Cloud, Droplets, Thermometer, Wind, AlertTriangle, Plus, Trash2, RefreshCw, Info, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface PhysicalRiskIndicator {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: string;
  source: "cmip" | "isimip";
}

interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

interface RiskDataPoint {
  locationId: string;
  indicatorId: string;
  scenario: string;
  timePeriod: string;
  value: number;
  riskLevel: "low" | "medium" | "high" | "very_high" | "extreme";
  percentile?: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
}

interface TimePeriod {
  id: string;
  name: string;
  midpoint: number;
}

interface GridDataPoint {
  lat: number;
  lng: number;
  value: number;
  riskLevel: string;
}

const riskLevelColors: { [key: string]: string } = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  very_high: "#ef4444",
  extreme: "#7c2d12"
};

const riskLevelBadgeVariants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  low: "secondary",
  medium: "outline",
  high: "default",
  very_high: "destructive",
  extreme: "destructive"
};

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function RiskOverlay({ gridData, opacity }: { gridData: GridDataPoint[]; opacity: number }) {
  if (!gridData.length) return null;
  
  return (
    <>
      {gridData.map((point, index) => (
        <Rectangle
          key={index}
          bounds={[
            [point.lat - 2.5, point.lng - 2.5],
            [point.lat + 2.5, point.lng + 2.5]
          ]}
          pathOptions={{
            color: "transparent",
            fillColor: riskLevelColors[point.riskLevel] || "#gray",
            fillOpacity: opacity * 0.5
          }}
        />
      ))}
    </>
  );
}

export default function PhysicalRiskPage() {
  const { toast } = useToast();
  const [dataSource, setDataSource] = useState<"cmip" | "isimip">("cmip");
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("2050");
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [riskData, setRiskData] = useState<RiskDataPoint[]>([]);
  const [gridData, setGridData] = useState<GridDataPoint[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.6);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [locationInput, setLocationInput] = useState({
    name: "",
    latitude: "",
    longitude: "",
    country: ""
  });
  const [bulkInput, setBulkInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: indicators = [] } = useQuery<PhysicalRiskIndicator[]>({
    queryKey: ["/api/physical-risk/indicators", dataSource],
    queryFn: () => fetch(`/api/physical-risk/indicators?source=${dataSource}`).then(r => r.json())
  });

  const { data: scenarios = [] } = useQuery<Scenario[]>({
    queryKey: ["/api/physical-risk/scenarios", dataSource],
    queryFn: () => fetch(`/api/physical-risk/scenarios?source=${dataSource}`).then(r => r.json())
  });

  const { data: timePeriods = [] } = useQuery<TimePeriod[]>({
    queryKey: ["/api/physical-risk/time-periods"],
    queryFn: () => fetch("/api/physical-risk/time-periods").then(r => r.json())
  });

  useEffect(() => {
    if (scenarios.length > 0 && !selectedScenario) {
      setSelectedScenario(scenarios[0].id);
    }
  }, [scenarios, selectedScenario]);

  useEffect(() => {
    setSelectedIndicators([]);
    setRiskData([]);
    setGridData([]);
  }, [dataSource]);

  const fetchGridData = useCallback(async () => {
    if (!selectedIndicators.length || !selectedScenario || !selectedTimePeriod) return;
    
    try {
      const response = await fetch(
        `/api/physical-risk/grid?indicatorId=${selectedIndicators[0]}&scenario=${selectedScenario}&timePeriod=${selectedTimePeriod}&source=${dataSource}&resolution=5`
      );
      const data = await response.json();
      setGridData(data);
    } catch (error) {
      console.error("Failed to fetch grid data:", error);
    }
  }, [selectedIndicators, selectedScenario, selectedTimePeriod, dataSource]);

  useEffect(() => {
    if (showOverlay && selectedIndicators.length > 0) {
      fetchGridData();
    }
  }, [showOverlay, selectedIndicators, selectedScenario, selectedTimePeriod, dataSource, fetchGridData]);

  const analyzeLocations = async () => {
    if (!locations.length) {
      toast({
        title: "No locations",
        description: "Please add at least one location to analyze.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedIndicators.length) {
      toast({
        title: "No indicators selected",
        description: "Please select at least one physical risk indicator.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiRequest("POST", "/api/physical-risk/analyze", {
        source: dataSource,
        locations,
        indicatorIds: selectedIndicators,
        scenario: selectedScenario,
        timePeriod: selectedTimePeriod
      });
      
      const data = await response.json();
      setRiskData(data.riskData);
      
      if (locations.length > 0) {
        const avgLat = locations.reduce((sum, l) => sum + l.latitude, 0) / locations.length;
        const avgLng = locations.reduce((sum, l) => sum + l.longitude, 0) / locations.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(4);
      }
      
      toast({
        title: "Analysis complete",
        description: `Analyzed ${locations.length} locations for ${selectedIndicators.length} indicators.`
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze physical risk data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addLocation = () => {
    const lat = parseFloat(locationInput.latitude);
    const lng = parseFloat(locationInput.longitude);
    
    if (!locationInput.name || isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid name, latitude, and longitude.",
        variant: "destructive"
      });
      return;
    }

    const newLocation: LocationData = {
      id: `loc_${Date.now()}`,
      name: locationInput.name,
      latitude: lat,
      longitude: lng,
      country: locationInput.country || undefined
    };

    setLocations(prev => [...prev, newLocation]);
    setLocationInput({ name: "", latitude: "", longitude: "", country: "" });
  };

  const removeLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    setRiskData(prev => prev.filter(r => r.locationId !== id));
  };

  const parseBulkLocations = () => {
    const lines = bulkInput.trim().split("\n");
    const newLocations: LocationData[] = [];
    
    for (const line of lines) {
      const parts = line.split(/[,\t]/).map(p => p.trim());
      if (parts.length >= 3) {
        const lat = parseFloat(parts[1]);
        const lng = parseFloat(parts[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          newLocations.push({
            id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: parts[0],
            latitude: lat,
            longitude: lng,
            country: parts[3] || undefined
          });
        }
      }
    }

    if (newLocations.length > 0) {
      setLocations(prev => [...prev, ...newLocations]);
      setBulkInput("");
      toast({
        title: "Locations added",
        description: `Added ${newLocations.length} locations from bulk input.`
      });
    } else {
      toast({
        title: "No valid locations",
        description: "Could not parse any valid locations. Format: Name, Latitude, Longitude, Country (optional)",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setBulkInput(text);
    };
    reader.readAsText(file);
  };

  const downloadResults = () => {
    if (!riskData.length) {
      toast({
        title: "No data",
        description: "Please analyze locations first before downloading.",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Location", "Country", "Latitude", "Longitude", "Indicator", "Value", "Unit", "Risk Level", "Scenario", "Time Period"];
    const rows = riskData.map(rd => {
      const location = locations.find(l => l.id === rd.locationId);
      const indicator = indicators.find(i => i.id === rd.indicatorId);
      return [
        location?.name || "",
        location?.country || "",
        location?.latitude || "",
        location?.longitude || "",
        indicator?.name || rd.indicatorId,
        rd.value,
        indicator?.unit || "",
        rd.riskLevel,
        rd.scenario,
        rd.timePeriod
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `physical_risk_analysis_${selectedScenario}_${selectedTimePeriod}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicatorId)
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "temperature":
      case "extreme":
        return <Thermometer className="w-4 h-4" />;
      case "precipitation":
      case "flood":
        return <Droplets className="w-4 h-4" />;
      case "drought":
      case "water":
        return <Cloud className="w-4 h-4" />;
      case "storm":
        return <Wind className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskForLocation = (locationId: string, indicatorId: string) => {
    return riskData.find(r => r.locationId === locationId && r.indicatorId === indicatorId);
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
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Globe className="text-blue-600 w-6 h-6" />
                <h1 className="text-xl font-semibold text-gray-900">Physical Risk Screening</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={analyzeLocations} disabled={isAnalyzing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
              <Button variant="default" size="sm" onClick={downloadResults} disabled={!riskData.length}>
                <Download className="w-4 h-4 mr-2" />
                Download Results
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Data Source Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-600" />
                  Data Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={dataSource} onValueChange={(v: "cmip" | "isimip") => setDataSource(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cmip">CMIP6 (Open-Meteo)</SelectItem>
                    <SelectItem value="isimip">ISIMIP (PIK Potsdam)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  {dataSource === "cmip" 
                    ? "Real CMIP6 climate model projections from MRI-AGCM3-2-S via Open-Meteo API"
                    : "ISIMIP sectoral impact projections from Potsdam Institute"}
                </p>
              </CardContent>
            </Card>

            {/* Scenario & Time Period */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Scenario & Time Horizon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Climate Scenario</Label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} - {s.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time Period</Label>
                  <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      {timePeriods.map(tp => (
                        <SelectItem key={tp.id} value={tp.id}>
                          {tp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Indicators Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Physical Risk Indicators</CardTitle>
                <CardDescription>Select indicators to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {indicators.map(indicator => (
                    <div
                      key={indicator.id}
                      className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleIndicator(indicator.id)}
                    >
                      <Checkbox
                        checked={selectedIndicators.includes(indicator.id)}
                        onCheckedChange={() => toggleIndicator(indicator.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(indicator.category)}
                          <span className="text-sm font-medium">{indicator.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{indicator.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedIndicators.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      {selectedIndicators.length} indicator{selectedIndicators.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map Overlay Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Map Display</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={showOverlay}
                    onCheckedChange={(checked) => setShowOverlay(checked as boolean)}
                  />
                  <Label className="text-sm">Show risk overlay</Label>
                </div>
                {showOverlay && (
                  <div>
                    <Label className="text-sm">Overlay Opacity</Label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Map & Locations */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Physical Risk Map
                  </span>
                  {selectedIndicators.length > 0 && selectedScenario && (
                    <Badge variant="outline">
                      {indicators.find(i => i.id === selectedIndicators[0])?.name || selectedIndicators[0]} | {selectedScenario.toUpperCase()} | {selectedTimePeriod}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-lg overflow-hidden border">
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={mapCenter} zoom={mapZoom} />
                    
                    {showOverlay && <RiskOverlay gridData={gridData} opacity={overlayOpacity} />}
                    
                    {locations.map(location => {
                      const locationRisk = riskData.filter(r => r.locationId === location.id);
                      const avgRiskLevel = locationRisk.length > 0
                        ? locationRisk.reduce((sum, r) => {
                            const levels = { low: 1, medium: 2, high: 3, very_high: 4, extreme: 5 };
                            return sum + (levels[r.riskLevel] || 2);
                          }, 0) / locationRisk.length
                        : 2;
                      
                      const colors = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#7c2d12"];
                      const colorIndex = Math.min(Math.floor(avgRiskLevel) - 1, 4);
                      
                      return (
                        <CircleMarker
                          key={location.id}
                          center={[location.latitude, location.longitude]}
                          radius={10}
                          pathOptions={{
                            color: colors[colorIndex] || "#666",
                            fillColor: colors[colorIndex] || "#666",
                            fillOpacity: 0.8
                          }}
                        >
                          <Popup>
                            <div className="min-w-[240px]">
                              <h4 className="font-semibold text-base">{location.name}</h4>
                              {location.country && (
                                <p className="text-sm text-gray-500">{location.country}</p>
                              )}
                              <p className="text-xs text-gray-400 mb-2">
                                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                              </p>
                              {locationRisk.length > 0 ? (
                                <div className="border-t pt-2 space-y-2">
                                  <p className="text-xs font-medium text-gray-600 uppercase">Risk Indicators</p>
                                  {locationRisk.map(r => {
                                    const ind = indicators.find(i => i.id === r.indicatorId);
                                    const riskColor = riskLevelColors[r.riskLevel] || "#666";
                                    const riskLabel = r.riskLevel.replace("_", " ");
                                    return (
                                      <div key={r.indicatorId} className="flex items-start justify-between text-sm bg-gray-50 rounded p-2">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{ind?.name || r.indicatorId}</p>
                                          <p className="text-gray-600">{r.value} {ind?.unit}</p>
                                        </div>
                                        <div className="flex items-center ml-2">
                                          <div
                                            className="w-4 h-4 rounded mr-1.5 flex-shrink-0"
                                            style={{ backgroundColor: riskColor }}
                                          />
                                          <span className="text-xs capitalize whitespace-nowrap" style={{ color: riskColor }}>
                                            {riskLabel}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 italic">Run analysis to see risk scores</p>
                              )}
                            </div>
                          </Popup>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </div>
                
                {/* Legend */}
                <div className="mt-3 flex items-center justify-center space-x-4 text-sm">
                  <span className="text-gray-500">Risk Level:</span>
                  {Object.entries(riskLevelColors).map(([level, color]) => (
                    <div key={level} className="flex items-center space-x-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="capitalize">{level.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Management */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Asset Locations</CardTitle>
                <CardDescription>Add locations to analyze for physical risk exposure</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual">
                    <div className="grid grid-cols-5 gap-2">
                      <Input
                        placeholder="Location name"
                        value={locationInput.name}
                        onChange={(e) => setLocationInput(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Latitude"
                        type="number"
                        step="any"
                        value={locationInput.latitude}
                        onChange={(e) => setLocationInput(prev => ({ ...prev, latitude: e.target.value }))}
                      />
                      <Input
                        placeholder="Longitude"
                        type="number"
                        step="any"
                        value={locationInput.longitude}
                        onChange={(e) => setLocationInput(prev => ({ ...prev, longitude: e.target.value }))}
                      />
                      <Input
                        placeholder="Country (optional)"
                        value={locationInput.country}
                        onChange={(e) => setLocationInput(prev => ({ ...prev, country: e.target.value }))}
                      />
                      <Button onClick={addLocation}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bulk">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm" asChild>
                          <label>
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </label>
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Paste locations (one per line): Name, Latitude, Longitude, Country"
                        value={bulkInput}
                        onChange={(e) => setBulkInput(e.target.value)}
                        rows={4}
                      />
                      <Button onClick={parseBulkLocations} disabled={!bulkInput.trim()}>
                        Parse Locations
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Locations Table */}
                {locations.length > 0 && (
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Coordinates</TableHead>
                          <TableHead>Country</TableHead>
                          {selectedIndicators.slice(0, 3).map(indId => {
                            const ind = indicators.find(i => i.id === indId);
                            return (
                              <TableHead key={indId} className="text-center">
                                {ind?.name || indId}
                              </TableHead>
                            );
                          })}
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {locations.map(location => (
                          <TableRow key={location.id}>
                            <TableCell className="font-medium">{location.name}</TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                            </TableCell>
                            <TableCell>{location.country || "-"}</TableCell>
                            {selectedIndicators.slice(0, 3).map(indId => {
                              const risk = getRiskForLocation(location.id, indId);
                              const ind = indicators.find(i => i.id === indId);
                              return (
                                <TableCell key={indId} className="text-center">
                                  {risk ? (
                                    <Badge variant={riskLevelBadgeVariants[risk.riskLevel]}>
                                      {risk.value} {ind?.unit}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLocation(location.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {locations.length === 0 && (
                  <div className="mt-4 text-center py-8 bg-gray-50 rounded-lg">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No locations added yet</p>
                    <p className="text-sm text-gray-400">Add locations manually or import from a file</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">About Physical Risk Data</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {dataSource === "cmip" ? (
                        <>
                          <strong>CMIP6</strong> provides real climate model projections from the MRI-AGCM3-2-S high-resolution model via Open-Meteo API. 
                          Temperature values show warming anomaly relative to 1950-1980 baseline.
                        </>
                      ) : (
                        <>
                          <strong>ISIMIP</strong> provides sectoral climate impact projections from the Potsdam Institute. 
                          Data includes flood risk, drought, water stress, and agricultural impacts based on multiple climate models.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
