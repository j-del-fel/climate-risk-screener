import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Leaf, Factory, Flame, Zap, Truck, Recycle, Info, BookOpen, Target, BarChart3, Layers, CheckCircle2, ChevronDown, ChevronUp, Globe, Droplets, Wind, Pickaxe, Package, ShoppingCart, Trash2, Calculator } from "lucide-react";

interface ProductionStep {
  name: string;
  description: string;
  emissions: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
  details: string;
}

const steelProductionSteps: ProductionStep[] = [
  {
    name: "Iron Ore Mining & Transport",
    description: "Extraction and transport of raw iron ore",
    emissions: 0.15,
    percentage: 8,
    icon: <Truck className="w-6 h-6" />,
    color: "bg-amber-500",
    details: "Mining operations use heavy diesel equipment. Iron ore is typically transported by rail or ship to processing facilities."
  },
  {
    name: "Coke Production",
    description: "Converting coal to coke for blast furnace",
    emissions: 0.25,
    percentage: 13,
    icon: <Flame className="w-6 h-6" />,
    color: "bg-orange-500",
    details: "Metallurgical coal is heated to 1000°C+ in coke ovens. This releases volatile gases and creates carbon-rich coke used as both fuel and reducing agent."
  },
  {
    name: "Blast Furnace (Iron Making)",
    description: "Reducing iron ore to molten iron",
    emissions: 1.05,
    percentage: 55,
    icon: <Factory className="w-6 h-6" />,
    color: "bg-red-600",
    details: "The largest emission source. Carbon from coke reacts with iron oxide (Fe₂O₃ + 3CO → 2Fe + 3CO₂). Furnaces operate at 2000°C."
  },
  {
    name: "Basic Oxygen Furnace",
    description: "Converting iron to steel",
    emissions: 0.18,
    percentage: 9,
    icon: <Zap className="w-6 h-6" />,
    color: "bg-blue-500",
    details: "Pure oxygen is blown into molten iron to reduce carbon content. Some natural gas may be used for temperature control."
  },
  {
    name: "Casting & Rolling",
    description: "Shaping steel into final products",
    emissions: 0.12,
    percentage: 6,
    icon: <Factory className="w-6 h-6" />,
    color: "bg-purple-500",
    details: "Steel is cast into slabs, billets, or blooms, then reheated and rolled into final shapes. Energy used for reheating furnaces."
  },
  {
    name: "Ancillary Operations",
    description: "Power, lime, oxygen production",
    emissions: 0.17,
    percentage: 9,
    icon: <Zap className="w-6 h-6" />,
    color: "bg-gray-500",
    details: "Includes electricity for auxiliary systems, lime production for slag chemistry, and on-site oxygen generation plants."
  }
];

const totalEmissions = steelProductionSteps.reduce((sum, step) => sum + step.emissions, 0);

const IMPACT_CATEGORIES = [
  { name: "Global Warming Potential (GWP)", unit: "kg CO₂ equivalent", description: "Measures greenhouse gas contributions to climate change. All GHGs are converted to CO₂ equivalents using characterization factors (e.g., methane = 28x CO₂).", icon: <Globe className="w-5 h-5" />, color: "text-red-600" },
  { name: "Acidification Potential (AP)", unit: "kg SO₂ equivalent", description: "Measures emissions that cause acid rain (SO₂, NOₓ, HCl). Acid deposition damages ecosystems, corrodes infrastructure, and degrades soil quality.", icon: <Droplets className="w-5 h-5" />, color: "text-yellow-600" },
  { name: "Eutrophication Potential (EP)", unit: "kg PO₄ equivalent", description: "Measures nutrient enrichment in water bodies from nitrogen and phosphorus releases, causing algal blooms and oxygen depletion.", icon: <Droplets className="w-5 h-5" />, color: "text-green-600" },
  { name: "Ozone Depletion Potential (ODP)", unit: "kg CFC-11 equivalent", description: "Measures contributions to stratospheric ozone layer destruction, increasing UV radiation reaching Earth's surface.", icon: <Wind className="w-5 h-5" />, color: "text-blue-600" },
  { name: "Abiotic Depletion Potential (ADP)", unit: "kg Sb equivalent", description: "Measures depletion of non-renewable resources including minerals, metals, and fossil fuels relative to antimony (Sb).", icon: <Pickaxe className="w-5 h-5" />, color: "text-gray-600" },
  { name: "Human Toxicity Potential (HTP)", unit: "kg 1,4-DCB equivalent", description: "Evaluates potential harm to human health from toxic substances released to air, water, and soil throughout a product's lifecycle.", icon: <Factory className="w-5 h-5" />, color: "text-purple-600" },
];

const SYSTEM_BOUNDARIES = [
  { name: "Cradle-to-Gate", scope: "Raw material extraction through manufacturing", description: "Covers upstream impacts from resource extraction to the factory gate. Used when the producer controls these stages and wants to understand their manufacturing footprint.", stages: ["Raw Materials", "Processing", "Manufacturing"], color: "bg-blue-100 border-blue-300 text-blue-800" },
  { name: "Cradle-to-Grave", scope: "Full lifecycle from extraction to disposal", description: "The most comprehensive boundary. Includes all stages from resource extraction through manufacturing, distribution, use, and final disposal or recycling.", stages: ["Raw Materials", "Processing", "Manufacturing", "Distribution", "Use", "End-of-Life"], color: "bg-green-100 border-green-300 text-green-800" },
  { name: "Cradle-to-Cradle", scope: "Full lifecycle including circular economy loops", description: "Extends cradle-to-grave by including material recovery and recycling back into new products. Reflects circular economy principles where waste becomes input.", stages: ["Raw Materials", "Processing", "Manufacturing", "Distribution", "Use", "Recovery", "Recycling"], color: "bg-purple-100 border-purple-300 text-purple-800" },
  { name: "Gate-to-Gate", scope: "Single manufacturing process only", description: "Covers only the manufacturing stage within a single facility. Useful for comparing different production processes or optimizing factory operations.", stages: ["Manufacturing Process"], color: "bg-orange-100 border-orange-300 text-orange-800" },
];

const ISO_PHASES = [
  { phase: "1. Goal & Scope Definition", description: "Define the purpose, system boundary, functional unit, and intended audience of the study. The functional unit (e.g., 1 kg of steel, 1 kWh of electricity) is the reference basis for all comparisons.", details: "Key decisions include: What product or process to study? What boundary applies? What data quality is needed? Who will use the results? The functional unit ensures fair comparison—comparing a plastic bag to a cotton bag requires defining equivalent carrying capacity and lifespan.", icon: <Target className="w-6 h-6" /> },
  { phase: "2. Life Cycle Inventory (LCI)", description: "Collect data on all material and energy inputs and outputs for each process within the system boundary. This is typically the most data-intensive phase.", details: "Inputs include raw materials, energy, water, and land use. Outputs include products, co-products, emissions to air/water/soil, and waste. Data sources include facility measurements, industry databases (ecoinvent, USLCI), literature, and engineering estimates. Allocation rules handle co-products.", icon: <BarChart3 className="w-6 h-6" /> },
  { phase: "3. Life Cycle Impact Assessment (LCIA)", description: "Convert inventory data into environmental impact scores using characterization factors. Group emissions into impact categories like climate change, acidification, and toxicity.", details: "Steps: Classification (assign emissions to impact categories), Characterization (multiply by factors, e.g., CH₄ × 28 = CO₂e), Normalization (compare to reference values), and Weighting (optional—assign relative importance). Common methods: ReCiPe, CML, TRACI, and IMPACT World+.", icon: <Layers className="w-6 h-6" /> },
  { phase: "4. Interpretation", description: "Analyze results, identify significant issues, check completeness and consistency, draw conclusions, and make recommendations aligned with the study's goal.", details: "Includes sensitivity analysis (how do results change with different assumptions?), uncertainty analysis (what is the confidence range?), contribution analysis (which stages dominate?), and completeness checks. Results should be communicated clearly with limitations noted.", icon: <CheckCircle2 className="w-6 h-6" /> },
];

const KEY_STANDARDS = [
  { name: "ISO 14040:2006", scope: "Principles and Framework", description: "Establishes the general framework, principles, and requirements for conducting and reporting LCA studies. It defines the four phases and sets quality guidelines." },
  { name: "ISO 14044:2006", scope: "Requirements and Guidelines", description: "Provides detailed requirements for each LCA phase including data collection, impact assessment methods, interpretation, reporting, and critical review procedures." },
  { name: "ISO 14067:2018", scope: "Carbon Footprint of Products", description: "Specifically addresses quantification of the carbon footprint of products (CFP) based on LCA methodology, focusing on GHG emissions and removals." },
  { name: "PAS 2050", scope: "Product GHG Emissions", description: "British Standards Institution specification for assessing product lifecycle greenhouse gas emissions. Widely used alongside ISO standards." },
  { name: "GHG Protocol Product Standard", scope: "Product Life Cycle Accounting", description: "World Resources Institute standard for quantifying GHG emissions from individual products across their lifecycle. Complements corporate-level GHG Protocol." },
];

const REAL_WORLD_EXAMPLES = [
  { product: "Cotton T-Shirt", total: "8.1 kg CO₂e", hotspot: "Cotton farming (40%)", insight: "Water-intensive cotton cultivation and dyeing processes dominate. Organic cotton reduces pesticide impacts but water use remains high. Recycled polyester blends can lower overall impact.", energy: "60 MJ" },
  { product: "Aluminum Can (330ml)", total: "0.17 kg CO₂e", hotspot: "Smelting (65%)", insight: "Primary aluminum smelting is extremely energy-intensive (Hall-Héroult process). Recycled aluminum uses 95% less energy—making recycling rate the key variable.", energy: "2.7 MJ" },
  { product: "Laptop Computer", total: "350-400 kg CO₂e", hotspot: "Manufacturing (75-80%)", insight: "Semiconductor fabrication, circuit board assembly, and component manufacturing dominate. Use phase depends heavily on electricity grid carbon intensity.", energy: "4,500 MJ" },
  { product: "Concrete (1 m³)", total: "300-400 kg CO₂e", hotspot: "Cement production (90%)", insight: "Calcination of limestone (CaCO₃ → CaO + CO₂) is the primary source. Supplementary cementitious materials (fly ash, slag) can reduce cement content 30-50%.", energy: "1,800 MJ" },
  { product: "Beef (1 kg)", total: "27-60 kg CO₂e", hotspot: "Enteric fermentation (45%)", insight: "Methane from cattle digestion is the largest source. Feed production and land use change also contribute significantly. Grass-fed vs. grain-fed varies by region.", energy: "65 MJ" },
  { product: "Solar Panel (1 kW)", total: "1,200-1,600 kg CO₂e", hotspot: "Silicon purification (50%)", insight: "Energy-intensive silicon refining and cell manufacturing dominate upfront. Over a 25-year lifespan, a panel offsets its embodied carbon within 1-3 years.", energy: "18,000 MJ" },
];

export default function LcaEducationPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [expandedBoundary, setExpandedBoundary] = useState<number | null>(null);

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
                <Recycle className="text-green-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">Understanding Life Cycle Assessment</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/lca-calculator">
                <Button size="sm" className="gap-2">
                  <Calculator className="w-4 h-4" />
                  LCA Calculator
                </Button>
              </Link>
              <Link href="/lca-data">
                <Button variant="outline" size="sm" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  LCA Database
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Life Cycle Assessment (LCA)?</h2>
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    <strong>Life Cycle Assessment (LCA)</strong> is a systematic method for evaluating the environmental 
                    impacts of a product, process, or service throughout its entire life cycle—from raw material 
                    extraction ("cradle") through manufacturing, use, and disposal ("grave").
                  </p>
                  <p className="text-gray-700 mb-4">
                    LCA quantifies impacts like greenhouse gas emissions, water use, and resource depletion at each 
                    stage, helping identify where the biggest environmental footprints occur.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Key LCA Phases
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Raw Material Extraction</strong> - Mining, harvesting, drilling</li>
                      <li>• <strong>Manufacturing</strong> - Processing, assembly, packaging</li>
                      <li>• <strong>Distribution</strong> - Transportation to markets</li>
                      <li>• <strong>Use Phase</strong> - Energy consumed during product use</li>
                      <li>• <strong>End of Life</strong> - Disposal, recycling, or reuse</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Why LCA Matters for Climate Risk</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-blue-700">Scope 3 Emissions:</strong> LCA data helps companies 
                        measure supply chain emissions, which often account for 70-90% of total carbon footprint.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-blue-700">Decarbonization:</strong> Identifies hotspots where 
                        emission reductions will have the greatest impact.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-blue-700">Product Comparison:</strong> Compare carbon intensity 
                        of different materials, suppliers, or production methods.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-blue-700">Regulatory Compliance:</strong> EU Carbon Border Adjustment 
                        Mechanism (CBAM) and other regulations increasingly require lifecycle emissions data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ISO 14040/14044 Methodology</h2>
          <p className="text-gray-600 mb-6">
            The international standards ISO 14040 and ISO 14044 define the four-phase methodology that all rigorous LCA studies follow.
          </p>
          <div className="space-y-4">
            {ISO_PHASES.map((phase, idx) => (
              <Card key={idx} className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpandedPhase(expandedPhase === idx ? null : idx)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-50 rounded-lg text-green-700 mt-1 shrink-0">
                      {phase.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{phase.phase}</h3>
                        {expandedPhase === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                      <p className="text-gray-600 mt-1">{phase.description}</p>
                      {expandedPhase === idx && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-700">{phase.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Boundaries</h2>
          <p className="text-gray-600 mb-6">
            The system boundary defines which lifecycle stages are included in the assessment. Choosing the right boundary is critical—it determines what emissions and impacts are counted.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {SYSTEM_BOUNDARIES.map((boundary, idx) => (
              <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpandedBoundary(expandedBoundary === idx ? null : idx)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={boundary.color}>{boundary.name}</Badge>
                    {expandedBoundary === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-2">{boundary.scope}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {boundary.stages.map((stage, sIdx) => (
                      <span key={sIdx} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">{stage}</Badge>
                        {sIdx < boundary.stages.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400" />}
                      </span>
                    ))}
                  </div>
                  {expandedBoundary === idx && (
                    <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">{boundary.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Environmental Impact Categories</h2>
          <p className="text-gray-600 mb-6">
            LCA evaluates multiple types of environmental impact, not just carbon emissions. Here are the most commonly assessed categories:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {IMPACT_CATEGORIES.map((cat, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className={cat.color}>{cat.icon}</span>
                    {cat.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">{cat.unit}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Example: Steel Production Emissions</h2>
          <p className="text-gray-600 mb-6">
            Steel production via the traditional blast furnace route emits approximately <strong>{totalEmissions.toFixed(2)} tonnes CO₂ 
            per tonne of steel</strong>. Here's how emissions break down by production stage:
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Total Emissions: {totalEmissions.toFixed(2)} t CO₂/t steel</span>
            </div>
            <div className="flex h-8 rounded-lg overflow-hidden">
              {steelProductionSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className={`${step.color} flex items-center justify-center text-white text-xs font-medium`}
                  style={{ width: `${step.percentage}%` }}
                  title={`${step.name}: ${step.emissions} t CO₂`}
                >
                  {step.percentage >= 10 && `${step.percentage}%`}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {steelProductionSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded ${step.color}`}></div>
                  <span className="text-gray-600">{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steelProductionSteps.map((step, idx) => (
              <Card key={idx} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${step.color}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${step.color} bg-opacity-20`}>
                      <div className={`${step.color.replace('bg-', 'text-')}`}>{step.icon}</div>
                    </div>
                    <div>
                      <CardTitle className="text-base">{step.name}</CardTitle>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">{step.emissions}</span>
                    <span className="text-sm text-gray-500">t CO₂/t steel</span>
                    <span className={`ml-auto text-sm font-semibold ${step.color.replace('bg-', 'text-')}`}>
                      {step.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{step.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Real-World LCA Examples</h2>
          <p className="text-gray-600 mb-6">
            Lifecycle emissions vary dramatically across products. Understanding where impacts concentrate helps prioritize interventions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REAL_WORLD_EXAMPLES.map((ex, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{ex.product}</CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-100 text-red-800">{ex.total}</Badge>
                    <Badge variant="outline" className="text-xs">{ex.energy}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">Hotspot:</span>
                    <span className="text-sm text-gray-800 ml-1 font-medium">{ex.hotspot}</span>
                  </div>
                  <p className="text-xs text-gray-600">{ex.insight}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Decarbonization Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Recycle className="w-5 h-5" />
                  Electric Arc Furnace (EAF)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Using recycled scrap steel in electric arc furnaces can reduce emissions to 
                  <strong className="text-green-700"> 0.4-0.6 t CO₂/t steel</strong>—a 70% reduction.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    When powered by renewable electricity, EAF emissions can drop below 0.1 t CO₂/t steel.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Leaf className="w-5 h-5" />
                  Green Hydrogen DRI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Direct Reduced Iron (DRI) using green hydrogen instead of coke can achieve 
                  <strong className="text-blue-700"> near-zero emissions</strong> for primary steel production.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Projects like HYBRIT in Sweden are demonstrating commercial-scale hydrogen steelmaking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Standards & Databases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {KEY_STANDARDS.map((std, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{std.name}</CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">{std.scope}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{std.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Key LCA Databases
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "ecoinvent", desc: "World's largest LCA database with 18,000+ datasets covering global supply chains." },
                  { name: "USLCI (US Life Cycle Inventory)", desc: "Free US-focused database maintained by NREL with data for common US industrial processes." },
                  { name: "GaBi Databases", desc: "Commercial databases by Sphera covering 15,000+ products across industries." },
                  { name: "Agri-footprint", desc: "Specialized database for agricultural and food products with global coverage." },
                  { name: "ELCD (European Reference)", desc: "EU Joint Research Centre database for key materials, energy, transport, and waste management." },
                  { name: "Federal LCA Commons", desc: "US government-maintained repository with USDA, NIST, and USFS lifecycle data." },
                ].map((db, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-blue-200">
                    <h4 className="font-medium text-gray-900 text-sm">{db.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{db.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/lca-calculator">
            <Button className="group">
              <Calculator className="w-4 h-4 mr-2" />
              LCA Calculator
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/lca-data">
            <Button variant="outline" className="group">
              Explore LCA Database
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/carbon-pricing">
            <Button variant="outline" className="group border-green-500 text-green-700 hover:bg-green-50">
              Carbon Pricing Tool
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
