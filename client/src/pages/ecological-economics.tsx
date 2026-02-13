import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Leaf, TreePine, Droplets, Globe, Mountain, Fish, Sun, Wind, Sprout, CircleDot, BookOpen, Users, Scale, TrendingDown, AlertTriangle, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlanetaryBoundary {
  name: string;
  status: "safe" | "increasing_risk" | "high_risk" | "beyond";
  description: string;
  currentState: string;
  businessRelevance: string;
  icon: React.ReactNode;
}

const planetaryBoundaries: PlanetaryBoundary[] = [
  {
    name: "Climate Change",
    status: "beyond",
    description: "Atmospheric CO2 concentration and radiative forcing",
    currentState: "CO2 at 424 ppm (boundary: 350 ppm). Global temperature +1.2C above pre-industrial.",
    businessRelevance: "Carbon pricing, stranded fossil assets, shifting energy markets, regulatory compliance costs",
    icon: <Sun className="w-5 h-5" />
  },
  {
    name: "Biosphere Integrity",
    status: "beyond",
    description: "Genetic diversity and functional diversity of ecosystems",
    currentState: "Extinction rate 100-1000x background. Living Planet Index declined 69% since 1970.",
    businessRelevance: "Pollination-dependent agriculture ($235B/yr), pharmaceutical bioprospecting, ecosystem service collapse",
    icon: <Fish className="w-5 h-5" />
  },
  {
    name: "Land-System Change",
    status: "beyond",
    description: "Conversion of forests and natural land to human use",
    currentState: "Global forest cover at 62% of original (boundary: 75%). Tropical forests most affected.",
    businessRelevance: "Agricultural commodity supply risk, deforestation regulation (EU EUDR), carbon sink loss",
    icon: <TreePine className="w-5 h-5" />
  },
  {
    name: "Biogeochemical Flows",
    status: "beyond",
    description: "Nitrogen and phosphorus cycles disrupted by fertilizer use",
    currentState: "Nitrogen fixation 2.5x safe limit. Phosphorus flow 2x boundary. Dead zones proliferating.",
    businessRelevance: "Fertilizer input costs, agricultural runoff liability, water treatment costs, fishery collapse",
    icon: <Sprout className="w-5 h-5" />
  },
  {
    name: "Novel Entities",
    status: "beyond",
    description: "Synthetic chemicals, plastics, and pollutants in the environment",
    currentState: "350,000+ synthetic chemicals registered. Microplastics found in all ecosystems and human blood.",
    businessRelevance: "Extended producer responsibility, PFAS litigation, plastic packaging regulation, cleanup liability",
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    name: "Freshwater Change",
    status: "beyond",
    description: "Green water (soil moisture) and blue water (rivers, lakes) disruption",
    currentState: "Green water boundary transgressed. 4 billion people face severe water scarcity at least 1 month/year.",
    businessRelevance: "Manufacturing water access, agricultural irrigation risk, supply chain water stress, facility siting",
    icon: <Droplets className="w-5 h-5" />
  },
  {
    name: "Ocean Acidification",
    status: "increasing_risk",
    description: "Declining ocean pH from CO2 absorption",
    currentState: "Surface ocean pH declined 0.1 units (26% increase in acidity). Coral reefs severely threatened.",
    businessRelevance: "Fisheries and aquaculture productivity, coastal tourism, protein supply chains",
    icon: <Globe className="w-5 h-5" />
  },
  {
    name: "Atmospheric Aerosol Loading",
    status: "increasing_risk",
    description: "Particulate matter affecting climate and health",
    currentState: "Regional variation. South Asia and parts of Africa most affected. Health burden: 4.2M premature deaths/year.",
    businessRelevance: "Air quality regulation, health care costs, worker productivity, clean technology demand",
    icon: <Wind className="w-5 h-5" />
  },
  {
    name: "Stratospheric Ozone Depletion",
    status: "safe",
    description: "Thinning of the protective ozone layer",
    currentState: "Recovery underway since Montreal Protocol. Antarctic ozone hole shrinking. Success story of global cooperation.",
    businessRelevance: "Model for successful environmental regulation. Demonstrates effectiveness of international agreements.",
    icon: <CircleDot className="w-5 h-5" />
  }
];

interface EcoEconThinker {
  name: string;
  contribution: string;
  keyWork: string;
  relevance: string;
}

const keyThinkers: EcoEconThinker[] = [
  {
    name: "Herman Daly",
    contribution: "Steady-State Economics",
    keyWork: "Beyond Growth (1996)",
    relevance: "Argued that economic growth cannot continue indefinitely on a finite planet. Distinguished between growth (quantitative expansion) and development (qualitative improvement). Proposed the concept of 'uneconomic growth' where costs exceed benefits."
  },
  {
    name: "Nicholas Georgescu-Roegen",
    contribution: "Entropy and Economics",
    keyWork: "The Entropy Law and the Economic Process (1971)",
    relevance: "Applied thermodynamics to economics, showing that all economic activity transforms low-entropy resources into high-entropy waste. Economic processes are irreversible, meaning recycling can never be 100% efficient and material throughput has fundamental limits."
  },
  {
    name: "Robert Costanza",
    contribution: "Ecosystem Services Valuation",
    keyWork: "The Value of the World's Ecosystem Services (1997)",
    relevance: "Estimated the global value of ecosystem services at $33 trillion/year (updated to $125-145 trillion in 2014). Demonstrated that nature provides immense economic value that markets fail to capture, creating systematic underpricing of natural capital."
  },
  {
    name: "Kate Raworth",
    contribution: "Doughnut Economics",
    keyWork: "Doughnut Economics (2017)",
    relevance: "Created a visual framework combining planetary boundaries (ecological ceiling) with social foundations (human needs floor). The goal of economics should be to operate in the 'safe and just space' between these two boundaries, not to maximize GDP growth."
  },
  {
    name: "Elinor Ostrom",
    contribution: "Governing the Commons",
    keyWork: "Governing the Commons (1990)",
    relevance: "Nobel laureate who showed that communities can successfully manage shared resources without privatization or government control. Identified eight design principles for sustainable commons management, challenging the 'Tragedy of the Commons' narrative."
  },
  {
    name: "E.F. Schumacher",
    contribution: "Buddhist Economics / Appropriate Technology",
    keyWork: "Small Is Beautiful (1973)",
    relevance: "Argued that mainstream economics treats natural resources as income rather than capital. Proposed 'economics as if people mattered' - prioritizing human well-being, meaningful work, and environmental sustainability over pure output maximization."
  }
];

interface EcosystemService {
  category: string;
  service: string;
  example: string;
  estimatedValue: string;
  atRisk: string;
}

const ecosystemServices: EcosystemService[] = [
  { category: "Provisioning", service: "Food Production", example: "Pollination by insects supports 75% of food crops", estimatedValue: "$235-577 billion/year", atRisk: "Pollinator populations declining 1-2% per year globally" },
  { category: "Provisioning", service: "Fresh Water", example: "Watershed filtration, aquifer recharge, snowpack storage", estimatedValue: "$2.3 trillion/year", atRisk: "2 billion people lack safe drinking water; groundwater depletion accelerating" },
  { category: "Provisioning", service: "Raw Materials", example: "Timber, fibers, genetic resources, biochemicals", estimatedValue: "$1.1 trillion/year", atRisk: "Deforestation eliminates 10M hectares/year; soil degradation affects 33% of land" },
  { category: "Regulating", service: "Climate Regulation", example: "Carbon sequestration by forests, oceans, and soils", estimatedValue: "$2.7 trillion/year", atRisk: "Amazon approaching tipping point; permafrost thaw releasing stored carbon" },
  { category: "Regulating", service: "Flood Protection", example: "Wetlands, mangroves, and floodplains absorb excess water", estimatedValue: "$8.4 billion/year (US wetlands alone)", atRisk: "35% of wetlands lost since 1970; coastal development removes natural buffers" },
  { category: "Regulating", service: "Disease Regulation", example: "Biodiversity reduces disease transmission; forests filter air/water", estimatedValue: "Incalculable (COVID-19 cost $16T+ in US alone)", atRisk: "Habitat destruction increases zoonotic spillover risk by 5x" },
  { category: "Cultural", service: "Recreation & Tourism", example: "National parks, coral reefs, wilderness areas", estimatedValue: "$600 billion/year (nature tourism)", atRisk: "Coral bleaching, biodiversity loss reducing attractiveness of natural sites" },
  { category: "Supporting", service: "Soil Formation", example: "Decomposition, nutrient cycling, organic matter accumulation", estimatedValue: "$1.5 trillion/year", atRisk: "Topsoil lost 10-40x faster than formation rate; 24B tonnes/year eroded" },
  { category: "Supporting", service: "Nutrient Cycling", example: "Nitrogen fixation, phosphorus recycling, decomposition", estimatedValue: "$2.3 trillion/year", atRisk: "Synthetic fertilizer dependence disrupts natural cycles; eutrophication spreading" }
];

const statusColors: Record<string, string> = {
  safe: "bg-green-100 text-green-800 border-green-300",
  increasing_risk: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high_risk: "bg-orange-100 text-orange-800 border-orange-300",
  beyond: "bg-red-100 text-red-800 border-red-300"
};

const statusLabels: Record<string, string> = {
  safe: "Within Safe Boundary",
  increasing_risk: "Increasing Risk",
  high_risk: "High Risk",
  beyond: "Beyond Boundary"
};

export default function EcologicalEconomicsPage() {
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
                <TreePine className="text-green-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">Ecological Economics</h1>
              </div>
            </div>
            <Link href="/ecological-risk">
              <Button size="sm" className="bg-green-700 hover:bg-green-800">
                <ArrowRight className="w-4 h-4 mr-2" />
                Run Ecological Risk Assessment
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Ecological Economics?</h2>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    <strong>Ecological economics</strong> is a transdisciplinary field that views the economy as a 
                    subsystem of the Earth's larger ecosystem, rather than the other way around. Unlike conventional 
                    economics, which treats environmental impacts as "externalities," ecological economics recognizes 
                    that all economic activity depends on natural systems and is constrained by ecological limits.
                  </p>
                  <p className="text-gray-700 mb-4">
                    The field integrates insights from ecology, physics (thermodynamics), ethics, and economics to 
                    address the fundamental question: <em>How can human economies operate within the regenerative 
                    capacity of the biosphere?</em>
                  </p>
                  <p className="text-gray-700">
                    For businesses and investors, ecological economics provides a more complete framework for understanding 
                    risk - one that accounts for dependency on natural capital, exposure to ecosystem service degradation, 
                    and vulnerability to planetary boundary transgressions that conventional financial analysis misses entirely.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-1">Core Principle 1: Scale</h4>
                    <p className="text-sm text-gray-600">The economy has a maximum sustainable size relative to the ecosystem. Growth beyond this point reduces total welfare.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-1">Core Principle 2: Distribution</h4>
                    <p className="text-sm text-gray-600">Fair allocation of resources and environmental burdens between current and future generations (intergenerational equity).</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-1">Core Principle 3: Allocation</h4>
                    <p className="text-sm text-gray-600">Efficient use of resources once scale and distribution are addressed. Markets are tools, not goals.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                Ecological Economics vs. Neoclassical Economics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-300">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Dimension</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Neoclassical Economics</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Ecological Economics</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Basic worldview</td>
                      <td className="py-2 pr-4">Economy is the whole system; nature is a subsector</td>
                      <td className="py-2">Economy is a subsystem of the finite biosphere</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Primary goal</td>
                      <td className="py-2 pr-4">GDP growth and efficiency</td>
                      <td className="py-2">Sustainable scale, fair distribution, then efficiency</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Natural capital</td>
                      <td className="py-2 pr-4">Substitutable by human-made capital</td>
                      <td className="py-2">Complementary to and not substitutable for other capital</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Growth perspective</td>
                      <td className="py-2 pr-4">Indefinite growth is possible and desirable</td>
                      <td className="py-2">Growth has biophysical limits; focus on development</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Sustainability type</td>
                      <td className="py-2 pr-4">Weak sustainability (total capital maintained)</td>
                      <td className="py-2">Strong sustainability (natural capital must be maintained)</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Environmental problems</td>
                      <td className="py-2 pr-4">Market failures fixable by pricing externalities</td>
                      <td className="py-2">Systemic: economy exceeding carrying capacity</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Discount rate</td>
                      <td className="py-2 pr-4">Market-derived (typically 3-7%)</td>
                      <td className="py-2">Near-zero for irreversible environmental changes</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Valuation of nature</td>
                      <td className="py-2 pr-4">Willingness to pay / market prices</td>
                      <td className="py-2">Multi-criteria: ecological, social, monetary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="boundaries" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="boundaries">Planetary Boundaries</TabsTrigger>
            <TabsTrigger value="services">Ecosystem Services</TabsTrigger>
            <TabsTrigger value="thinkers">Key Thinkers</TabsTrigger>
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          </TabsList>

          <TabsContent value="boundaries" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">The 9 Planetary Boundaries</h3>
              <p className="text-gray-600">
                Developed by Johan Rockstrom and Will Steffen (2009, updated 2023), planetary boundaries define the safe operating space 
                for humanity. As of 2023, <strong>six of nine boundaries have been transgressed</strong>, placing Earth systems in 
                a state of increasing risk. Each transgression creates material risks for businesses that depend on stable Earth systems.
              </p>
            </div>

            <div className="grid gap-4">
              {planetaryBoundaries.map((boundary) => (
                <Card key={boundary.name} className="border-l-4" style={{ borderLeftColor: boundary.status === 'beyond' ? '#ef4444' : boundary.status === 'high_risk' ? '#f97316' : boundary.status === 'increasing_risk' ? '#eab308' : '#22c55e' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                        {boundary.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{boundary.name}</h4>
                          <Badge className={statusColors[boundary.status]}>
                            {statusLabels[boundary.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{boundary.description}</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">Current State</p>
                            <p className="text-sm text-gray-700">{boundary.currentState}</p>
                          </div>
                          <div className="bg-blue-50 rounded p-2">
                            <p className="text-xs font-medium text-blue-600 mb-1">Business Relevance</p>
                            <p className="text-sm text-gray-700">{boundary.businessRelevance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 bg-red-50 border-red-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-900 mb-2">Why This Matters for Business</h4>
                <p className="text-sm text-red-800">
                  Six of nine planetary boundaries have been transgressed. This is not an abstract scientific finding - it represents 
                  a fundamental shift in the operating environment for all businesses. Companies that understand their exposure to 
                  planetary boundary transgressions can better anticipate regulatory action, supply chain disruption, and shifts in 
                  market demand. The Ecological Risk Assessment tool translates these boundary transgressions into sector-specific 
                  risk scores.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ecosystem Services at Risk</h3>
              <p className="text-gray-600">
                Ecosystem services are the benefits nature provides to human economies - valued at an estimated 
                <strong> $125-145 trillion per year</strong> globally (Costanza et al., 2014). This exceeds global 
                GDP ($100T). When these services degrade, businesses face real costs that conventional accounting 
                fails to capture.
              </p>
            </div>

            <div className="space-y-3">
              {ecosystemServices.map((service, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Badge variant="outline" className={
                        service.category === "Provisioning" ? "border-blue-500 text-blue-700" :
                        service.category === "Regulating" ? "border-green-500 text-green-700" :
                        service.category === "Cultural" ? "border-purple-500 text-purple-700" :
                        "border-amber-500 text-amber-700"
                      }>
                        {service.category}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{service.service}</h4>
                        <p className="text-sm text-gray-600 mb-2">{service.example}</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-green-50 rounded p-2">
                            <p className="text-xs font-medium text-green-600">Estimated Value</p>
                            <p className="text-sm font-semibold text-gray-900">{service.estimatedValue}</p>
                          </div>
                          <div className="bg-red-50 rounded p-2">
                            <p className="text-xs font-medium text-red-600">Threat Status</p>
                            <p className="text-sm text-gray-700">{service.atRisk}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="thinkers" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Foundational Thinkers</h3>
              <p className="text-gray-600">
                Ecological economics draws on decades of scholarship that challenged mainstream economic assumptions 
                about growth, resources, and the relationship between human economies and natural systems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {keyThinkers.map((thinker) => (
                <Card key={thinker.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <CardTitle className="text-base">{thinker.name}</CardTitle>
                        <p className="text-sm text-green-700 font-medium">{thinker.contribution}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-2">{thinker.keyWork}</Badge>
                    <p className="text-sm text-gray-600">{thinker.relevance}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="frameworks" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Key Frameworks & Metrics</h3>
              <p className="text-gray-600">
                Ecological economics has developed alternative measurement frameworks that capture what GDP misses - 
                natural capital depletion, ecosystem degradation, inequality, and genuine human well-being.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Natural Capital Accounting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Measures the stock and flow of natural resources and ecosystem services. The UN adopted the 
                    System of Environmental-Economic Accounting (SEEA) in 2012, and the Taskforce on Nature-related 
                    Financial Disclosures (TNFD) launched in 2023 to standardize corporate nature reporting.
                  </p>
                  <div className="bg-green-50 rounded p-3">
                    <p className="text-xs font-medium text-green-700 mb-1">Business Application</p>
                    <p className="text-sm text-gray-700">Companies like Kering (luxury goods) now publish Environmental Profit & Loss accounts showing their full nature footprint, valued at over 1B per year.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-blue-600" />
                    Genuine Progress Indicator (GPI)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    An alternative to GDP that starts with personal consumption expenditure but adds factors like 
                    volunteer work and household labor, while subtracting costs like pollution, crime, resource depletion, 
                    and loss of leisure time. In the US, GPI has been flat since the 1970s while GDP tripled.
                  </p>
                  <div className="bg-blue-50 rounded p-3">
                    <p className="text-xs font-medium text-blue-700 mb-1">Key Insight</p>
                    <p className="text-sm text-gray-700">GDP grows when we clean up oil spills, treat pollution-related disease, and rebuild after disasters. GPI counts these as costs, not gains.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CircleDot className="w-5 h-5 text-purple-600" />
                    Doughnut Economics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Kate Raworth's framework defines a "safe and just space" between a social foundation 
                    (12 dimensions including health, education, income, political voice) and an ecological ceiling 
                    (the 9 planetary boundaries). Over 50 cities including Amsterdam, Barcelona, and Melbourne 
                    have adopted Doughnut Economics principles for planning.
                  </p>
                  <div className="bg-purple-50 rounded p-3">
                    <p className="text-xs font-medium text-purple-700 mb-1">For Business</p>
                    <p className="text-sm text-gray-700">Doughnut Economics Action Lab (DEAL) has created tools for businesses to assess whether their operations fall within the "safe and just space."</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-amber-600" />
                    Strong vs. Weak Sustainability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Weak sustainability</strong> (Hartwick-Solow rule) says total capital stock must be maintained, 
                    and natural capital can be replaced by manufactured capital. <strong>Strong sustainability</strong> 
                    says natural capital must be maintained separately because many ecological functions cannot be replicated 
                    by technology (e.g., the ozone layer, biodiversity, stable climate).
                  </p>
                  <div className="bg-amber-50 rounded p-3">
                    <p className="text-xs font-medium text-amber-700 mb-1">Risk Implication</p>
                    <p className="text-sm text-gray-700">If strong sustainability is correct, businesses dependent on degrading natural capital face risks that no amount of investment in substitutes can mitigate.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-5 h-5 text-rose-600" />
                    TNFD (Taskforce on Nature-related Financial Disclosures)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Launched in 2023, TNFD provides a risk management and disclosure framework for organizations to 
                    report and act on evolving nature-related dependencies, impacts, risks, and opportunities. Built 
                    on the LEAP approach: Locate, Evaluate, Assess, Prepare. Over 320 organizations have adopted it.
                  </p>
                  <div className="bg-rose-50 rounded p-3">
                    <p className="text-xs font-medium text-rose-700 mb-1">Regulatory Trend</p>
                    <p className="text-sm text-gray-700">EU Corporate Sustainability Reporting Directive (CSRD) requires biodiversity and ecosystem reporting, driving TNFD adoption across sectors.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-teal-600" />
                    Circular Economy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Inspired by ecological economics principles, the circular economy model aims to eliminate waste 
                    and keep materials in use through design, reuse, repair, remanufacture, and recycling. The Ellen 
                    MacArthur Foundation estimates a circular economy could generate $4.5 trillion in value by 2030.
                  </p>
                  <div className="bg-teal-50 rounded p-3">
                    <p className="text-xs font-medium text-teal-700 mb-1">Thermodynamic Limit</p>
                    <p className="text-sm text-gray-700">Per Georgescu-Roegen's entropy law, 100% circularity is impossible. Some material dissipation is inevitable, requiring a throughput reduction alongside circularity.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Resources & Further Reading</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Planetary Boundaries (2023 Update)", org: "Stockholm Resilience Centre", url: "https://www.stockholmresilience.org/research/planetary-boundaries.html", desc: "Latest assessment of all 9 planetary boundaries" },
                { title: "TNFD Framework v1.0", org: "TNFD", url: "https://tnfd.global/recommendations-of-the-tnfd/", desc: "Nature-related financial disclosure recommendations" },
                { title: "The Value of Ecosystem Services", org: "Costanza et al.", url: "https://www.sciencedirect.com/science/article/pii/S0959378014000685", desc: "Global ecosystem services valued at $125 trillion/year" },
                { title: "SEEA Ecosystem Accounting", org: "United Nations", url: "https://seea.un.org/ecosystem-accounting", desc: "UN standard for environmental-economic accounting" },
                { title: "Doughnut Economics Action Lab", org: "DEAL", url: "https://doughnuteconomics.org/", desc: "Tools and community for applying the Doughnut framework" },
                { title: "IPBES Global Assessment", org: "IPBES", url: "https://ipbes.net/global-assessment", desc: "Comprehensive assessment of biodiversity and ecosystem services" }
              ].map((resource) => (
                <a key={resource.title} href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <ExternalLink className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">{resource.title}</h4>
                          <p className="text-xs text-green-600 mb-1">{resource.org}</p>
                          <p className="text-xs text-gray-500">{resource.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/ecological-risk">
            <Button size="lg" className="bg-green-700 hover:bg-green-800">
              <ArrowRight className="w-5 h-5 mr-2" />
              Run Ecological Risk Assessment
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Assess your organization's exposure to ecological risks using the concepts above
          </p>
        </div>
      </div>
    </div>
  );
}