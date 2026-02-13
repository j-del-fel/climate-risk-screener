import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Shield, AlertTriangle, ExternalLink, FileText, Newspaper, BookOpen, Building2, Factory, Zap, Car, Plane, Wheat, ShoppingBag, Briefcase, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Resource {
  title: string;
  source: string;
  type: "report" | "news" | "paper" | "framework";
  url: string;
  year?: number;
  description: string;
}

interface RiskConsideration {
  title: string;
  severity: "high" | "medium" | "low";
  description: string;
  examples: string[];
}

interface SectorData {
  name: string;
  icon: typeof Building2;
  description: string;
  riskLevel: "high" | "medium" | "low";
  considerations: RiskConsideration[];
  resources: Resource[];
}

const sectorData: Record<string, SectorData> = {
  "oil-gas": {
    name: "Oil & Gas",
    icon: Factory,
    description: "Fossil fuel extraction, refining, and distribution companies face intense reputational scrutiny as the world transitions to clean energy.",
    riskLevel: "high",
    considerations: [
      {
        title: "Greenwashing Accusations",
        severity: "high",
        description: "Companies making net-zero pledges while expanding fossil fuel production face credibility challenges.",
        examples: [
          "Shell's 2021 'net-zero' campaign criticized by advertising regulators",
          "BP rebranding to 'Beyond Petroleum' while maintaining oil investments",
          "TotalEnergies shareholder climate resolutions and protests"
        ]
      },
      {
        title: "Climate Litigation Exposure",
        severity: "high",
        description: "Growing number of lawsuits linking companies to climate damages and misleading statements.",
        examples: [
          "Multiple US states suing ExxonMobil for climate misinformation",
          "Dutch court ordering Shell to accelerate emissions cuts",
          "Investor lawsuits over inadequate climate risk disclosure"
        ]
      },
      {
        title: "Stranded Asset Concerns",
        severity: "medium",
        description: "Investor and media focus on unburnable carbon and asset write-downs.",
        examples: [
          "Carbon Tracker reports on stranded asset risk",
          "Major write-downs of oil reserves by Shell, BP in 2020",
          "Divestment campaigns by pension funds and universities"
        ]
      }
    ],
    resources: [
      {
        title: "Net Zero Stocktake 2024",
        source: "Net Zero Tracker",
        type: "report",
        url: "https://zerotracker.net/",
        year: 2024,
        description: "Analysis of corporate net-zero pledges and their credibility across sectors."
      },
      {
        title: "Climate Litigation Global Trends",
        source: "Grantham Research Institute (LSE)",
        type: "report",
        url: "https://www.lse.ac.uk/granthaminstitute/publication/global-trends-in-climate-change-litigation-2024-snapshot/",
        year: 2024,
        description: "Comprehensive database and analysis of climate-related court cases worldwide."
      },
      {
        title: "Oil Companies' Climate Pledges Under Scrutiny",
        source: "Financial Times",
        type: "news",
        url: "https://www.ft.com/climate-capital",
        description: "Ongoing coverage of fossil fuel industry climate commitments and stakeholder reactions."
      },
      {
        title: "Unburnable Carbon: Are the World's Financial Markets Carrying a Carbon Bubble?",
        source: "Carbon Tracker Initiative",
        type: "paper",
        url: "https://carbontracker.org/reports/unburnable-carbon-ten-years-on/",
        year: 2022,
        description: "Analysis of stranded asset risk in fossil fuel portfolios."
      },
      {
        title: "TCFD Recommendations",
        source: "TCFD (FSB)",
        type: "framework",
        url: "https://www.fsb-tcfd.org/recommendations/",
        description: "Framework for climate-related financial disclosures adopted by major companies."
      }
    ]
  },
  "utilities": {
    name: "Utilities & Power",
    icon: Zap,
    description: "Electric utilities and power generators face pressure to decarbonize while maintaining reliable, affordable energy.",
    riskLevel: "high",
    considerations: [
      {
        title: "Coal Phase-out Pressure",
        severity: "high",
        description: "Utilities with coal assets face investor pressure and reputational damage.",
        examples: [
          "BlackRock voting against directors at utilities slow on coal exit",
          "Germany's RWE facing protests over Lützerath coal mine",
          "US utilities sued over coal plant pollution"
        ]
      },
      {
        title: "Renewable Transition Pace",
        severity: "medium",
        description: "Stakeholder expectations for faster clean energy deployment.",
        examples: [
          "Comparison rankings of utility renewable portfolios",
          "Customer choice programs driving utility competition",
          "ESG rating downgrades for slow transition progress"
        ]
      },
      {
        title: "Just Transition Concerns",
        severity: "medium",
        description: "Managing workforce and community impacts of plant closures.",
        examples: [
          "Labor union opposition to rapid coal closures",
          "Community impacts in coal-dependent regions",
          "Retraining and economic transition programs"
        ]
      }
    ],
    resources: [
      {
        title: "Global Coal Exit List",
        source: "Urgewald",
        type: "report",
        url: "https://www.coalexit.org/",
        year: 2024,
        description: "Database of companies involved in coal mining and coal-fired power generation."
      },
      {
        title: "Electric Utility Climate Commitments Tracker",
        source: "Sierra Club",
        type: "report",
        url: "https://www.sierraclub.org/ready-for-100",
        description: "Tracking utility commitments to 100% clean energy."
      },
      {
        title: "World Energy Outlook 2024",
        source: "International Energy Agency",
        type: "report",
        url: "https://www.iea.org/reports/world-energy-outlook-2024",
        year: 2024,
        description: "Comprehensive analysis of global energy trends and pathways."
      },
      {
        title: "Just Transition: A Report for the OECD",
        source: "OECD",
        type: "paper",
        url: "https://www.oecd.org/environment/cc/g20-climate/collapsecontents/Just-Transition-Centre-report-just-transition.pdf",
        description: "Framework for managing social aspects of energy transition."
      }
    ]
  },
  "automotive": {
    name: "Automotive",
    icon: Car,
    description: "Vehicle manufacturers face pressure to accelerate EV transition while managing supply chain emissions.",
    riskLevel: "medium",
    considerations: [
      {
        title: "EV Transition Pace",
        severity: "high",
        description: "Laggards in EV adoption face investor and consumer pressure.",
        examples: [
          "Toyota criticized for slower EV strategy vs peers",
          "Stellantis facing EU emissions fines",
          "Consumer perception shifts toward EV-first brands"
        ]
      },
      {
        title: "Supply Chain Emissions",
        severity: "medium",
        description: "Scope 3 emissions from materials and manufacturing under scrutiny.",
        examples: [
          "Battery sourcing and cobalt mining concerns",
          "Steel and aluminum supply chain emissions",
          "CDP supply chain disclosure requirements"
        ]
      },
      {
        title: "Emissions Testing Credibility",
        severity: "medium",
        description: "Legacy of dieselgate continues to affect industry trust.",
        examples: [
          "Volkswagen ongoing dieselgate litigation",
          "Real-world vs laboratory emissions testing",
          "NGO investigations of manufacturer claims"
        ]
      }
    ],
    resources: [
      {
        title: "Global EV Outlook 2024",
        source: "International Energy Agency",
        type: "report",
        url: "https://www.iea.org/reports/global-ev-outlook-2024",
        year: 2024,
        description: "Comprehensive analysis of electric vehicle market trends and policies."
      },
      {
        title: "Automotive Climate Action Report",
        source: "Transport & Environment",
        type: "report",
        url: "https://www.transportenvironment.org/discover/electric-car-report/",
        description: "European analysis of automaker progress on electrification."
      },
      {
        title: "Science Based Targets for Transport",
        source: "Science Based Targets initiative",
        type: "framework",
        url: "https://sciencebasedtargets.org/sectors/transport",
        description: "Sector-specific guidance for automotive climate targets."
      }
    ]
  },
  "aviation": {
    name: "Aviation",
    icon: Plane,
    description: "Airlines and aerospace face unique challenges as one of the hardest sectors to decarbonize.",
    riskLevel: "high",
    considerations: [
      {
        title: "Flight Shame Movement",
        severity: "high",
        description: "Consumer and social pressure to reduce air travel.",
        examples: [
          "'Flygskam' movement originating in Sweden",
          "Corporate travel reduction commitments",
          "High-speed rail competition on short-haul routes"
        ]
      },
      {
        title: "SAF Availability Questions",
        severity: "medium",
        description: "Skepticism about sustainable aviation fuel scalability.",
        examples: [
          "Limited SAF production capacity vs industry claims",
          "Feedstock sustainability concerns",
          "Cost and availability challenges"
        ]
      },
      {
        title: "Offset Credibility",
        severity: "high",
        description: "Carbon offset programs for aviation under intense scrutiny.",
        examples: [
          "CORSIA offset quality concerns",
          "Guardian/Die Zeit investigation of offset projects",
          "Greenwashing accusations over 'carbon neutral' flights"
        ]
      }
    ],
    resources: [
      {
        title: "Airline Climate Targets: Roadmap to Net-Zero",
        source: "IATA",
        type: "report",
        url: "https://www.iata.org/en/programs/environment/flynetzero/",
        description: "Industry association roadmap for aviation decarbonization."
      },
      {
        title: "Aviation Climate Action Report",
        source: "Transport & Environment",
        type: "report",
        url: "https://www.transportenvironment.org/discover/aviation-report/",
        description: "Critical analysis of airline climate claims and progress."
      },
      {
        title: "The Carbon Offset Problem",
        source: "The Guardian",
        type: "news",
        url: "https://www.theguardian.com/environment/2023/jan/18/revealed-forest-carbon-offsets-biggest-provider-worthless-verra-aoe",
        year: 2023,
        description: "Investigation into quality issues with carbon offset projects."
      }
    ]
  },
  "agriculture": {
    name: "Agriculture & Food",
    icon: Wheat,
    description: "Agricultural companies face scrutiny over land use, deforestation, and methane emissions.",
    riskLevel: "medium",
    considerations: [
      {
        title: "Deforestation Links",
        severity: "high",
        description: "Supply chain connections to forest clearing damage brand value.",
        examples: [
          "Cargill and soy-linked Amazon deforestation",
          "Palm oil and rainforest destruction",
          "EU Deforestation Regulation compliance"
        ]
      },
      {
        title: "Methane Emissions",
        severity: "medium",
        description: "Livestock and rice production methane under increasing focus.",
        examples: [
          "JBS and meat industry climate impact reports",
          "Dairy industry methane reduction initiatives",
          "Global Methane Pledge implications"
        ]
      },
      {
        title: "Regenerative Agriculture Claims",
        severity: "medium",
        description: "Greenwashing concerns over soil carbon and sustainable farming claims.",
        examples: [
          "Skepticism of regenerative agriculture carbon credits",
          "Verification challenges for soil carbon sequestration",
          "Consumer confusion over sustainability labels"
        ]
      }
    ],
    resources: [
      {
        title: "Forest 500: Company Rankings",
        source: "Global Canopy",
        type: "report",
        url: "https://forest500.org/",
        year: 2024,
        description: "Annual assessment of companies on deforestation commitments."
      },
      {
        title: "Meat Atlas 2021",
        source: "Heinrich Böll Foundation",
        type: "report",
        url: "https://www.boell.de/en/meat-atlas",
        description: "Facts and figures about the animals we eat and climate impact."
      },
      {
        title: "Food and Land Use Coalition Report",
        source: "FOLU",
        type: "report",
        url: "https://www.foodandlandusecoalition.org/global-report/",
        description: "Analysis of sustainable food system transformation pathways."
      }
    ]
  },
  "retail": {
    name: "Retail & Consumer",
    icon: ShoppingBag,
    description: "Consumer-facing companies face heightened scrutiny from customers and advocacy groups.",
    riskLevel: "medium",
    considerations: [
      {
        title: "Supply Chain Transparency",
        severity: "high",
        description: "Consumer demand for visibility into manufacturing and sourcing.",
        examples: [
          "Fashion industry factory conditions and emissions",
          "Fast fashion sustainability backlash",
          "Scope 3 emissions disclosure pressure"
        ]
      },
      {
        title: "Packaging and Waste",
        severity: "medium",
        description: "Plastic packaging and product lifecycle under scrutiny.",
        examples: [
          "Single-use plastic commitments and progress",
          "Circular economy and recyclability claims",
          "Break Free From Plastic brand audits"
        ]
      },
      {
        title: "Product Carbon Footprint",
        severity: "medium",
        description: "Growing demand for product-level climate impact information.",
        examples: [
          "Carbon labeling initiatives",
          "LCA-based product comparisons",
          "Consumer apps tracking purchase impact"
        ]
      }
    ],
    resources: [
      {
        title: "Fashion Transparency Index",
        source: "Fashion Revolution",
        type: "report",
        url: "https://www.fashionrevolution.org/about/transparency/",
        year: 2024,
        description: "Annual ranking of fashion brand transparency on social and environmental issues."
      },
      {
        title: "Corporate Climate Responsibility Monitor",
        source: "NewClimate Institute",
        type: "report",
        url: "https://newclimate.org/resources/publications/corporate-climate-responsibility-monitor-2024",
        year: 2024,
        description: "Assessment of major companies' climate pledges and actions."
      },
      {
        title: "Scope 3 Standard",
        source: "GHG Protocol",
        type: "framework",
        url: "https://ghgprotocol.org/scope-3-standard",
        description: "Standard for accounting and reporting value chain emissions."
      }
    ]
  },
  "financial": {
    name: "Financial Services",
    icon: Landmark,
    description: "Banks, insurers, and asset managers face pressure over financed emissions and climate risk management.",
    riskLevel: "medium",
    considerations: [
      {
        title: "Financed Emissions",
        severity: "high",
        description: "Scrutiny of lending and investment portfolios' climate impact.",
        examples: [
          "ShareAction campaigns against fossil fuel financing",
          "Reclaim Finance analysis of bank fossil fuel exposure",
          "Net-Zero Banking Alliance commitments and criticism"
        ]
      },
      {
        title: "ESG Fund Credibility",
        severity: "high",
        description: "Greenwashing concerns in sustainable investment products.",
        examples: [
          "SEC and EU regulatory scrutiny of ESG labels",
          "DWS greenwashing investigation",
          "SFDR classification challenges"
        ]
      },
      {
        title: "Climate Risk Disclosure",
        severity: "medium",
        description: "Regulatory and investor pressure for scenario analysis and stress testing.",
        examples: [
          "Bank of England climate stress tests",
          "SEC climate disclosure rules",
          "TCFD implementation scrutiny"
        ]
      }
    ],
    resources: [
      {
        title: "Banking on Climate Chaos",
        source: "Rainforest Action Network",
        type: "report",
        url: "https://www.bankingonclimatechaos.org/",
        year: 2024,
        description: "Annual report on bank financing of fossil fuels."
      },
      {
        title: "Asset Manager Climate Scorecard",
        source: "ShareAction",
        type: "report",
        url: "https://shareaction.org/reports/asset-manager-climate-scorecard",
        description: "Assessment of asset managers' approach to climate change."
      },
      {
        title: "Net-Zero Asset Owner Alliance Progress Report",
        source: "UNEP FI",
        type: "report",
        url: "https://www.unepfi.org/net-zero-alliance/",
        description: "Progress tracking for institutional investor climate commitments."
      },
      {
        title: "NGFS Scenarios for Central Banks",
        source: "Network for Greening the Financial System",
        type: "framework",
        url: "https://www.ngfs.net/ngfs-scenarios-portal/",
        description: "Climate scenarios designed for financial sector stress testing."
      }
    ]
  },
  "technology": {
    name: "Technology",
    icon: Building2,
    description: "Tech companies face growing scrutiny over data center energy use and e-waste.",
    riskLevel: "low",
    considerations: [
      {
        title: "Data Center Energy",
        severity: "medium",
        description: "AI and cloud computing driving massive electricity demand growth.",
        examples: [
          "AI energy consumption concerns (ChatGPT, Gemini)",
          "Data center renewable energy procurement",
          "Hyperscaler environmental reports scrutiny"
        ]
      },
      {
        title: "E-Waste and Circular Economy",
        severity: "medium",
        description: "Product lifecycle and right-to-repair under increasing focus.",
        examples: [
          "Apple and Samsung repairability criticism",
          "Device upgrade cycles and environmental impact",
          "Rare earth and conflict mineral sourcing"
        ]
      },
      {
        title: "Net-Zero Claims Verification",
        severity: "low",
        description: "Tech company carbon neutrality claims receiving more scrutiny.",
        examples: [
          "Microsoft carbon negative commitment progress",
          "Google carbon neutral claims vs Scope 3",
          "Amazon climate pledge and delivery emissions"
        ]
      }
    ],
    resources: [
      {
        title: "Guide to Greener Electronics",
        source: "Greenpeace",
        type: "report",
        url: "https://www.greenpeace.org/usa/reports/guide-greener-electronics/",
        description: "Ranking of electronics companies on environmental practices."
      },
      {
        title: "Clicking Clean",
        source: "Greenpeace",
        type: "report",
        url: "https://www.greenpeace.org/usa/reports/click-clean/",
        description: "Assessment of tech companies' renewable energy commitments."
      },
      {
        title: "AI's Carbon Footprint",
        source: "MIT Technology Review",
        type: "news",
        url: "https://www.technologyreview.com/2024/02/06/1087739/ais-carbon-footprint-is-growing/",
        year: 2024,
        description: "Analysis of artificial intelligence energy consumption trends."
      }
    ]
  }
};

const getRiskColor = (level: "high" | "medium" | "low") => {
  switch (level) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
  }
};

const getResourceIcon = (type: Resource["type"]) => {
  switch (type) {
    case "report":
      return FileText;
    case "news":
      return Newspaper;
    case "paper":
      return BookOpen;
    case "framework":
      return Briefcase;
  }
};

const getResourceColor = (type: Resource["type"]) => {
  switch (type) {
    case "report":
      return "bg-blue-100 text-blue-700";
    case "news":
      return "bg-purple-100 text-purple-700";
    case "paper":
      return "bg-green-100 text-green-700";
    case "framework":
      return "bg-orange-100 text-orange-700";
  }
};

export default function ReputationalRiskPage() {
  const [selectedSector, setSelectedSector] = useState<string>("");

  const sector = selectedSector ? sectorData[selectedSector] : null;
  const SectorIcon = sector?.icon || Building2;

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
              <Shield className="w-6 h-6 text-rose-600" />
              <h1 className="text-xl font-semibold text-gray-900">Climate Reputational Risk</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Transition Risk: Reputational Exposure
            </CardTitle>
            <CardDescription>
              Reputational risk from climate change arises when stakeholders—investors, customers, employees, 
              regulators, and the public—perceive a company as failing to address climate challenges adequately. 
              This can lead to brand damage, customer loss, difficulty attracting talent, and reduced access to capital.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select your sector to view relevant reputational risk considerations:
              </label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Choose a sector..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                  <SelectItem value="utilities">Utilities & Power</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="aviation">Aviation</SelectItem>
                  <SelectItem value="agriculture">Agriculture & Food</SelectItem>
                  <SelectItem value="retail">Retail & Consumer</SelectItem>
                  <SelectItem value="financial">Financial Services</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {sector && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <Card className="border-l-4 border-l-rose-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <SectorIcon className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle>{sector.name}</CardTitle>
                      <CardDescription className="mt-1">{sector.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getRiskColor(sector.riskLevel)}>
                    {sector.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Reputational Risk Considerations</h2>
              <div className="grid gap-4">
                {sector.considerations.map((consideration, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{consideration.title}</CardTitle>
                        <Badge variant="outline" className={getRiskColor(consideration.severity)}>
                          {consideration.severity}
                        </Badge>
                      </div>
                      <CardDescription>{consideration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Recent examples:</p>
                        <ul className="space-y-1">
                          {consideration.examples.map((example, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-rose-500 mt-1">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports, Research & Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sector.resources.map((resource, index) => {
                  const ResourceIcon = getResourceIcon(resource.type);
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                            <ResourceIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-medium text-gray-900 line-clamp-2">{resource.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {resource.source} {resource.year && `(${resource.year})`}
                                </p>
                              </div>
                              <Badge variant="secondary" className="shrink-0 capitalize">
                                {resource.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{resource.description}</p>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                            >
                              View Resource
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">How to Use This Information</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    Review the risk considerations specific to your sector to identify potential exposure areas.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    Explore the linked reports and resources for detailed analysis and benchmarking data.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    Use insights to inform your climate communications strategy and stakeholder engagement.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    Monitor the news sources for emerging issues that could affect your organization.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {!sector && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Select a sector above to view reputational risk analysis</h3>
            <p className="text-gray-500 mt-2">
              Each sector has unique climate-related reputational considerations and curated resources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
