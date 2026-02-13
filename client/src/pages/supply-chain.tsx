import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Globe2, Package, TrendingUp, ExternalLink, Database, BookOpen, Factory, Cpu, Car, Pill, Wheat, BatteryCharging } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface TradeFlow {
  from: { name: string; lat: number; lng: number; iso: string };
  to: { name: string; lat: number; lng: number; iso: string };
  value: number;
  percentage: number;
}

interface SectorData {
  name: string;
  icon: typeof Cpu;
  hsCode: string;
  description: string;
  totalTrade: number;
  year: number;
  topExporters: { country: string; value: number; share: number }[];
  topImporters: { country: string; value: number; share: number }[];
  tradeFlows: TradeFlow[];
  supplyChainSteps: { step: string; locations: string[]; description: string }[];
  climateRisks: string[];
}

const countryCoords: Record<string, { lat: number; lng: number }> = {
  "Taiwan": { lat: 23.6978, lng: 120.9605 },
  "South Korea": { lat: 35.9078, lng: 127.7669 },
  "China": { lat: 35.8617, lng: 104.1954 },
  "Japan": { lat: 36.2048, lng: 138.2529 },
  "United States": { lat: 37.0902, lng: -95.7129 },
  "Germany": { lat: 51.1657, lng: 10.4515 },
  "Malaysia": { lat: 4.2105, lng: 101.9758 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Vietnam": { lat: 14.0583, lng: 108.2772 },
  "Netherlands": { lat: 52.1326, lng: 5.2913 },
  "Mexico": { lat: 23.6345, lng: -102.5528 },
  "Ireland": { lat: 53.1424, lng: -7.6921 },
  "Philippines": { lat: 12.8797, lng: 121.7740 },
  "Thailand": { lat: 15.8700, lng: 100.9925 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
};

const sectorData: Record<string, SectorData> = {
  "semiconductors": {
    name: "Semiconductors & Integrated Circuits",
    icon: Cpu,
    hsCode: "HS 8541, 8542",
    description: "Electronic integrated circuits, processors, memory chips, and semiconductor devices",
    totalTrade: 876000000000,
    year: 2023,
    topExporters: [
      { country: "Taiwan", value: 182000000000, share: 20.8 },
      { country: "South Korea", value: 129000000000, share: 14.7 },
      { country: "China", value: 118000000000, share: 13.5 },
      { country: "Singapore", value: 87000000000, share: 9.9 },
      { country: "Malaysia", value: 72000000000, share: 8.2 },
      { country: "Japan", value: 58000000000, share: 6.6 },
      { country: "United States", value: 52000000000, share: 5.9 },
      { country: "Germany", value: 38000000000, share: 4.3 },
    ],
    topImporters: [
      { country: "China", value: 312000000000, share: 35.6 },
      { country: "Hong Kong", value: 98000000000, share: 11.2 },
      { country: "United States", value: 87000000000, share: 9.9 },
      { country: "Singapore", value: 68000000000, share: 7.8 },
      { country: "South Korea", value: 54000000000, share: 6.2 },
      { country: "Japan", value: 42000000000, share: 4.8 },
      { country: "Germany", value: 38000000000, share: 4.3 },
      { country: "Vietnam", value: 32000000000, share: 3.7 },
    ],
    tradeFlows: [
      { from: { name: "Taiwan", ...countryCoords["Taiwan"], iso: "TWN" }, to: { name: "China", ...countryCoords["China"], iso: "CHN" }, value: 68000000000, percentage: 37.4 },
      { from: { name: "Taiwan", ...countryCoords["Taiwan"], iso: "TWN" }, to: { name: "United States", ...countryCoords["United States"], iso: "USA" }, value: 24000000000, percentage: 13.2 },
      { from: { name: "South Korea", ...countryCoords["South Korea"], iso: "KOR" }, to: { name: "China", ...countryCoords["China"], iso: "CHN" }, value: 52000000000, percentage: 40.3 },
      { from: { name: "South Korea", ...countryCoords["South Korea"], iso: "KOR" }, to: { name: "Vietnam", ...countryCoords["Vietnam"], iso: "VNM" }, value: 18000000000, percentage: 14.0 },
      { from: { name: "Japan", ...countryCoords["Japan"], iso: "JPN" }, to: { name: "China", ...countryCoords["China"], iso: "CHN" }, value: 21000000000, percentage: 36.2 },
      { from: { name: "China", ...countryCoords["China"], iso: "CHN" }, to: { name: "Hong Kong", ...countryCoords["Hong Kong"], iso: "HKG" }, value: 42000000000, percentage: 35.6 },
      { from: { name: "Malaysia", ...countryCoords["Malaysia"], iso: "MYS" }, to: { name: "Singapore", ...countryCoords["Singapore"], iso: "SGP" }, value: 28000000000, percentage: 38.9 },
      { from: { name: "Singapore", ...countryCoords["Singapore"], iso: "SGP" }, to: { name: "China", ...countryCoords["China"], iso: "CHN" }, value: 32000000000, percentage: 36.8 },
      { from: { name: "Netherlands", ...countryCoords["Netherlands"], iso: "NLD" }, to: { name: "China", ...countryCoords["China"], iso: "CHN" }, value: 15000000000, percentage: 28.5 },
      { from: { name: "United States", ...countryCoords["United States"], iso: "USA" }, to: { name: "Mexico", ...countryCoords["Mexico"], iso: "MEX" }, value: 12000000000, percentage: 23.1 },
    ],
    supplyChainSteps: [
      { step: "Design", locations: ["United States", "Taiwan", "South Korea", "Japan"], description: "Chip architecture, IP design, EDA software" },
      { step: "Raw Materials", locations: ["Japan", "Germany", "United States"], description: "Silicon wafers, photoresists, specialty gases" },
      { step: "Equipment", locations: ["Netherlands (ASML)", "United States", "Japan"], description: "Lithography machines, deposition, etching" },
      { step: "Fabrication", locations: ["Taiwan (TSMC)", "South Korea (Samsung)", "United States (Intel)"], description: "Wafer processing, front-end manufacturing" },
      { step: "Assembly & Test", locations: ["Malaysia", "Philippines", "Vietnam", "China"], description: "Packaging, testing, quality control" },
      { step: "End Products", locations: ["China", "Vietnam", "Mexico", "United States"], description: "Consumer electronics, automotive, data centers" },
    ],
    climateRisks: [
      "Taiwan drought risk threatens fab water supply (each fab uses 150,000+ tons/day)",
      "Extreme heat events in Southeast Asia impact assembly operations",
      "Flooding risk in Malaysia and Thailand disrupts packaging facilities",
      "Energy transition affecting power-intensive fab operations",
      "Sea level rise threatens coastal manufacturing hubs",
    ],
  },
  "ev-batteries": {
    name: "EV Batteries & Components",
    icon: BatteryCharging,
    hsCode: "HS 8507.60",
    description: "Lithium-ion batteries for electric vehicles and energy storage",
    totalTrade: 156000000000,
    year: 2023,
    topExporters: [
      { country: "China", value: 65000000000, share: 41.7 },
      { country: "South Korea", value: 28000000000, share: 17.9 },
      { country: "Japan", value: 18000000000, share: 11.5 },
      { country: "Germany", value: 12000000000, share: 7.7 },
      { country: "Poland", value: 8000000000, share: 5.1 },
    ],
    topImporters: [
      { country: "United States", value: 32000000000, share: 20.5 },
      { country: "Germany", value: 28000000000, share: 17.9 },
      { country: "South Korea", value: 15000000000, share: 9.6 },
      { country: "Japan", value: 12000000000, share: 7.7 },
      { country: "Netherlands", value: 10000000000, share: 6.4 },
    ],
    tradeFlows: [
      { from: { name: "China", ...countryCoords["China"], iso: "CHN" }, to: { name: "United States", ...countryCoords["United States"], iso: "USA" }, value: 18000000000, percentage: 27.7 },
      { from: { name: "China", ...countryCoords["China"], iso: "CHN" }, to: { name: "Germany", ...countryCoords["Germany"], iso: "DEU" }, value: 15000000000, percentage: 23.1 },
      { from: { name: "South Korea", ...countryCoords["South Korea"], iso: "KOR" }, to: { name: "United States", ...countryCoords["United States"], iso: "USA" }, value: 12000000000, percentage: 42.9 },
      { from: { name: "Japan", ...countryCoords["Japan"], iso: "JPN" }, to: { name: "United States", ...countryCoords["United States"], iso: "USA" }, value: 8000000000, percentage: 44.4 },
    ],
    supplyChainSteps: [
      { step: "Mining", locations: ["Australia (Lithium)", "Chile (Lithium)", "DRC (Cobalt)", "Indonesia (Nickel)"], description: "Critical mineral extraction" },
      { step: "Processing", locations: ["China (80% of global)", "South Korea", "Japan"], description: "Refining lithium, cobalt, nickel into battery-grade materials" },
      { step: "Cell Manufacturing", locations: ["China (CATL, BYD)", "South Korea (LG, Samsung SDI)", "Japan (Panasonic)"], description: "Electrode production, cell assembly" },
      { step: "Pack Assembly", locations: ["Germany", "United States", "China"], description: "Battery pack integration, BMS" },
      { step: "Vehicle Integration", locations: ["Germany", "China", "United States", "Japan"], description: "Final vehicle assembly" },
    ],
    climateRisks: [
      "Mining regions face water stress and extreme weather",
      "Cobalt supply concentration in politically unstable DRC",
      "Shipping disruptions from extreme weather events",
      "Processing in China depends on coal-heavy grid",
    ],
  },
};

const academicResources = [
  {
    name: "OECD TiVA (Trade in Value Added)",
    description: "Measures value added by each country in global value chains. Shows where value is actually created, not just where goods cross borders.",
    url: "https://www.oecd.org/sti/ind/measuring-trade-in-value-added.htm",
    type: "database",
  },
  {
    name: "GTAP (Global Trade Analysis Project)",
    description: "Comprehensive global database for quantitative analysis of trade policy. Used by governments and researchers worldwide.",
    url: "https://www.gtap.agecon.purdue.edu/",
    type: "model",
  },
  {
    name: "EORA Multi-Region Input-Output",
    description: "Full global supply chain database covering 190 countries and 26 sectors. Includes environmental satellite accounts.",
    url: "https://worldmrio.com/",
    type: "database",
  },
  {
    name: "World Input-Output Database (WIOD)",
    description: "Time series of world input-output tables covering 43 countries and 56 sectors from 2000-2014.",
    url: "https://www.rug.nl/ggdc/valuechain/wiod/",
    type: "database",
  },
  {
    name: "UN Comtrade",
    description: "Official international trade statistics. Over 3 billion records of trade flows between countries by commodity.",
    url: "https://comtradeplus.un.org/",
    type: "data",
  },
  {
    name: "WTO Trade Data",
    description: "World Trade Organization statistics on merchandise and services trade, tariffs, and trade policy.",
    url: "https://data.wto.org/",
    type: "data",
  },
  {
    name: "CEPII BACI",
    description: "Reconciled bilateral trade flows at HS 6-digit level. Harmonizes UN Comtrade data for research use.",
    url: "http://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37",
    type: "database",
  },
  {
    name: "Harvard Atlas of Economic Complexity",
    description: "Interactive visualization of global trade patterns and economic complexity metrics.",
    url: "https://atlas.cid.harvard.edu/",
    type: "visualization",
  },
];

const formatValue = (value: number) => {
  if (value >= 1000000000000) return `$${(value / 1000000000000).toFixed(1)}T`;
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(0)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
};

const getFlowColor = (percentage: number) => {
  if (percentage > 35) return "#ef4444";
  if (percentage > 20) return "#f97316";
  return "#22c55e";
};

const getFlowWeight = (value: number, maxValue: number) => {
  return Math.max(2, (value / maxValue) * 8);
};

export default function SupplyChainPage() {
  const [selectedSector, setSelectedSector] = useState<string>("semiconductors");
  const sector = sectorData[selectedSector];
  const SectorIcon = sector?.icon || Package;

  const maxFlowValue = Math.max(...(sector?.tradeFlows.map(f => f.value) || [1]));

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">Supply Chain Intelligence</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Global Trade Flow Mapping</CardTitle>
            <CardDescription>
              Visualize international trade flows and supply chain dependencies using real data from 
              UN Comtrade and academic input-output models. Identify climate-related supply chain risks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Sector</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semiconductors">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Semiconductors & ICs
                      </div>
                    </SelectItem>
                    <SelectItem value="ev-batteries">
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="w-4 h-4" />
                        EV Batteries
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">HS Code:</span> {sector?.hsCode} | <span className="font-medium">Year:</span> {sector?.year}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="map">Trade Flow Map</TabsTrigger>
            <TabsTrigger value="exporters">Top Exporters</TabsTrigger>
            <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
            <TabsTrigger value="climate">Climate Risks</TabsTrigger>
            <TabsTrigger value="resources">Data Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <SectorIcon className="w-5 h-5 text-indigo-600" />
                      {sector?.name} - Global Trade Flows
                    </CardTitle>
                    <CardDescription>
                      Total trade: {formatValue(sector?.totalTrade || 0)} ({sector?.year})
                    </CardDescription>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>&lt;20% share</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span>20-35% share</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>&gt;35% share</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] rounded-lg overflow-hidden border">
                  <MapContainer
                    center={[20, 100]}
                    zoom={2}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {sector?.tradeFlows.map((flow, index) => (
                      <Polyline
                        key={index}
                        positions={[
                          [flow.from.lat, flow.from.lng],
                          [flow.to.lat, flow.to.lng]
                        ]}
                        pathOptions={{
                          color: getFlowColor(flow.percentage),
                          weight: getFlowWeight(flow.value, maxFlowValue),
                          opacity: 0.7,
                        }}
                      >
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{flow.from.name} → {flow.to.name}</p>
                            <p>Value: {formatValue(flow.value)}</p>
                            <p>Share of exports: {flow.percentage}%</p>
                          </div>
                        </Popup>
                      </Polyline>
                    ))}

                    {sector?.topExporters.slice(0, 8).map((exporter, index) => {
                      const coords = countryCoords[exporter.country];
                      if (!coords) return null;
                      return (
                        <CircleMarker
                          key={`exp-${index}`}
                          center={[coords.lat, coords.lng]}
                          radius={Math.max(8, exporter.share / 2)}
                          pathOptions={{
                            color: "#3b82f6",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.7,
                          }}
                        >
                          <Tooltip permanent={false}>
                            <span className="font-medium">{exporter.country}</span><br/>
                            Exports: {formatValue(exporter.value)} ({exporter.share}%)
                          </Tooltip>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Data source: UN Comtrade (HS codes {sector?.hsCode}). Trade flows show major bilateral relationships.
                  Circle size indicates export volume. Line thickness indicates trade value.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exporters">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Top Exporters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sector?.topExporters.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium">{item.country}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatValue(item.value)}</div>
                          <div className="text-xs text-gray-500">{item.share}% share</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Top Importers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sector?.topImporters.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium">{item.country}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatValue(item.value)}</div>
                          <div className="text-xs text-gray-500">{item.share}% share</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="supply-chain">
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Stages</CardTitle>
                <CardDescription>
                  Key production stages and geographic concentration for {sector?.name.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {sector?.supplyChainSteps.map((step, index) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-2 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900">{step.step}</h4>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {step.locations.map((loc, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {loc}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="climate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <Factory className="w-5 h-5" />
                  Climate-Related Supply Chain Risks
                </CardTitle>
                <CardDescription>
                  Physical and transition risks affecting the {sector?.name.toLowerCase()} supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sector?.climateRisks.map((risk, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-medium shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{risk}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Linking to Physical Risk Analysis</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Use our Physical Risk Screening tool to assess climate hazards at specific manufacturing locations.
                  </p>
                  <Link href="/physical-risk">
                    <Button variant="outline" size="sm" className="border-blue-400 text-blue-700">
                      <Globe2 className="w-4 h-4 mr-2" />
                      Open Physical Risk Screening
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Academic Models & Data Sources
                </CardTitle>
                <CardDescription>
                  Authoritative sources for global trade and supply chain analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {academicResources.map((resource, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            resource.type === "database" ? "bg-blue-100 text-blue-700" :
                            resource.type === "model" ? "bg-purple-100 text-purple-700" :
                            resource.type === "visualization" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {resource.type === "database" ? <Database className="w-5 h-5" /> :
                             resource.type === "model" ? <Factory className="w-5 h-5" /> :
                             resource.type === "visualization" ? <TrendingUp className="w-5 h-5" /> :
                             <BookOpen className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mt-2"
                            >
                              Visit Resource
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <Badge variant="secondary" className="capitalize shrink-0">
                            {resource.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Notes</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Trade values are based on UN Comtrade 2023 data (HS 6-digit classification)</li>
                    <li>• Flow percentages show share of exporter's total sector exports</li>
                    <li>• Supply chain mapping reflects major production hubs; actual chains are more complex</li>
                    <li>• For live API access, register at <a href="https://comtradedeveloper.un.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">UN Comtrade Developer Portal</a> (500 free calls/day)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
