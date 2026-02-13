import type { InsertCompanyDependency } from "@shared/schema";

export const US_COMPANY_SEED_DATA: InsertCompanyDependency[] = [
  // === ENERGY - Oil & Gas ===
  {
    companyName: "ExxonMobil", ticker: "XOM", naicsCode: "324110", naicsDescription: "Petroleum Refineries",
    sector: "Energy", subsector: "Oil & Gas", hqState: "TX", hqRegion: "US",
    revenueRange: ">$100B", employees: "62,000",
    materialDependencies: [
      { name: "Crude Oil", criticality: "high", primarySource: "Permian Basin, Guyana, Middle East", notes: "Core feedstock for refining and upstream operations" },
      { name: "Natural Gas", criticality: "high", primarySource: "Appalachian Basin, Permian Basin", notes: "Fuel source and chemical feedstock" },
      { name: "Steel", criticality: "medium", primarySource: "US, China, South Korea", notes: "Pipeline and infrastructure construction" },
      { name: "Catalysts (Platinum, Palladium)", criticality: "medium", primarySource: "South Africa, Russia", notes: "Refinery catalytic processes" },
      { name: "Water Treatment Chemicals", criticality: "medium", primarySource: "US domestic", notes: "Process water treatment and cooling" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 55, criticality: "high", notes: "Primary fuel for refinery operations and power generation" },
      { source: "Petroleum/Diesel", percentOfTotal: 30, criticality: "high", notes: "Self-supplied for operations and fleet" },
      { source: "Grid Electricity", percentOfTotal: 10, criticality: "medium", notes: "Office and ancillary operations" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Growing solar installations at facilities" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Refinery cooling, steam generation, enhanced oil recovery", annualVolumeEstimate: ">500M gallons", waterStressExposure: "High in Permian Basin operations", notes: "Significant water user; increasing water recycling programs" },
    geographicDependencies: [
      { region: "Permian Basin, TX/NM", dependencyType: "Production", criticality: "high", notes: "Major upstream production area" },
      { region: "Gulf Coast, TX/LA", dependencyType: "Refining & Chemicals", criticality: "high", notes: "Baytown, Beaumont, Baton Rouge refineries" },
      { region: "Guyana", dependencyType: "Production", criticality: "high", notes: "Stabroek block - major growth area" },
      { region: "Papua New Guinea", dependencyType: "LNG Production", criticality: "medium", notes: "PNG LNG project" }
    ],
    supplyChainNotes: "Vertically integrated from exploration to retail. Exposed to OPEC+ production decisions and geopolitical disruptions.",
    climateRiskExposure: "Very High - stranded asset risk, carbon pricing, physical risk to coastal infrastructure",
    sources: "ExxonMobil 10-K, CDP disclosures, EPA TRI"
  },
  {
    companyName: "Chevron", ticker: "CVX", naicsCode: "324110", naicsDescription: "Petroleum Refineries",
    sector: "Energy", subsector: "Oil & Gas", hqState: "CA", hqRegion: "US",
    revenueRange: ">$100B", employees: "43,000",
    materialDependencies: [
      { name: "Crude Oil", criticality: "high", primarySource: "Permian Basin, Kazakhstan, Australia", notes: "Primary feedstock" },
      { name: "Natural Gas", criticality: "high", primarySource: "Permian Basin, Appalachian, Australia", notes: "LNG and domestic supply" },
      { name: "Steel & Iron", criticality: "medium", primarySource: "US, Japan, South Korea", notes: "Infrastructure and drilling" },
      { name: "Drilling Fluids & Chemicals", criticality: "medium", primarySource: "US, China", notes: "Barite, bentonite for drilling operations" },
      { name: "Sand/Proppant", criticality: "medium", primarySource: "Wisconsin, Texas", notes: "Hydraulic fracturing operations" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 50, criticality: "high", notes: "Operations and power generation" },
      { source: "Petroleum", percentOfTotal: 35, criticality: "high", notes: "Self-supplied fuels" },
      { source: "Grid Electricity", percentOfTotal: 10, criticality: "medium", notes: "Processing facilities" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Solar and wind at select facilities" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Drilling, refining, cooling", annualVolumeEstimate: ">400M gallons", waterStressExposure: "High in Permian Basin and Central Valley CA", notes: "Water recycling rate ~80% in Permian operations" },
    geographicDependencies: [
      { region: "Permian Basin, TX/NM", dependencyType: "Production", criticality: "high", notes: "Largest US production area" },
      { region: "Gulf of Mexico", dependencyType: "Offshore Production", criticality: "high", notes: "Deep water operations" },
      { region: "Kazakhstan (Tengiz)", dependencyType: "Production", criticality: "high", notes: "Major international asset" },
      { region: "Australia (Gorgon, Wheatstone)", dependencyType: "LNG", criticality: "high", notes: "Major LNG projects" }
    ],
    supplyChainNotes: "Integrated oil major with significant LNG exposure. Hess acquisition adds Guyana exposure.",
    climateRiskExposure: "Very High - stranded assets, carbon regulation, hurricane exposure in Gulf",
    sources: "Chevron 10-K, Sustainability Report, EPA data"
  },

  // === ENERGY - Utilities ===
  {
    companyName: "NextEra Energy", ticker: "NEE", naicsCode: "221112", naicsDescription: "Electric Power Distribution",
    sector: "Utilities", subsector: "Electric Utilities", hqState: "FL", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "16,800",
    materialDependencies: [
      { name: "Solar Panels (Silicon, Glass)", criticality: "high", primarySource: "China, Southeast Asia, US", notes: "Largest renewable energy generator globally" },
      { name: "Wind Turbine Components", criticality: "high", primarySource: "Denmark, Germany, US", notes: "Wind blade composites, rare earth magnets" },
      { name: "Lithium-ion Batteries", criticality: "high", primarySource: "China, South Korea, US", notes: "Energy storage systems" },
      { name: "Copper Wire & Cable", criticality: "medium", primarySource: "Chile, Peru, US", notes: "Transmission and distribution" },
      { name: "Concrete & Steel", criticality: "medium", primarySource: "US domestic", notes: "Foundation and tower construction" }
    ],
    energyDependencies: [
      { source: "Wind", percentOfTotal: 35, criticality: "high", notes: "Major wind farm portfolio" },
      { source: "Solar", percentOfTotal: 25, criticality: "high", notes: "Rapidly growing solar capacity" },
      { source: "Natural Gas", percentOfTotal: 30, criticality: "high", notes: "FPL gas-fired generation in Florida" },
      { source: "Nuclear", percentOfTotal: 10, criticality: "medium", notes: "FPL nuclear plants in Florida" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Cooling for thermal and nuclear plants", annualVolumeEstimate: "~200M gallons", waterStressExposure: "Moderate - Florida operations less water-stressed", notes: "Renewables have minimal water use; gas/nuclear plants use significant cooling water" },
    geographicDependencies: [
      { region: "Florida", dependencyType: "Regulated utility service territory", criticality: "high", notes: "FPL serves 12M+ people" },
      { region: "Central US (TX, OK, IA)", dependencyType: "Wind generation", criticality: "high", notes: "Major wind corridor operations" },
      { region: "Southwest US (CA, AZ)", dependencyType: "Solar generation", criticality: "high", notes: "High solar irradiance areas" }
    ],
    supplyChainNotes: "Dependent on Chinese solar panel supply chain and rare earth materials for wind turbines.",
    climateRiskExposure: "Medium - benefits from energy transition but Florida assets exposed to hurricanes and sea level rise",
    sources: "NextEra 10-K, Sustainability Report"
  },
  {
    companyName: "Duke Energy", ticker: "DUK", naicsCode: "221112", naicsDescription: "Electric Power Distribution",
    sector: "Utilities", subsector: "Electric Utilities", hqState: "NC", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "27,600",
    materialDependencies: [
      { name: "Natural Gas", criticality: "high", primarySource: "Appalachian Basin, Gulf Coast", notes: "Primary fuel for thermal generation" },
      { name: "Coal", criticality: "medium", primarySource: "Appalachia, Powder River Basin", notes: "Declining but still significant; retirement planned" },
      { name: "Uranium Fuel", criticality: "medium", primarySource: "Kazakhstan, Canada, Australia", notes: "Nuclear fleet fuel" },
      { name: "Transmission Equipment (Transformers)", criticality: "high", primarySource: "US, Mexico, Germany", notes: "Grid infrastructure; long lead times" },
      { name: "Copper & Aluminum Conductors", criticality: "medium", primarySource: "Chile, Peru, US, Canada", notes: "Grid wiring and transmission lines" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 40, criticality: "high", notes: "Growing share as coal retires" },
      { source: "Nuclear", percentOfTotal: 25, criticality: "high", notes: "6 nuclear plants" },
      { source: "Coal", percentOfTotal: 15, criticality: "medium", notes: "Declining, retirement by 2035" },
      { source: "Renewable (Solar, Wind)", percentOfTotal: 15, criticality: "medium", notes: "Rapidly growing" },
      { source: "Hydro", percentOfTotal: 5, criticality: "low", notes: "Conventional hydro in Carolinas" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Thermal and nuclear plant cooling", annualVolumeEstimate: ">1B gallons", waterStressExposure: "Moderate - Southeast US generally water-abundant", notes: "Nuclear plants are largest water users; drought can reduce hydro output" },
    geographicDependencies: [
      { region: "Carolinas (NC, SC)", dependencyType: "Regulated service territory", criticality: "high", notes: "Largest service area" },
      { region: "Florida", dependencyType: "Regulated service territory", criticality: "high", notes: "Duke Energy Florida" },
      { region: "Indiana, Ohio, Kentucky", dependencyType: "Regulated service territory", criticality: "medium", notes: "Midwest operations" }
    ],
    supplyChainNotes: "Transformer supply chain constraints affecting grid modernization. Coal supply from Appalachian mines declining.",
    climateRiskExposure: "High - coal retirement costs, hurricane exposure, water availability for cooling",
    sources: "Duke Energy 10-K, IRP filings"
  },

  // === TECHNOLOGY ===
  {
    companyName: "Apple", ticker: "AAPL", naicsCode: "334220", naicsDescription: "Radio and Television Broadcasting and Wireless Communications Equipment Manufacturing",
    sector: "Technology", subsector: "Consumer Electronics", hqState: "CA", hqRegion: "US",
    revenueRange: ">$100B", employees: "164,000",
    materialDependencies: [
      { name: "Semiconductors (Advanced Chips)", criticality: "high", primarySource: "Taiwan (TSMC), South Korea (Samsung)", notes: "A-series and M-series chips; single-source dependency on TSMC" },
      { name: "Lithium (Battery Cells)", criticality: "high", primarySource: "China, Chile, Australia", notes: "iPhone, iPad, Mac, Watch batteries" },
      { name: "Cobalt", criticality: "high", primarySource: "DRC (Congo), Australia", notes: "Battery cathodes; reducing cobalt content over time" },
      { name: "Rare Earth Elements", criticality: "high", primarySource: "China (90%+ of processing)", notes: "Magnets, haptics, speakers" },
      { name: "Aluminum", criticality: "medium", primarySource: "China, Russia, Canada, UAE", notes: "Device enclosures and chassis" }
    ],
    energyDependencies: [
      { source: "Grid Electricity (Renewable)", percentOfTotal: 75, criticality: "high", notes: "100% renewable energy for corporate operations since 2018" },
      { source: "Grid Electricity (Non-renewable)", percentOfTotal: 15, criticality: "medium", notes: "Supplier manufacturing; significant Scope 3" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Data center backup" },
      { source: "Solar (On-site)", percentOfTotal: 5, criticality: "low", notes: "Apple Park and facility rooftop solar" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Data center cooling, campus landscaping", annualVolumeEstimate: "~50M gallons", waterStressExposure: "Moderate - California HQ in water-stressed region", notes: "Low direct water use; supply chain water use in semiconductor fabs is very high" },
    geographicDependencies: [
      { region: "Taiwan", dependencyType: "Semiconductor fabrication (TSMC)", criticality: "high", notes: "Critical single point of failure for chip supply" },
      { region: "China (Shenzhen, Zhengzhou)", dependencyType: "Final assembly (Foxconn, Pegatron)", criticality: "high", notes: "Majority of device assembly" },
      { region: "India", dependencyType: "Growing assembly", criticality: "medium", notes: "Diversifying from China" },
      { region: "Vietnam", dependencyType: "Component manufacturing", criticality: "medium", notes: "AirPods and accessories" }
    ],
    supplyChainNotes: "Highly concentrated supply chain risk in Taiwan (chips) and China (assembly). Actively diversifying to India and Vietnam.",
    climateRiskExposure: "Medium - supply chain disruption from extreme weather in Asia; water stress at semiconductor fabs",
    sources: "Apple 10-K, Environmental Progress Report, Supplier Responsibility Report"
  },
  {
    companyName: "Microsoft", ticker: "MSFT", naicsCode: "511210", naicsDescription: "Software Publishers",
    sector: "Technology", subsector: "Software & Cloud", hqState: "WA", hqRegion: "US",
    revenueRange: ">$100B", employees: "228,000",
    materialDependencies: [
      { name: "Servers & Networking Equipment", criticality: "high", primarySource: "Taiwan, China, US", notes: "Azure data center hardware" },
      { name: "Semiconductors (GPUs, CPUs)", criticality: "high", primarySource: "Taiwan (TSMC), US (Intel, NVIDIA design)", notes: "AI and cloud computing infrastructure" },
      { name: "Fiber Optic Cable", criticality: "medium", primarySource: "US, Japan", notes: "Network connectivity between data centers" },
      { name: "Concrete & Steel", criticality: "medium", primarySource: "Local to DC sites", notes: "Data center construction" },
      { name: "Lithium Batteries (UPS)", criticality: "medium", primarySource: "China, South Korea", notes: "Data center backup power" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 60, criticality: "high", notes: "Data center primary power" },
      { source: "Renewable PPAs (Wind/Solar)", percentOfTotal: 30, criticality: "high", notes: "Committed to 100% renewable by 2025" },
      { source: "Diesel (Backup Generators)", percentOfTotal: 5, criticality: "medium", notes: "Data center backup; transitioning to clean alternatives" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Some campus heating" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Data center cooling", annualVolumeEstimate: ">7B liters globally", waterStressExposure: "High - several DCs in water-stressed regions (AZ, TX)", notes: "Committed to water positive by 2030; exploring air cooling and immersion cooling" },
    geographicDependencies: [
      { region: "Virginia (Loudoun County)", dependencyType: "Data center concentration", criticality: "high", notes: "Major Azure region" },
      { region: "Iowa, Texas, Arizona", dependencyType: "Data center regions", criticality: "high", notes: "Large-scale DC campuses" },
      { region: "Ireland, Netherlands", dependencyType: "European data centers", criticality: "high", notes: "EU data sovereignty compliance" },
      { region: "Taiwan", dependencyType: "Semiconductor supply", criticality: "high", notes: "GPU and server chip supply" }
    ],
    supplyChainNotes: "Massive data center build-out driving demand for GPUs, power, and water. AI expansion significantly increasing energy and chip demand.",
    climateRiskExposure: "Medium - data center power/water demand growing; heat events stress cooling; supply chain semiconductor concentration",
    sources: "Microsoft 10-K, Environmental Sustainability Report"
  },
  {
    companyName: "Alphabet (Google)", ticker: "GOOGL", naicsCode: "519130", naicsDescription: "Internet Publishing and Broadcasting and Web Search Portals",
    sector: "Technology", subsector: "Internet Services", hqState: "CA", hqRegion: "US",
    revenueRange: ">$100B", employees: "182,000",
    materialDependencies: [
      { name: "Custom Server Hardware", criticality: "high", primarySource: "Taiwan, China", notes: "TPUs and custom servers for AI workloads" },
      { name: "Semiconductors (TPU, GPU)", criticality: "high", primarySource: "Taiwan (TSMC), US (Broadcom designs)", notes: "AI training and inference chips" },
      { name: "Fiber Optic (Subsea Cables)", criticality: "high", primarySource: "US, Japan, France", notes: "Private subsea cable network" },
      { name: "Steel & Concrete", criticality: "medium", primarySource: "Local sourcing", notes: "Data center construction" },
      { name: "Lithium Batteries", criticality: "medium", primarySource: "China, South Korea", notes: "UPS and EV fleet" }
    ],
    energyDependencies: [
      { source: "Renewable PPAs (Solar/Wind)", percentOfTotal: 60, criticality: "high", notes: "Matched 100% renewable since 2017" },
      { source: "Grid Electricity", percentOfTotal: 30, criticality: "high", notes: "DC baseload power" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Campus operations" },
      { source: "Diesel Backup", percentOfTotal: 5, criticality: "medium", notes: "DC reliability" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Data center evaporative cooling", annualVolumeEstimate: ">5B gallons", waterStressExposure: "High in western US data centers", notes: "120% water replenishment target by 2030" },
    geographicDependencies: [
      { region: "Oregon (The Dalles)", dependencyType: "Data center hub", criticality: "high", notes: "Major DC cluster near Columbia River" },
      { region: "Iowa, South Carolina, Nevada", dependencyType: "US data centers", criticality: "high", notes: "Distributed DC presence" },
      { region: "Taiwan", dependencyType: "Chip fabrication", criticality: "high", notes: "TPU and server chips" },
      { region: "Singapore, Finland", dependencyType: "International DCs", criticality: "medium", notes: "Regional coverage" }
    ],
    supplyChainNotes: "Designing own AI chips (TPUs) to reduce NVIDIA dependence. Massive energy procurement driving new renewable capacity.",
    climateRiskExposure: "Medium - AI-driven energy demand surge; water stress in western DC locations; physical risk to coastal fiber landing stations",
    sources: "Alphabet 10-K, Environmental Report"
  },

  // === AUTOMOTIVE ===
  {
    companyName: "General Motors", ticker: "GM", naicsCode: "336111", naicsDescription: "Automobile Manufacturing",
    sector: "Manufacturing", subsector: "Automotive", hqState: "MI", hqRegion: "US",
    revenueRange: ">$100B", employees: "167,000",
    materialDependencies: [
      { name: "Steel", criticality: "high", primarySource: "US, Canada, South Korea, Japan", notes: "Vehicle body and structural components" },
      { name: "Aluminum", criticality: "high", primarySource: "Canada, US, China", notes: "Engine blocks, body panels, EV battery enclosures" },
      { name: "Lithium", criticality: "high", primarySource: "Australia, Chile, Argentina", notes: "Ultium EV battery cells" },
      { name: "Nickel", criticality: "high", primarySource: "Indonesia, Philippines, Russia", notes: "EV battery cathode material" },
      { name: "Semiconductors", criticality: "high", primarySource: "Taiwan, South Korea, US", notes: "Vehicle electronics and ADAS systems" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 45, criticality: "high", notes: "Assembly plant operations" },
      { source: "Natural Gas", percentOfTotal: 40, criticality: "high", notes: "Paint shops, heating, metal stamping" },
      { source: "Renewable", percentOfTotal: 10, criticality: "medium", notes: "On-site solar and renewable PPAs" },
      { source: "Diesel/Propane", percentOfTotal: 5, criticality: "low", notes: "Material handling and logistics" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Paint processes, cooling, metal treatment", annualVolumeEstimate: ">3B gallons", waterStressExposure: "Moderate - Great Lakes region relatively water-secure", notes: "Paint shops are largest water consumer; closed-loop systems reducing intake" },
    geographicDependencies: [
      { region: "Michigan (Detroit area)", dependencyType: "HQ, engineering, assembly", criticality: "high", notes: "Factory ZERO, Orion Assembly" },
      { region: "Mexico (Silao, Ramos Arizpe)", dependencyType: "Assembly plants", criticality: "high", notes: "Trucks and crossovers" },
      { region: "South Korea (LG partnership)", dependencyType: "Battery cell manufacturing", criticality: "high", notes: "Ultium Cells JV" },
      { region: "China", dependencyType: "Assembly and market", criticality: "medium", notes: "SAIC-GM joint venture" }
    ],
    supplyChainNotes: "EV transition creating new supply chain dependencies on battery minerals. Chip shortage of 2021-2023 revealed semiconductor vulnerability.",
    climateRiskExposure: "High - ICE phase-out risk, EV battery mineral supply constraints, extreme weather plant disruptions",
    sources: "GM 10-K, Sustainability Report, USGS mineral data"
  },
  {
    companyName: "Ford Motor", ticker: "F", naicsCode: "336111", naicsDescription: "Automobile Manufacturing",
    sector: "Manufacturing", subsector: "Automotive", hqState: "MI", hqRegion: "US",
    revenueRange: ">$100B", employees: "177,000",
    materialDependencies: [
      { name: "Steel (High-Strength)", criticality: "high", primarySource: "US, Canada, Japan", notes: "F-Series truck bodies and frames" },
      { name: "Aluminum", criticality: "high", primarySource: "Canada, US, Australia", notes: "F-150 body (military-grade aluminum)" },
      { name: "Lithium", criticality: "high", primarySource: "Australia, Chile", notes: "EV batteries for Mustang Mach-E, F-150 Lightning" },
      { name: "Semiconductors", criticality: "high", primarySource: "Taiwan, Malaysia, US", notes: "Vehicle electronics" },
      { name: "Rubber (Natural & Synthetic)", criticality: "medium", primarySource: "Thailand, Indonesia, US", notes: "Tires, seals, gaskets" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 45, criticality: "high", notes: "Assembly and stamping plants" },
      { source: "Grid Electricity", percentOfTotal: 40, criticality: "high", notes: "Manufacturing operations" },
      { source: "Renewable", percentOfTotal: 10, criticality: "medium", notes: "Growing solar and wind PPAs" },
      { source: "Diesel", percentOfTotal: 5, criticality: "low", notes: "Material handling" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Paint, cooling, machining", annualVolumeEstimate: ">2B gallons", waterStressExposure: "Moderate - Midwest plants; some Mexico plants in stressed areas", notes: "Rouge Complex on Detroit River; water recycling programs" },
    geographicDependencies: [
      { region: "Michigan (Dearborn, Wayne)", dependencyType: "HQ, assembly, engineering", criticality: "high", notes: "Rouge Complex, Michigan Assembly" },
      { region: "Kentucky (Louisville)", dependencyType: "Assembly", criticality: "high", notes: "Ford Super Duty, Escape" },
      { region: "Mexico", dependencyType: "Assembly plants", criticality: "high", notes: "Hermosillo, Cuautitlan" },
      { region: "Tennessee (BlueOval City)", dependencyType: "EV manufacturing", criticality: "high", notes: "New EV and battery plant" }
    ],
    supplyChainNotes: "Heavy truck/SUV mix means high steel and aluminum consumption. EV transition creating parallel supply chains.",
    climateRiskExposure: "High - ICE vehicle transition risk, flooding risk at Kentucky plant (2022 event), mineral supply chain",
    sources: "Ford 10-K, Integrated Sustainability Report"
  },

  // === RETAIL & CONSUMER ===
  {
    companyName: "Walmart", ticker: "WMT", naicsCode: "452210", naicsDescription: "Department Stores",
    sector: "Retail", subsector: "General Merchandise", hqState: "AR", hqRegion: "US",
    revenueRange: ">$100B", employees: "2,100,000",
    materialDependencies: [
      { name: "Diesel Fuel", criticality: "high", primarySource: "US domestic refineries", notes: "10,000+ truck fleet for distribution" },
      { name: "Refrigerants (HFCs)", criticality: "medium", primarySource: "US, China", notes: "Store and distribution center cooling" },
      { name: "Packaging Materials (Cardboard, Plastic)", criticality: "high", primarySource: "US, China", notes: "Product packaging and shipping" },
      { name: "Concrete & Steel", criticality: "medium", primarySource: "US domestic", notes: "Store construction and renovation" },
      { name: "Food Products (Perishables)", criticality: "high", primarySource: "US agricultural regions, Mexico, Chile", notes: "Fresh produce supply chain" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 70, criticality: "high", notes: "4,700+ US stores, lighting, HVAC, refrigeration" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "medium", notes: "Store heating" },
      { source: "Diesel", percentOfTotal: 10, criticality: "high", notes: "Distribution fleet" },
      { source: "Renewable (On-site Solar)", percentOfTotal: 10, criticality: "medium", notes: "Rooftop solar on 600+ facilities" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Store operations, landscaping, food prep", annualVolumeEstimate: ">10B gallons across all stores", waterStressExposure: "Moderate - stores in diverse climates; food supply chain water-intensive", notes: "Largest private employer; water use distributed across thousands of locations" },
    geographicDependencies: [
      { region: "Arkansas (Bentonville)", dependencyType: "HQ, distribution hub", criticality: "high", notes: "Corporate and logistics center" },
      { region: "US Southeast & Midwest", dependencyType: "Store concentration", criticality: "high", notes: "Highest store density regions" },
      { region: "China", dependencyType: "Product sourcing", criticality: "high", notes: "Major supplier base for general merchandise" },
      { region: "Mexico, Central America", dependencyType: "Fresh produce sourcing", criticality: "medium", notes: "Year-round produce supply" }
    ],
    supplyChainNotes: "World's largest company by revenue. Massive global supply chain; Project Gigaton aims to cut 1 GT emissions from supply chain.",
    climateRiskExposure: "Medium - food supply chain disruption, hurricane/storm risk to stores, fleet electrification costs",
    sources: "Walmart 10-K, ESG Report, CDP disclosure"
  },
  {
    companyName: "Amazon", ticker: "AMZN", naicsCode: "454110", naicsDescription: "Electronic Shopping and Mail-Order Houses",
    sector: "Technology/Retail", subsector: "E-Commerce & Cloud", hqState: "WA", hqRegion: "US",
    revenueRange: ">$100B", employees: "1,500,000",
    materialDependencies: [
      { name: "Cardboard/Packaging", criticality: "high", primarySource: "US, Canada", notes: "Billions of packages annually" },
      { name: "Server Hardware", criticality: "high", primarySource: "Taiwan, China, US", notes: "AWS infrastructure" },
      { name: "Diesel Fuel", criticality: "high", primarySource: "US domestic", notes: "Delivery fleet and logistics" },
      { name: "Semiconductors (Graviton chips)", criticality: "high", primarySource: "Taiwan (TSMC)", notes: "Custom AWS chips" },
      { name: "Lithium Batteries (EVs)", criticality: "medium", primarySource: "China, South Korea", notes: "Electric delivery vans (Rivian)" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 50, criticality: "high", notes: "Fulfillment centers and AWS" },
      { source: "Renewable PPAs", percentOfTotal: 25, criticality: "high", notes: "Largest corporate renewable buyer" },
      { source: "Diesel/Gasoline", percentOfTotal: 15, criticality: "high", notes: "Last-mile delivery fleet" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "medium", notes: "Facility heating" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "AWS data center cooling, fulfillment center operations", annualVolumeEstimate: ">5B gallons", waterStressExposure: "High for western US data centers", notes: "Water positive goal; significant data center expansion driving water demand" },
    geographicDependencies: [
      { region: "Virginia (Northern VA)", dependencyType: "AWS data center hub", criticality: "high", notes: "Largest AWS region (US-East-1)" },
      { region: "Seattle, WA", dependencyType: "HQ and operations", criticality: "high", notes: "Corporate headquarters" },
      { region: "Ohio, Oregon, Texas", dependencyType: "AWS regions and fulfillment", criticality: "high", notes: "Major infrastructure" },
      { region: "China, India", dependencyType: "Product sourcing and marketplace", criticality: "high", notes: "Third-party seller supply base" }
    ],
    supplyChainNotes: "Dual business: retail logistics and cloud computing. Both have massive energy, material, and geographic dependencies.",
    climateRiskExposure: "Medium - delivery logistics emissions, data center energy/water, extreme weather disrupting fulfillment",
    sources: "Amazon 10-K, Sustainability Report"
  },

  // === AGRICULTURE & FOOD ===
  {
    companyName: "Cargill", ticker: null, naicsCode: "311211", naicsDescription: "Flour Milling",
    sector: "Agriculture & Food", subsector: "Agricultural Commodities", hqState: "MN", hqRegion: "US",
    revenueRange: ">$100B", employees: "160,000",
    materialDependencies: [
      { name: "Corn", criticality: "high", primarySource: "US Midwest (Iowa, Illinois, Indiana)", notes: "Feed, ethanol, sweeteners, starch" },
      { name: "Soybeans", criticality: "high", primarySource: "US Midwest, Brazil, Argentina", notes: "Soybean oil, meal, animal feed" },
      { name: "Wheat", criticality: "high", primarySource: "US Great Plains, Canada, Australia", notes: "Flour milling operations" },
      { name: "Palm Oil", criticality: "medium", primarySource: "Indonesia, Malaysia", notes: "Food ingredients; deforestation risk" },
      { name: "Beef Cattle", criticality: "high", primarySource: "US Great Plains, Midwest", notes: "Largest US beef processor" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 40, criticality: "high", notes: "Processing plants, grain drying" },
      { source: "Grid Electricity", percentOfTotal: 30, criticality: "high", notes: "Manufacturing operations" },
      { source: "Diesel", percentOfTotal: 20, criticality: "high", notes: "Agricultural logistics, barges, trucks" },
      { source: "Biomass/Renewable", percentOfTotal: 10, criticality: "low", notes: "Some facilities use agricultural waste" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Food processing, meat processing, grain washing", annualVolumeEstimate: ">50B gallons (including agricultural supply chain)", waterStressExposure: "Very High - agricultural water use dependent on rainfall and irrigation", notes: "Entire business model depends on agricultural water availability" },
    geographicDependencies: [
      { region: "US Midwest (IA, IL, MN, NE)", dependencyType: "Grain sourcing and processing", criticality: "high", notes: "Core agricultural belt" },
      { region: "Brazil (Mato Grosso)", dependencyType: "Soybean sourcing", criticality: "high", notes: "Second largest soy origin" },
      { region: "Gulf Coast ports", dependencyType: "Export terminals", criticality: "high", notes: "Grain export infrastructure" },
      { region: "Indonesia/Malaysia", dependencyType: "Palm oil sourcing", criticality: "medium", notes: "Tropical supply chains" }
    ],
    supplyChainNotes: "Largest privately held company in US. Controls significant portions of global grain trade. Deforestation exposure in Brazil/SE Asia.",
    climateRiskExposure: "Very High - crop yield sensitivity to drought/heat, water scarcity in ag regions, deforestation regulation risk",
    sources: "Cargill Sustainability Report, USDA data, CDP"
  },
  {
    companyName: "Tyson Foods", ticker: "TSN", naicsCode: "311611", naicsDescription: "Animal (except Poultry) Slaughtering",
    sector: "Agriculture & Food", subsector: "Meat Processing", hqState: "AR", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "142,000",
    materialDependencies: [
      { name: "Corn (Animal Feed)", criticality: "high", primarySource: "US Midwest", notes: "Primary feed ingredient for poultry and cattle" },
      { name: "Soybean Meal", criticality: "high", primarySource: "US Midwest", notes: "Protein component of animal feed" },
      { name: "Live Cattle", criticality: "high", primarySource: "Texas, Kansas, Nebraska", notes: "Beef processing operations" },
      { name: "Live Poultry", criticality: "high", primarySource: "US Southeast (AR, GA, AL)", notes: "Vertically integrated poultry operations" },
      { name: "Packaging (Plastic, Cardboard)", criticality: "medium", primarySource: "US domestic", notes: "Food-grade packaging materials" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 45, criticality: "high", notes: "Processing plant heating, rendering" },
      { source: "Grid Electricity", percentOfTotal: 40, criticality: "high", notes: "Refrigeration, processing" },
      { source: "Diesel", percentOfTotal: 10, criticality: "medium", notes: "Refrigerated transport fleet" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Biogas from waste, some solar" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Animal processing, sanitation, cooling", annualVolumeEstimate: ">10B gallons", waterStressExposure: "Moderate to High - Kansas and Texas operations in water-stressed areas", notes: "Meat processing is extremely water-intensive; USDA sanitation requirements" },
    geographicDependencies: [
      { region: "Arkansas", dependencyType: "HQ, poultry processing", criticality: "high", notes: "Core poultry operations" },
      { region: "Kansas, Nebraska, Texas", dependencyType: "Beef processing", criticality: "high", notes: "Near cattle feedlots" },
      { region: "US Midwest", dependencyType: "Feed grain sourcing", criticality: "high", notes: "Corn Belt supply" },
      { region: "US Southeast", dependencyType: "Poultry operations", criticality: "high", notes: "Georgia, Alabama, North Carolina" }
    ],
    supplyChainNotes: "Vertically integrated in poultry. Dependent on corn/soy prices and availability. Animal disease risk (avian flu).",
    climateRiskExposure: "Very High - drought affecting feed/water costs, heat stress on animals, methane regulation, consumer preference shift",
    sources: "Tyson 10-K, Sustainability Report"
  },

  // === CHEMICALS ===
  {
    companyName: "Dow", ticker: "DOW", naicsCode: "325110", naicsDescription: "Petrochemical Manufacturing",
    sector: "Chemicals", subsector: "Petrochemicals", hqState: "MI", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "35,900",
    materialDependencies: [
      { name: "Ethane/Ethylene", criticality: "high", primarySource: "US Gulf Coast (shale gas)", notes: "Primary petrochemical feedstock" },
      { name: "Propylene", criticality: "high", primarySource: "US Gulf Coast", notes: "Plastics and chemical intermediates" },
      { name: "Natural Gas Liquids", criticality: "high", primarySource: "Permian Basin, Marcellus Shale", notes: "Feedstock advantage from US shale" },
      { name: "Chlorine/Caustic Soda", criticality: "medium", primarySource: "US Gulf Coast", notes: "Electrochemical processes" },
      { name: "Silicones (Silicon Metal)", criticality: "medium", primarySource: "China, Brazil, Norway", notes: "Specialty silicone products" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 50, criticality: "high", notes: "Process heat and feedstock" },
      { source: "Grid Electricity", percentOfTotal: 30, criticality: "high", notes: "Electrolysis and motors" },
      { source: "Steam (Co-generation)", percentOfTotal: 15, criticality: "high", notes: "Integrated steam systems" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Growing renewable procurement" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Cooling, process water, steam generation", annualVolumeEstimate: ">20B gallons", waterStressExposure: "Moderate - Gulf Coast operations; Texas sites have moderate stress", notes: "Chemical manufacturing is extremely water-intensive; uses once-through cooling in some plants" },
    geographicDependencies: [
      { region: "Gulf Coast (TX, LA)", dependencyType: "Manufacturing complex", criticality: "high", notes: "Freeport TX is one of largest integrated chemical sites globally" },
      { region: "Michigan (Midland)", dependencyType: "HQ, specialty chemicals", criticality: "high", notes: "Historic operations center" },
      { region: "Germany (Stade)", dependencyType: "European manufacturing", criticality: "medium", notes: "EU chemical production" },
      { region: "Saudi Arabia (Sadara JV)", dependencyType: "Joint venture", criticality: "medium", notes: "JV with Saudi Aramco" }
    ],
    supplyChainNotes: "Feedstock cost advantage from US shale gas. Hurricane exposure on Gulf Coast. Circular economy initiatives for plastics.",
    climateRiskExposure: "Very High - Gulf Coast hurricane/flood risk, carbon-intensive operations, plastic waste regulation",
    sources: "Dow 10-K, Sustainability Report, EPA TRI"
  },

  // === FINANCIAL SERVICES ===
  {
    companyName: "JPMorgan Chase", ticker: "JPM", naicsCode: "522110", naicsDescription: "Commercial Banking",
    sector: "Financial Services", subsector: "Banking", hqState: "NY", hqRegion: "US",
    revenueRange: ">$100B", employees: "309,000",
    materialDependencies: [
      { name: "Data Center Infrastructure", criticality: "high", primarySource: "US, Asia", notes: "Servers, networking, storage for trading and banking systems" },
      { name: "Office Real Estate", criticality: "medium", primarySource: "US major cities", notes: "4,700+ branches, major office towers" },
      { name: "Paper & Printing", criticality: "low", primarySource: "US domestic", notes: "Declining with digitization" },
      { name: "Semiconductors (Computing)", criticality: "medium", primarySource: "Taiwan, US", notes: "Trading infrastructure, AI systems" },
      { name: "Power Equipment (UPS, Generators)", criticality: "medium", primarySource: "US, Germany", notes: "Business continuity infrastructure" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 75, criticality: "high", notes: "Office buildings, data centers, branches" },
      { source: "Renewable PPAs", percentOfTotal: 15, criticality: "medium", notes: "Expanding renewable procurement" },
      { source: "Natural Gas", percentOfTotal: 8, criticality: "low", notes: "Building heating" },
      { source: "Diesel Backup", percentOfTotal: 2, criticality: "medium", notes: "Data center and trading floor backup" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Office HVAC, data center cooling", annualVolumeEstimate: "~500M gallons", waterStressExposure: "Low - primarily office-based", notes: "Direct operations low water intensity; financed portfolio has high water exposure" },
    geographicDependencies: [
      { region: "New York City", dependencyType: "Global HQ, trading operations", criticality: "high", notes: "Critical trading and investment banking hub" },
      { region: "Delaware, Ohio, Texas", dependencyType: "Operations centers", criticality: "high", notes: "Processing and technology centers" },
      { region: "London, Hong Kong", dependencyType: "International operations", criticality: "high", notes: "Global banking operations" }
    ],
    supplyChainNotes: "Financial services; primary climate risk through lending/investment portfolio exposure to carbon-intensive sectors.",
    climateRiskExposure: "Medium direct, High indirect - Scope 3 financed emissions from fossil fuel lending; real estate portfolio physical risk",
    sources: "JPM 10-K, ESG Report, TCFD disclosure"
  },

  // === HEALTHCARE / PHARMA ===
  {
    companyName: "Johnson & Johnson", ticker: "JNJ", naicsCode: "325412", naicsDescription: "Pharmaceutical Preparation Manufacturing",
    sector: "Healthcare", subsector: "Pharmaceuticals & MedTech", hqState: "NJ", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "132,000",
    materialDependencies: [
      { name: "Active Pharmaceutical Ingredients (APIs)", criticality: "high", primarySource: "US, Ireland, India, China", notes: "Drug substance manufacturing" },
      { name: "Medical-Grade Plastics", criticality: "high", primarySource: "US, Germany, Japan", notes: "Device housings, syringes, packaging" },
      { name: "Titanium (Medical Implants)", criticality: "high", primarySource: "US, Russia, China", notes: "Orthopedic implants" },
      { name: "Glass Vials & Syringes", criticality: "high", primarySource: "US, Germany (Schott)", notes: "Drug delivery and packaging" },
      { name: "Specialty Chemicals (Excipients)", criticality: "medium", primarySource: "US, Europe", notes: "Pharmaceutical formulation ingredients" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 50, criticality: "high", notes: "Manufacturing and R&D labs" },
      { source: "Natural Gas", percentOfTotal: 30, criticality: "high", notes: "Steam generation, clean rooms" },
      { source: "Renewable", percentOfTotal: 15, criticality: "medium", notes: "On-site and PPA renewable energy" },
      { source: "Diesel/Oil", percentOfTotal: 5, criticality: "low", notes: "Backup and logistics" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Pharmaceutical manufacturing, cleaning, cooling", annualVolumeEstimate: ">2B gallons", waterStressExposure: "Moderate - some manufacturing in water-stressed regions", notes: "Pharma requires ultra-pure water (WFI); strict FDA requirements" },
    geographicDependencies: [
      { region: "New Jersey", dependencyType: "HQ and R&D", criticality: "high", notes: "New Brunswick HQ, multiple NJ sites" },
      { region: "Ireland (Cork, Limerick)", dependencyType: "Manufacturing hub", criticality: "high", notes: "Major pharma manufacturing for tax and supply reasons" },
      { region: "India", dependencyType: "API sourcing", criticality: "medium", notes: "Generic API supply" },
      { region: "Belgium, Switzerland", dependencyType: "European R&D and manufacturing", criticality: "medium", notes: "Janssen operations" }
    ],
    supplyChainNotes: "Cold chain logistics critical. API supply from India/China is a strategic vulnerability. MedTech devices require rare metals.",
    climateRiskExposure: "Medium - supply chain disruption risk, cold chain energy costs, manufacturing water needs",
    sources: "J&J 10-K, ESG Performance Report"
  },

  // === AEROSPACE & DEFENSE ===
  {
    companyName: "Boeing", ticker: "BA", naicsCode: "336411", naicsDescription: "Aircraft Manufacturing",
    sector: "Aerospace & Defense", subsector: "Commercial & Defense Aircraft", hqState: "VA", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "171,000",
    materialDependencies: [
      { name: "Aluminum Alloys (Aerospace Grade)", criticality: "high", primarySource: "US (Alcoa), Canada, Russia", notes: "Fuselage and structural components" },
      { name: "Carbon Fiber Composites", criticality: "high", primarySource: "Japan (Toray), US", notes: "787 Dreamliner is 50% composite" },
      { name: "Titanium", criticality: "high", primarySource: "US, Russia (VSMPO-AVISMA), Japan", notes: "Engine components, landing gear; Russian supply disrupted" },
      { name: "Jet Engines (GE, Rolls-Royce)", criticality: "high", primarySource: "US (GE), UK (Rolls-Royce)", notes: "Critical supplier dependency" },
      { name: "Avionics & Electronics", criticality: "high", primarySource: "US (Honeywell, Collins), France (Thales)", notes: "Flight systems and cockpit electronics" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 55, criticality: "high", notes: "Assembly facilities, testing" },
      { source: "Natural Gas", percentOfTotal: 30, criticality: "high", notes: "Manufacturing heat treatment, composite curing" },
      { source: "Jet Fuel (Testing)", percentOfTotal: 10, criticality: "medium", notes: "Aircraft testing and delivery flights" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Growing renewable procurement" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Metal treatment, painting, cooling", annualVolumeEstimate: ">1B gallons", waterStressExposure: "Moderate - South Carolina and Washington state", notes: "Surface treatment processes require significant water" },
    geographicDependencies: [
      { region: "Washington State (Everett, Renton)", dependencyType: "Aircraft assembly", criticality: "high", notes: "737, 767, 777, 787 assembly lines" },
      { region: "South Carolina (North Charleston)", dependencyType: "787 assembly", criticality: "high", notes: "Second 787 final assembly line" },
      { region: "St. Louis, MO", dependencyType: "Defense operations", criticality: "high", notes: "F-15, F/A-18, military programs" },
      { region: "Japan (Mitsubishi, Kawasaki)", dependencyType: "Major structural supplier", criticality: "high", notes: "Wing and fuselage sections" }
    ],
    supplyChainNotes: "Complex Tier 1/2/3 supplier network. Russian titanium supply disruption post-2022. Quality control issues in supply chain.",
    climateRiskExposure: "High - SAF (sustainable aviation fuel) transition costs, carbon pricing on aviation, extreme weather supply disruption",
    sources: "Boeing 10-K, Sustainability Report"
  },

  // === MINING & MATERIALS ===
  {
    companyName: "Freeport-McMoRan", ticker: "FCX", naicsCode: "212234", naicsDescription: "Copper Ore and Nickel Ore Mining",
    sector: "Mining & Materials", subsector: "Copper Mining", hqState: "AZ", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "27,000",
    materialDependencies: [
      { name: "Sulfuric Acid", criticality: "high", primarySource: "US domestic (smelters)", notes: "Copper leaching process" },
      { name: "Diesel Fuel", criticality: "high", primarySource: "US domestic", notes: "Haul truck fleet and mine equipment" },
      { name: "Grinding Media (Steel Balls)", criticality: "medium", primarySource: "US, Chile", notes: "Ore processing mills" },
      { name: "Explosives (Ammonium Nitrate)", criticality: "high", primarySource: "US domestic", notes: "Open-pit blasting" },
      { name: "Tires (Mining-Grade)", criticality: "medium", primarySource: "Japan (Bridgestone), France (Michelin)", notes: "Massive haul truck tires; long lead times" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 40, criticality: "high", notes: "Concentrator and smelter operations" },
      { source: "Diesel", percentOfTotal: 35, criticality: "high", notes: "Mining fleet operations" },
      { source: "Natural Gas", percentOfTotal: 15, criticality: "medium", notes: "Smelter operations" },
      { source: "Renewable", percentOfTotal: 10, criticality: "medium", notes: "Solar installations at Arizona operations" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Ore processing, dust suppression, tailings", annualVolumeEstimate: ">50B gallons", waterStressExposure: "Very High - Arizona mines in arid desert; Indonesia tropical but infrastructure-limited", notes: "Water is primary operating constraint in Arizona; extensive recycling (85%+)" },
    geographicDependencies: [
      { region: "Arizona (Morenci, Bagdad, Safford)", dependencyType: "Copper mining", criticality: "high", notes: "Largest US copper mining complex" },
      { region: "Indonesia (Grasberg)", dependencyType: "Copper/gold mining", criticality: "high", notes: "One of world's largest copper/gold mines" },
      { region: "Chile (El Abra)", dependencyType: "Copper mining", criticality: "medium", notes: "South American operations" },
      { region: "New Mexico (Chino, Tyrone)", dependencyType: "Copper mining", criticality: "medium", notes: "Southwest US operations" }
    ],
    supplyChainNotes: "Critical mineral producer for energy transition (EV wiring, renewable energy). Water scarcity is biggest operational constraint.",
    climateRiskExposure: "High - water scarcity in Arizona, extreme heat affecting operations, tailings dam risk from intense rainfall",
    sources: "FCX 10-K, Sustainability Report, USGS"
  },

  // === TRANSPORTATION ===
  {
    companyName: "Union Pacific", ticker: "UNP", naicsCode: "482111", naicsDescription: "Line-Haul Railroads",
    sector: "Transportation", subsector: "Freight Rail", hqState: "NE", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "32,000",
    materialDependencies: [
      { name: "Diesel Fuel", criticality: "high", primarySource: "US Gulf Coast refineries", notes: "Largest operating expense; 1.1B+ gallons/year" },
      { name: "Steel Rail", criticality: "high", primarySource: "US (Nucor, EVRAZ), Japan", notes: "Track maintenance and expansion" },
      { name: "Railroad Ties (Concrete/Wood)", criticality: "medium", primarySource: "US domestic", notes: "Track infrastructure" },
      { name: "Locomotive Parts", criticality: "high", primarySource: "US (GE/Wabtec, Progress Rail)", notes: "Fleet maintenance" },
      { name: "Ballast (Crushed Rock)", criticality: "low", primarySource: "Regional quarries", notes: "Track bed maintenance" }
    ],
    energyDependencies: [
      { source: "Diesel", percentOfTotal: 90, criticality: "high", notes: "Locomotive fleet - essentially 100% diesel" },
      { source: "Grid Electricity", percentOfTotal: 8, criticality: "low", notes: "Yards, offices, signals" },
      { source: "Natural Gas", percentOfTotal: 2, criticality: "low", notes: "Facility heating" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Locomotive servicing, yard operations", annualVolumeEstimate: "~100M gallons", waterStressExposure: "Low - dispersed operations across diverse climates", notes: "Low direct water use; primarily for locomotive washing and cooling" },
    geographicDependencies: [
      { region: "Western US (23 states)", dependencyType: "Rail network", criticality: "high", notes: "32,000+ route miles across western 2/3 of US" },
      { region: "Gulf Coast ports", dependencyType: "Intermodal connections", criticality: "high", notes: "Import/export traffic" },
      { region: "Powder River Basin (WY)", dependencyType: "Coal transport", criticality: "medium", notes: "Declining but still significant coal haulage" },
      { region: "Mexico border crossings", dependencyType: "Cross-border trade", criticality: "high", notes: "Eagle Pass, Laredo, El Paso gateways" }
    ],
    supplyChainNotes: "Critical freight infrastructure for US economy. Moving ~500M tons/year. Diesel dependency is primary climate liability.",
    climateRiskExposure: "High - diesel cost/regulation exposure, wildfire risk to track in West, extreme heat causing rail buckling",
    sources: "UP 10-K, Sustainability Report"
  },
  {
    companyName: "Delta Air Lines", ticker: "DAL", naicsCode: "481111", naicsDescription: "Scheduled Passenger Air Transportation",
    sector: "Transportation", subsector: "Airlines", hqState: "GA", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "100,000",
    materialDependencies: [
      { name: "Jet Fuel (Jet-A)", criticality: "high", primarySource: "US Gulf Coast refineries, Monroe Energy (subsidiary)", notes: "~4B gallons/year; #1 operating cost" },
      { name: "Aircraft (Boeing, Airbus)", criticality: "high", primarySource: "US (Boeing), France (Airbus)", notes: "Fleet renewal and expansion" },
      { name: "Engine Parts (CFM, P&W)", criticality: "high", primarySource: "US, France, UK", notes: "Engine maintenance and overhaul" },
      { name: "De-icing Chemicals", criticality: "medium", primarySource: "US domestic", notes: "Seasonal dependency in northern hubs" },
      { name: "Catering Supplies", criticality: "low", primarySource: "US domestic", notes: "In-flight service" }
    ],
    energyDependencies: [
      { source: "Jet Fuel", percentOfTotal: 85, criticality: "high", notes: "Flight operations" },
      { source: "Grid Electricity", percentOfTotal: 10, criticality: "medium", notes: "Airport facilities, maintenance hangars" },
      { source: "Diesel/Ground Equipment", percentOfTotal: 3, criticality: "low", notes: "Ground support equipment" },
      { source: "SAF (Sustainable Aviation Fuel)", percentOfTotal: 2, criticality: "medium", notes: "Growing SAF procurement" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Aircraft cleaning, facility operations, catering", annualVolumeEstimate: "~200M gallons", waterStressExposure: "Low - operations at diverse airport locations", notes: "Low direct water intensity relative to revenue" },
    geographicDependencies: [
      { region: "Atlanta (Hartsfield-Jackson)", dependencyType: "Primary hub", criticality: "high", notes: "World's busiest airport; ~1,000 daily departures" },
      { region: "New York (JFK, LGA)", dependencyType: "Major hub", criticality: "high", notes: "Northeast operations" },
      { region: "Minneapolis, Detroit, Salt Lake City, Seattle", dependencyType: "Secondary hubs", criticality: "high", notes: "Domestic network hubs" },
      { region: "US Gulf Coast", dependencyType: "Fuel supply", criticality: "high", notes: "Monroe Energy refinery in Pennsylvania" }
    ],
    supplyChainNotes: "Owns Monroe Energy refinery for fuel security. SAF transition is existential challenge. Fleet renewal cycles are 20-30 years.",
    climateRiskExposure: "Very High - jet fuel is 85% of energy; SAF costs 2-4x conventional; extreme weather hub disruption; CORSIA carbon costs",
    sources: "Delta 10-K, ESG Report"
  },

  // === CONSTRUCTION & REAL ESTATE ===
  {
    companyName: "Caterpillar", ticker: "CAT", naicsCode: "333120", naicsDescription: "Construction Machinery Manufacturing",
    sector: "Manufacturing", subsector: "Heavy Equipment", hqState: "TX", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "115,000",
    materialDependencies: [
      { name: "Steel", criticality: "high", primarySource: "US, Japan, South Korea", notes: "Equipment frames, structural components" },
      { name: "Iron Castings", criticality: "high", primarySource: "US, China, India", notes: "Engine blocks, housings" },
      { name: "Hydraulic Components", criticality: "high", primarySource: "Japan, Germany, US", notes: "Cylinders, pumps, valves" },
      { name: "Diesel Engines (Internal)", criticality: "high", primarySource: "US (Lafayette IN, Pontiac IL)", notes: "In-house engine manufacturing" },
      { name: "Rubber (Tracks, Seals)", criticality: "medium", primarySource: "Thailand, Indonesia, US", notes: "Undercarriage components" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 45, criticality: "high", notes: "Manufacturing plants" },
      { source: "Natural Gas", percentOfTotal: 35, criticality: "high", notes: "Foundry operations, heat treatment" },
      { source: "Diesel (Testing)", percentOfTotal: 15, criticality: "medium", notes: "Product testing and validation" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Select facility installations" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Metal processing, painting, cooling", annualVolumeEstimate: ">500M gallons", waterStressExposure: "Moderate - diverse manufacturing locations", notes: "Foundry operations require significant cooling water" },
    geographicDependencies: [
      { region: "Illinois (Peoria, Aurora, Decatur)", dependencyType: "Manufacturing hub", criticality: "high", notes: "Historic manufacturing center" },
      { region: "Texas (Irving HQ)", dependencyType: "Corporate headquarters", criticality: "medium", notes: "Relocated HQ" },
      { region: "Indiana, Georgia", dependencyType: "Engine and component manufacturing", criticality: "high", notes: "Engine plants" },
      { region: "Japan (Shin Caterpillar)", dependencyType: "Hydraulic equipment", criticality: "medium", notes: "Excavator manufacturing" }
    ],
    supplyChainNotes: "Products used in mining and construction globally. Transition to electrified/hydrogen equipment is strategic imperative.",
    climateRiskExposure: "Medium - product electrification pressure, mining customer transition risk, steel/iron supply chain emissions",
    sources: "CAT 10-K, Sustainability Report"
  },

  // === SEMICONDUCTOR ===
  {
    companyName: "Intel", ticker: "INTC", naicsCode: "334413", naicsDescription: "Semiconductor and Related Device Manufacturing",
    sector: "Technology", subsector: "Semiconductors", hqState: "CA", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "124,800",
    materialDependencies: [
      { name: "Silicon Wafers", criticality: "high", primarySource: "Japan (Shin-Etsu, SUMCO), Germany", notes: "Ultra-pure 300mm wafers" },
      { name: "Photoresists & Chemicals", criticality: "high", primarySource: "Japan (JSR, TOK), US", notes: "EUV lithography materials" },
      { name: "EUV Lithography Equipment", criticality: "high", primarySource: "Netherlands (ASML)", notes: "Single-source dependency for leading-edge lithography" },
      { name: "Specialty Gases (Nitrogen, Argon, Helium)", criticality: "high", primarySource: "US (Air Products, Linde)", notes: "Cleanroom and process atmosphere" },
      { name: "Copper & Tungsten", criticality: "medium", primarySource: "Chile, Peru, China", notes: "Interconnect materials" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 70, criticality: "high", notes: "Fab operations are extremely energy-intensive" },
      { source: "Renewable PPAs", percentOfTotal: 20, criticality: "high", notes: "Goal: 100% renewable by 2030" },
      { source: "Natural Gas", percentOfTotal: 8, criticality: "medium", notes: "Facility heating, abatement" },
      { source: "Diesel Backup", percentOfTotal: 2, criticality: "medium", notes: "Fab UPS and backup" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Ultra-pure water for wafer processing, cooling", annualVolumeEstimate: ">10B gallons", waterStressExposure: "High - Arizona and Oregon fabs; Chandler AZ especially water-stressed", notes: "Semiconductor fabrication requires enormous volumes of ultra-pure water; Intel recycles 80%+" },
    geographicDependencies: [
      { region: "Oregon (Hillsboro)", dependencyType: "R&D and fabrication", criticality: "high", notes: "D1X fab - leading-edge R&D" },
      { region: "Arizona (Chandler)", dependencyType: "Fabrication", criticality: "high", notes: "Fab 52, Fab 62 expansion" },
      { region: "New Mexico (Rio Rancho)", dependencyType: "Fabrication", criticality: "high", notes: "Fab 11X" },
      { region: "Ohio (New Albany)", dependencyType: "New mega-fab complex", criticality: "high", notes: "CHIPS Act-supported expansion" },
      { region: "Ireland (Leixlip)", dependencyType: "European fabrication", criticality: "high", notes: "Fab 34" }
    ],
    supplyChainNotes: "ASML is sole EUV supplier globally. Japanese materials suppliers are critical. CHIPS Act driving $20B+ US investment.",
    climateRiskExposure: "High - extreme water dependence in arid regions, massive energy consumption, supply chain concentration in Asia",
    sources: "Intel 10-K, Corporate Responsibility Report"
  },

  // === ADDITIONAL MAJOR COMPANIES ===
  {
    companyName: "Procter & Gamble", ticker: "PG", naicsCode: "325611", naicsDescription: "Soap and Other Detergent Manufacturing",
    sector: "Consumer Goods", subsector: "Household Products", hqState: "OH", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "107,000",
    materialDependencies: [
      { name: "Palm Oil & Palm Kernel Oil", criticality: "high", primarySource: "Indonesia, Malaysia", notes: "Soaps, detergents, personal care" },
      { name: "Petrochemicals (Surfactants)", criticality: "high", primarySource: "US Gulf Coast, Europe", notes: "Cleaning product formulations" },
      { name: "Cellulose Pulp", criticality: "high", primarySource: "US Southeast, Brazil, Scandinavia", notes: "Diapers, tissue, feminine care" },
      { name: "Plastic Packaging (PE, PP, PET)", criticality: "high", primarySource: "US, China, Europe", notes: "Product bottles, containers" },
      { name: "Fragrances & Specialty Chemicals", criticality: "medium", primarySource: "Switzerland, US, France", notes: "Product formulations" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 40, criticality: "high", notes: "Manufacturing steam and heating" },
      { source: "Grid Electricity", percentOfTotal: 40, criticality: "high", notes: "Manufacturing operations" },
      { source: "Renewable", percentOfTotal: 15, criticality: "medium", notes: "Wind, solar PPAs" },
      { source: "Biomass", percentOfTotal: 5, criticality: "low", notes: "Some facilities use wood waste" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Product manufacturing, cleaning, cooling", annualVolumeEstimate: ">5B gallons", waterStressExposure: "Moderate - global manufacturing in diverse regions", notes: "Consumer products contain water; reducing water in product formulations (concentrated products)" },
    geographicDependencies: [
      { region: "Cincinnati, OH", dependencyType: "Global HQ and R&D", criticality: "high", notes: "Corporate headquarters" },
      { region: "Southeast US", dependencyType: "Manufacturing plants", criticality: "high", notes: "Multiple US production sites" },
      { region: "Indonesia/Malaysia", dependencyType: "Palm oil sourcing", criticality: "high", notes: "Deforestation risk" },
      { region: "China", dependencyType: "Manufacturing and market", criticality: "high", notes: "Growing market with local production" }
    ],
    supplyChainNotes: "Palm oil supply chain is key deforestation and climate risk. Plastic packaging circular economy targets. Concentrated products reduce water/transport.",
    climateRiskExposure: "Medium - palm oil deforestation regulation, plastic waste legislation, consumer water scarcity in markets",
    sources: "P&G 10-K, ESG Report, CDP"
  },
  {
    companyName: "UnitedHealth Group", ticker: "UNH", naicsCode: "524114", naicsDescription: "Direct Health and Medical Insurance Carriers",
    sector: "Healthcare", subsector: "Health Insurance", hqState: "MN", hqRegion: "US",
    revenueRange: ">$100B", employees: "400,000",
    materialDependencies: [
      { name: "IT Infrastructure (Data Centers)", criticality: "high", primarySource: "US, Asia", notes: "Optum analytics and claims processing" },
      { name: "Office Real Estate", criticality: "medium", primarySource: "US nationwide", notes: "Distributed office locations" },
      { name: "Pharmaceutical Supply Chain", criticality: "high", primarySource: "Global via Optum Rx", notes: "PBM and pharmacy network" },
      { name: "Medical Equipment", criticality: "medium", primarySource: "US, Europe", notes: "Optum Care facilities" },
      { name: "Paper/Digital Records", criticality: "low", primarySource: "US domestic", notes: "Declining with digital transformation" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 75, criticality: "high", notes: "Offices, data centers" },
      { source: "Natural Gas", percentOfTotal: 15, criticality: "medium", notes: "Facility heating" },
      { source: "Renewable", percentOfTotal: 8, criticality: "low", notes: "Growing renewable portfolio" },
      { source: "Fleet Fuel", percentOfTotal: 2, criticality: "low", notes: "Service vehicles" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Office HVAC, data center cooling", annualVolumeEstimate: "~200M gallons", waterStressExposure: "Low - primarily office operations", notes: "Low direct water footprint; indirect exposure through pharmaceutical supply chain" },
    geographicDependencies: [
      { region: "Minnesota (Minnetonka)", dependencyType: "Corporate HQ", criticality: "high", notes: "Headquarters and operations center" },
      { region: "US nationwide", dependencyType: "Healthcare delivery network", criticality: "high", notes: "Optum Care centers across 50 states" },
      { region: "India, Philippines", dependencyType: "Technology and claims processing", criticality: "medium", notes: "Offshore operations" }
    ],
    supplyChainNotes: "Services-based; primary physical dependencies are IT infrastructure. Climate risk through healthcare system strain from extreme weather events.",
    climateRiskExposure: "Medium - climate-related health claims (heat illness, respiratory), extreme weather healthcare demand spikes, facility disruption",
    sources: "UNH 10-K, ESG Report"
  },

  // === MORE DIVERSE SECTORS ===
  {
    companyName: "Deere & Company", ticker: "DE", naicsCode: "333111", naicsDescription: "Farm Machinery and Equipment Manufacturing",
    sector: "Manufacturing", subsector: "Agricultural Equipment", hqState: "IL", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "83,000",
    materialDependencies: [
      { name: "Steel", criticality: "high", primarySource: "US, Brazil, Japan", notes: "Tractor and equipment frames" },
      { name: "Iron Castings", criticality: "high", primarySource: "US, China", notes: "Engine and transmission components" },
      { name: "Rubber (Tires)", criticality: "medium", primarySource: "Thailand, Indonesia", notes: "Large agricultural tires" },
      { name: "Hydraulic Systems", criticality: "high", primarySource: "Germany, Japan, US", notes: "Equipment operation systems" },
      { name: "Semiconductors & Sensors", criticality: "high", primarySource: "Taiwan, US, Germany", notes: "Precision agriculture technology" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 45, criticality: "high", notes: "Manufacturing plants" },
      { source: "Natural Gas", percentOfTotal: 35, criticality: "high", notes: "Foundry and paint operations" },
      { source: "Diesel", percentOfTotal: 15, criticality: "medium", notes: "Product testing, logistics" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Select facility solar" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Metal processing, painting, testing", annualVolumeEstimate: ">300M gallons", waterStressExposure: "Low to Moderate - Midwest manufacturing locations", notes: "Products enable agricultural water management (precision irrigation)" },
    geographicDependencies: [
      { region: "Iowa, Illinois", dependencyType: "Manufacturing and HQ", criticality: "high", notes: "Moline HQ, Waterloo tractor plant" },
      { region: "Brazil (Horizontina)", dependencyType: "South American manufacturing", criticality: "high", notes: "Major market and production" },
      { region: "Germany (Mannheim)", dependencyType: "European manufacturing", criticality: "medium", notes: "European tractor production" },
      { region: "India", dependencyType: "Growing manufacturing", criticality: "medium", notes: "Compact tractor production" }
    ],
    supplyChainNotes: "Products are essential for food production. Precision agriculture technology reducing customer water/chemical use. Electrification of smaller equipment.",
    climateRiskExposure: "Medium - customer base (farmers) highly exposed to climate; equipment electrification pressure; steel supply chain emissions",
    sources: "Deere 10-K, Sustainability Report"
  },
  {
    companyName: "3M Company", ticker: "MMM", naicsCode: "339999", naicsDescription: "All Other Miscellaneous Manufacturing",
    sector: "Manufacturing", subsector: "Diversified Manufacturing", hqState: "MN", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "85,000",
    materialDependencies: [
      { name: "Fluoropolymers/PFAS", criticality: "high", primarySource: "US, China, Belgium", notes: "PFAS phase-out creating massive liability and product reformulation" },
      { name: "Adhesive Resins", criticality: "high", primarySource: "US, Germany, Japan", notes: "Core adhesive technology platform" },
      { name: "Nonwoven Fabrics", criticality: "high", primarySource: "US, China", notes: "Filtration, medical, and safety products" },
      { name: "Aluminum Oxide (Abrasives)", criticality: "medium", primarySource: "US, Brazil, China", notes: "Sandpaper and abrasive products" },
      { name: "Specialty Films (Polyester, Polycarbonate)", criticality: "medium", primarySource: "US, Japan, South Korea", notes: "Electronics and industrial films" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 40, criticality: "high", notes: "Process heating, coating operations" },
      { source: "Grid Electricity", percentOfTotal: 40, criticality: "high", notes: "Manufacturing operations" },
      { source: "Renewable", percentOfTotal: 15, criticality: "medium", notes: "Wind and solar PPAs" },
      { source: "Steam (Co-gen)", percentOfTotal: 5, criticality: "low", notes: "Combined heat and power" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Coating processes, cleaning, cooling", annualVolumeEstimate: ">1B gallons", waterStressExposure: "Moderate - diverse global manufacturing", notes: "PFAS contamination of water resources is major environmental liability" },
    geographicDependencies: [
      { region: "Minnesota (Maplewood)", dependencyType: "Global HQ and R&D", criticality: "high", notes: "Innovation center" },
      { region: "US Midwest & Southeast", dependencyType: "Manufacturing plants", criticality: "high", notes: "Multiple US production sites" },
      { region: "China, Japan", dependencyType: "Asia-Pacific manufacturing", criticality: "medium", notes: "Regional production" },
      { region: "Belgium, Germany", dependencyType: "European manufacturing", criticality: "medium", notes: "EU operations" }
    ],
    supplyChainNotes: "PFAS 'forever chemicals' phase-out is existential challenge. Product reformulation across thousands of SKUs. $10B+ environmental liabilities.",
    climateRiskExposure: "High - PFAS remediation costs, chemical regulation tightening, manufacturing energy intensity",
    sources: "3M 10-K, Sustainability Report"
  },
  {
    companyName: "Southern Company", ticker: "SO", naicsCode: "221112", naicsDescription: "Electric Power Distribution",
    sector: "Utilities", subsector: "Electric Utilities", hqState: "GA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "27,000",
    materialDependencies: [
      { name: "Natural Gas", criticality: "high", primarySource: "Gulf of Mexico, Appalachian Basin", notes: "Primary fuel for gas-fired generation" },
      { name: "Coal", criticality: "medium", primarySource: "Appalachia, Illinois Basin", notes: "Still significant but declining" },
      { name: "Nuclear Fuel (Uranium)", criticality: "high", primarySource: "Kazakhstan, Canada", notes: "Vogtle Units 1-4" },
      { name: "Solar Panels", criticality: "medium", primarySource: "China, Southeast Asia", notes: "Growing solar portfolio" },
      { name: "Transmission Equipment", criticality: "high", primarySource: "US, Mexico, Europe", notes: "Transformers, switchgear" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 45, criticality: "high", notes: "Growing as coal retires" },
      { source: "Nuclear", percentOfTotal: 20, criticality: "high", notes: "Plant Vogtle - largest US nuclear plant" },
      { source: "Coal", percentOfTotal: 15, criticality: "medium", notes: "Declining portfolio" },
      { source: "Renewable (Solar)", percentOfTotal: 15, criticality: "medium", notes: "Rapidly expanding" },
      { source: "Hydro", percentOfTotal: 5, criticality: "low", notes: "Small hydro portfolio" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Thermal and nuclear plant cooling", annualVolumeEstimate: ">5B gallons", waterStressExposure: "Moderate - Southeast US; drought can affect hydro and thermal operations", notes: "Vogtle nuclear plant is major water user; cooling tower systems" },
    geographicDependencies: [
      { region: "Georgia", dependencyType: "Regulated service territory", criticality: "high", notes: "Georgia Power, Plant Vogtle" },
      { region: "Alabama", dependencyType: "Regulated service territory", criticality: "high", notes: "Alabama Power" },
      { region: "Mississippi", dependencyType: "Regulated service territory", criticality: "medium", notes: "Mississippi Power" },
      { region: "Gulf Coast", dependencyType: "Natural gas supply", criticality: "high", notes: "Gas pipeline connections" }
    ],
    supplyChainNotes: "Vogtle nuclear expansion was most expensive US construction project. Coal ash remediation ongoing. Grid modernization needed.",
    climateRiskExposure: "High - hurricane exposure in Southeast, coal retirement costs, Vogtle cost overruns, water availability for cooling",
    sources: "Southern Company 10-K, Sustainability Report"
  },
  {
    companyName: "Nucor", ticker: "NUE", naicsCode: "331110", naicsDescription: "Iron and Steel Mills and Ferroalloy Manufacturing",
    sector: "Manufacturing", subsector: "Steel Production", hqState: "NC", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "32,000",
    materialDependencies: [
      { name: "Scrap Steel", criticality: "high", primarySource: "US domestic scrap yards", notes: "Primary feedstock - EAF steelmaking" },
      { name: "Direct Reduced Iron (DRI)", criticality: "high", primarySource: "Trinidad, US (Louisiana)", notes: "Supplement to scrap; Nucor DRI plant" },
      { name: "Natural Gas", criticality: "high", primarySource: "US domestic", notes: "EAF electrode power, DRI reduction" },
      { name: "Graphite Electrodes", criticality: "high", primarySource: "US, Japan, India", notes: "EAF steelmaking consumable" },
      { name: "Zinc", criticality: "medium", primarySource: "Canada, Peru, Australia", notes: "Galvanizing operations" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 55, criticality: "high", notes: "Electric arc furnaces are extremely electricity-intensive" },
      { source: "Natural Gas", percentOfTotal: 35, criticality: "high", notes: "DRI plant, reheat furnaces" },
      { source: "Renewable", percentOfTotal: 8, criticality: "medium", notes: "Nuclear and renewable PPAs" },
      { source: "Diesel", percentOfTotal: 2, criticality: "low", notes: "Material handling" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Cooling, scale removal, dust suppression", annualVolumeEstimate: ">3B gallons", waterStressExposure: "Moderate - diverse US plant locations", notes: "Closed-loop cooling systems at most mills; water recycling >90%" },
    geographicDependencies: [
      { region: "Southeast US (NC, SC, AL)", dependencyType: "Steel mills", criticality: "high", notes: "Multiple bar and sheet mills" },
      { region: "Indiana, Ohio", dependencyType: "Midwest mills", criticality: "high", notes: "Sheet and plate production" },
      { region: "Texas, Utah", dependencyType: "Western mills", criticality: "medium", notes: "Bar and rebar production" },
      { region: "Trinidad", dependencyType: "DRI supply", criticality: "medium", notes: "Nu-Iron DRI facility" }
    ],
    supplyChainNotes: "EAF steelmaking has ~75% lower CO2 than blast furnace. Positioned well for green steel demand. Scrap availability is key constraint.",
    climateRiskExposure: "Medium - lower carbon intensity than integrated steel; electricity price exposure; Scope 2 emissions from grid",
    sources: "Nucor 10-K, Sustainability Report"
  },

  // === ADDITIONAL COMPANIES FOR BREADTH ===
  {
    companyName: "ConocoPhillips", ticker: "COP", naicsCode: "211120", naicsDescription: "Crude Petroleum Extraction",
    sector: "Energy", subsector: "Exploration & Production", hqState: "TX", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "10,800",
    materialDependencies: [
      { name: "Drilling Rigs & Equipment", criticality: "high", primarySource: "US domestic", notes: "Contract drilling services" },
      { name: "Sand/Proppant", criticality: "high", primarySource: "Wisconsin, Texas", notes: "Hydraulic fracturing" },
      { name: "Steel Casing & Tubing", criticality: "high", primarySource: "US, Japan, South Korea", notes: "Well completion" },
      { name: "Drilling Fluids", criticality: "medium", primarySource: "US domestic", notes: "Wellbore stability" },
      { name: "Water (Frac Water)", criticality: "high", primarySource: "Local aquifers, recycled produced water", notes: "Massive volumes for hydraulic fracturing" }
    ],
    energyDependencies: [
      { source: "Natural Gas (Self-supplied)", percentOfTotal: 50, criticality: "high", notes: "Field operations power" },
      { source: "Diesel", percentOfTotal: 30, criticality: "high", notes: "Drilling and completions" },
      { source: "Grid Electricity", percentOfTotal: 15, criticality: "medium", notes: "Processing facilities" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Flare reduction, solar pilots" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Hydraulic fracturing, enhanced recovery, processing", annualVolumeEstimate: ">200M gallons", waterStressExposure: "High - Permian Basin and Alaska operations", notes: "Water recycling rate increasing; produced water management is major cost" },
    geographicDependencies: [
      { region: "Permian Basin (TX/NM)", dependencyType: "Production", criticality: "high", notes: "Key growth area" },
      { region: "Alaska (North Slope)", dependencyType: "Production", criticality: "high", notes: "Willow project; Arctic operations" },
      { region: "Eagle Ford (TX)", dependencyType: "Production", criticality: "medium", notes: "Shale production" },
      { region: "Norway, Canada, Australia", dependencyType: "International production", criticality: "medium", notes: "Diversified portfolio" }
    ],
    supplyChainNotes: "Pure-play E&P company. Sensitive to oil/gas prices and carbon pricing. Arctic operations have unique environmental constraints.",
    climateRiskExposure: "Very High - stranded asset risk, Scope 1&3 emissions, Arctic permafrost thaw, carbon pricing",
    sources: "COP 10-K, Climate Risk Strategy Report"
  },
  {
    companyName: "US Steel", ticker: "X", naicsCode: "331110", naicsDescription: "Iron and Steel Mills and Ferroalloy Manufacturing",
    sector: "Manufacturing", subsector: "Steel Production", hqState: "PA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "22,000",
    materialDependencies: [
      { name: "Iron Ore", criticality: "high", primarySource: "Minnesota (Minntac, Keetac)", notes: "Captive iron ore from Minnesota mines" },
      { name: "Metallurgical Coal", criticality: "high", primarySource: "US Appalachia, Australia", notes: "Blast furnace fuel and reductant" },
      { name: "Scrap Steel", criticality: "medium", primarySource: "US domestic", notes: "Big River Steel EAF operations" },
      { name: "Limestone/Flux", criticality: "medium", primarySource: "US domestic quarries", notes: "Blast furnace operations" },
      { name: "Natural Gas", criticality: "high", primarySource: "US domestic", notes: "DRI and processing" }
    ],
    energyDependencies: [
      { source: "Metallurgical Coal", percentOfTotal: 40, criticality: "high", notes: "Blast furnace operations (Mon Valley, Gary)" },
      { source: "Natural Gas", percentOfTotal: 25, criticality: "high", notes: "Processing and DRI" },
      { source: "Grid Electricity", percentOfTotal: 30, criticality: "high", notes: "EAF operations at Big River Steel" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "PPA procurement" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Blast furnace cooling, coke quenching, rolling operations", annualVolumeEstimate: ">5B gallons", waterStressExposure: "Moderate - Great Lakes and Appalachian water sources", notes: "Blast furnace operations are extremely water-intensive" },
    geographicDependencies: [
      { region: "Pennsylvania (Mon Valley)", dependencyType: "Integrated steel mills", criticality: "high", notes: "Clairton, Edgar Thomson, Irvin" },
      { region: "Indiana (Gary Works)", dependencyType: "Integrated steel mill", criticality: "high", notes: "Largest US integrated mill" },
      { region: "Minnesota (Iron Range)", dependencyType: "Iron ore mining", criticality: "high", notes: "Captive iron ore supply" },
      { region: "Arkansas (Big River Steel)", dependencyType: "EAF mini-mill", criticality: "high", notes: "Modern EAF facility" }
    ],
    supplyChainNotes: "Transitioning from integrated (blast furnace) to EAF steelmaking. Nippon Steel acquisition pending. Carbon intensity higher than EAF peers.",
    climateRiskExposure: "Very High - blast furnace CO2 emissions, carbon pricing, coal dependency, EU CBAM for exports",
    sources: "USS 10-K, Sustainability Report"
  },
  {
    companyName: "Mosaic Company", ticker: "MOS", naicsCode: "325311", naicsDescription: "Nitrogenous Fertilizer Manufacturing",
    sector: "Agriculture & Food", subsector: "Fertilizers", hqState: "FL", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "13,000",
    materialDependencies: [
      { name: "Phosphate Rock", criticality: "high", primarySource: "Florida, Peru", notes: "Own phosphate mines in FL; finite resource" },
      { name: "Potash (KCl)", criticality: "high", primarySource: "Saskatchewan, Canada (own mines)", notes: "Esterhazy mine complex" },
      { name: "Sulfur/Sulfuric Acid", criticality: "high", primarySource: "US Gulf Coast refineries", notes: "Phosphate processing" },
      { name: "Ammonia", criticality: "high", primarySource: "US Gulf Coast", notes: "Fertilizer production" },
      { name: "Natural Gas", criticality: "high", primarySource: "US domestic, Canada", notes: "Energy and ammonia feedstock" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 50, criticality: "high", notes: "Ammonia production, process heat" },
      { source: "Grid Electricity", percentOfTotal: 35, criticality: "high", notes: "Mining, milling, processing" },
      { source: "Diesel", percentOfTotal: 10, criticality: "medium", notes: "Mining fleet" },
      { source: "Waste Heat Recovery", percentOfTotal: 5, criticality: "low", notes: "Exothermic processes" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Phosphate mining and processing, tailings management", annualVolumeEstimate: ">50B gallons", waterStressExposure: "High - Florida phosphate operations, water table management", notes: "Phosphogypsum stacks require massive water management; Piney Point incident demonstrated risk" },
    geographicDependencies: [
      { region: "Central Florida (Polk County)", dependencyType: "Phosphate mining and processing", criticality: "high", notes: "Florida phosphate district" },
      { region: "Saskatchewan, Canada", dependencyType: "Potash mining", criticality: "high", notes: "Esterhazy, Belle Plaine, Colonsay" },
      { region: "Louisiana", dependencyType: "Processing facilities", criticality: "medium", notes: "Uncle Sam and Faustina" },
      { region: "Brazil, Peru", dependencyType: "International phosphate", criticality: "medium", notes: "South American operations" }
    ],
    supplyChainNotes: "Critical fertilizer supplier for global food security. Phosphate rock is finite (peak phosphorus concern). Gypsum stack management is major liability.",
    climateRiskExposure: "High - hurricane exposure in Florida, water management liability, N2O emissions from fertilizer use, peak phosphorus",
    sources: "Mosaic 10-K, ESG Report"
  },
  {
    companyName: "Waste Management", ticker: "WM", naicsCode: "562111", naicsDescription: "Solid Waste Collection",
    sector: "Environmental Services", subsector: "Waste Management", hqState: "TX", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "48,000",
    materialDependencies: [
      { name: "Diesel Fuel", criticality: "high", primarySource: "US domestic", notes: "Collection fleet - 26,000+ trucks" },
      { name: "CNG/RNG (Renewable Natural Gas)", criticality: "high", primarySource: "Own landfill gas operations", notes: "Largest RNG fleet in North America" },
      { name: "Heavy Equipment", criticality: "medium", primarySource: "US (CAT, John Deere)", notes: "Landfill compactors, loaders" },
      { name: "Liner Materials (HDPE)", criticality: "medium", primarySource: "US domestic", notes: "Landfill liner systems" },
      { name: "Leachate Treatment Chemicals", criticality: "medium", primarySource: "US domestic", notes: "Landfill leachate management" }
    ],
    energyDependencies: [
      { source: "Diesel", percentOfTotal: 40, criticality: "high", notes: "Collection fleet" },
      { source: "CNG/RNG", percentOfTotal: 30, criticality: "high", notes: "Growing RNG fleet conversion" },
      { source: "Landfill Gas (LFG)", percentOfTotal: 15, criticality: "medium", notes: "Electricity generation from captured methane" },
      { source: "Grid Electricity", percentOfTotal: 15, criticality: "medium", notes: "Facilities and recycling plants" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Leachate management, dust suppression, recycling", annualVolumeEstimate: ">1B gallons", waterStressExposure: "Moderate - landfills in diverse locations", notes: "Leachate management is primary water concern; closed-loop systems" },
    geographicDependencies: [
      { region: "Texas (Houston)", dependencyType: "Corporate HQ", criticality: "high", notes: "Headquarters" },
      { region: "US nationwide (48 states)", dependencyType: "Collection and disposal operations", criticality: "high", notes: "~260 active landfills" },
      { region: "Canada", dependencyType: "Canadian operations", criticality: "medium", notes: "Provincial operations" }
    ],
    supplyChainNotes: "Landfill gas-to-energy is growing revenue stream. RNG production creates circular economy. Recycling contamination rates a challenge.",
    climateRiskExposure: "Medium - methane emissions from landfills (30% of US CH4), fleet electrification costs, flooding risk to landfills",
    sources: "WM 10-K, Sustainability Report"
  },
  {
    companyName: "Sempra Energy", ticker: "SRE", naicsCode: "221210", naicsDescription: "Natural Gas Distribution",
    sector: "Utilities", subsector: "Gas & Electric Utility", hqState: "CA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "17,000",
    materialDependencies: [
      { name: "Natural Gas", criticality: "high", primarySource: "Permian Basin, Rocky Mountain, LNG imports", notes: "Core business is gas distribution" },
      { name: "Gas Pipeline (Steel)", criticality: "high", primarySource: "US domestic steel mills", notes: "Transmission and distribution network" },
      { name: "LNG Equipment", criticality: "high", primarySource: "US, France, Japan", notes: "Port Arthur LNG development" },
      { name: "Meters & Regulators", criticality: "medium", primarySource: "US domestic", notes: "Distribution infrastructure" },
      { name: "Solar Panels", criticality: "medium", primarySource: "China, Southeast Asia", notes: "Growing renewable portfolio" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 60, criticality: "high", notes: "Core commodity and operations fuel" },
      { source: "Grid Electricity", percentOfTotal: 20, criticality: "medium", notes: "Facilities and compression" },
      { source: "Renewable", percentOfTotal: 15, criticality: "medium", notes: "Solar and wind for SDG&E" },
      { source: "Diesel", percentOfTotal: 5, criticality: "low", notes: "Fleet and backup" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Facility operations, gas processing", annualVolumeEstimate: "~100M gallons", waterStressExposure: "High - San Diego and Baja California are water-stressed", notes: "Gas distribution has low direct water use; service area is water-stressed" },
    geographicDependencies: [
      { region: "California (San Diego)", dependencyType: "SDG&E regulated utility", criticality: "high", notes: "Gas and electric service" },
      { region: "Texas (Port Arthur)", dependencyType: "LNG export terminal", criticality: "high", notes: "Major LNG development" },
      { region: "Mexico (Baja California)", dependencyType: "Infrastructure", criticality: "high", notes: "Cross-border energy infrastructure" }
    ],
    supplyChainNotes: "LNG export strategy positions for global gas trade. California wildfire liability and gas phase-out policies are key risks.",
    climateRiskExposure: "High - California wildfire exposure, gas building electrification mandates, methane leak regulation, LNG stranded asset risk",
    sources: "Sempra 10-K, Sustainability Report"
  },
  {
    companyName: "Archer-Daniels-Midland", ticker: "ADM", naicsCode: "311221", naicsDescription: "Wet Corn Milling and Starch Manufacturing",
    sector: "Agriculture & Food", subsector: "Agricultural Processing", hqState: "IL", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "42,000",
    materialDependencies: [
      { name: "Corn", criticality: "high", primarySource: "US Midwest (Iowa, Illinois)", notes: "Corn processing, ethanol, sweeteners" },
      { name: "Soybeans", criticality: "high", primarySource: "US Midwest, Brazil", notes: "Oilseed processing, soybean oil and meal" },
      { name: "Wheat", criticality: "medium", primarySource: "US Great Plains, Canada", notes: "Flour milling" },
      { name: "Palm Oil/Canola", criticality: "medium", primarySource: "Indonesia, Canada", notes: "Vegetable oil processing" },
      { name: "Natural Gas", criticality: "high", primarySource: "US domestic", notes: "Ethanol production, grain drying" }
    ],
    energyDependencies: [
      { source: "Natural Gas", percentOfTotal: 40, criticality: "high", notes: "Processing, drying, ethanol" },
      { source: "Grid Electricity", percentOfTotal: 30, criticality: "high", notes: "Processing plants" },
      { source: "Coal/Biomass", percentOfTotal: 15, criticality: "medium", notes: "Some plants use coal; transitioning" },
      { source: "Diesel (Logistics)", percentOfTotal: 15, criticality: "high", notes: "Barge, rail, truck transport" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Grain processing, ethanol production, cooling", annualVolumeEstimate: ">10B gallons", waterStressExposure: "Moderate - Midwest generally water-rich; some Brazilian operations in stressed areas", notes: "Wet milling and ethanol are water-intensive processes" },
    geographicDependencies: [
      { region: "US Midwest (IL, IA, NE, MN)", dependencyType: "Processing and origination", criticality: "high", notes: "Core grain belt operations" },
      { region: "Brazil (Santos, Paranagua ports)", dependencyType: "South American origination", criticality: "high", notes: "Soybean sourcing and export" },
      { region: "Mississippi River system", dependencyType: "Barge transportation", criticality: "high", notes: "Critical logistics artery; 2022 low water event disrupted operations" },
      { region: "Gulf Coast ports (NO, Houston)", dependencyType: "Export terminals", criticality: "high", notes: "Grain and oilseed export" }
    ],
    supplyChainNotes: "Mississippi River low water in 2022 demonstrated climate logistics vulnerability. Major biofuels producer. Deforestation-linked soy sourcing risk in Brazil.",
    climateRiskExposure: "High - crop yield variability, river logistics disruption, deforestation regulation, ethanol policy uncertainty",
    sources: "ADM 10-K, Corporate Responsibility Report"
  },
  {
    companyName: "Linde", ticker: "LIN", naicsCode: "325120", naicsDescription: "Industrial Gas Manufacturing",
    sector: "Chemicals", subsector: "Industrial Gases", hqState: "CT", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "66,000",
    materialDependencies: [
      { name: "Air (Atmospheric Gases)", criticality: "high", primarySource: "Ambient air at plant sites", notes: "Primary feedstock - separation of O2, N2, Ar from air" },
      { name: "Natural Gas (Hydrogen)", criticality: "high", primarySource: "US Gulf Coast", notes: "Steam methane reforming for hydrogen production" },
      { name: "Electricity (Cryogenic Separation)", criticality: "high", primarySource: "Grid power", notes: "Air separation units are electricity-intensive" },
      { name: "Specialty Gas Components", criticality: "medium", primarySource: "US, Germany, Japan", notes: "High-purity electronic and medical gases" },
      { name: "Cryogenic Equipment", criticality: "medium", primarySource: "US, Germany", notes: "Storage tanks, piping, vaporizers" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 60, criticality: "high", notes: "Air separation is extremely energy-intensive" },
      { source: "Natural Gas", percentOfTotal: 30, criticality: "high", notes: "Hydrogen production via SMR" },
      { source: "Renewable", percentOfTotal: 8, criticality: "medium", notes: "Growing green hydrogen initiatives" },
      { source: "Diesel", percentOfTotal: 2, criticality: "low", notes: "Distribution fleet" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Cooling systems, hydrogen production", annualVolumeEstimate: ">2B gallons", waterStressExposure: "Moderate - diverse global plant locations", notes: "Cooling water for air separation; water feedstock for electrolysis" },
    geographicDependencies: [
      { region: "US Gulf Coast (TX, LA)", dependencyType: "Hydrogen pipeline network", criticality: "high", notes: "Largest hydrogen pipeline globally" },
      { region: "Germany", dependencyType: "Engineering and operations", criticality: "high", notes: "Linde Engineering HQ" },
      { region: "China, India", dependencyType: "Growing Asia-Pacific", criticality: "medium", notes: "Large-scale ASU plants" }
    ],
    supplyChainNotes: "Key enabler of energy transition through hydrogen and carbon capture. Electricity cost is primary cost driver. Green hydrogen is growth opportunity.",
    climateRiskExposure: "Medium - high energy consumption but enabling decarbonization; electricity price volatility; water for electrolysis",
    sources: "Linde 10-K, Sustainability Report"
  },
  {
    companyName: "Prologis", ticker: "PLD", naicsCode: "531120", naicsDescription: "Lessors of Nonresidential Buildings (except Miniwarehouses)",
    sector: "Real Estate", subsector: "Industrial REIT", hqState: "CA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "2,600",
    materialDependencies: [
      { name: "Concrete (Tilt-Wall)", criticality: "high", primarySource: "US domestic", notes: "Warehouse construction primary material" },
      { name: "Steel (Structural)", criticality: "high", primarySource: "US domestic", notes: "Building frames, racking" },
      { name: "Roofing Materials", criticality: "medium", primarySource: "US domestic", notes: "Large flat roofs for solar installation" },
      { name: "Solar Panels", criticality: "medium", primarySource: "China, Southeast Asia", notes: "Rooftop solar on warehouses" },
      { name: "LED Lighting", criticality: "low", primarySource: "China, US", notes: "Energy-efficient warehouse lighting" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 70, criticality: "high", notes: "Warehouse lighting, HVAC, loading" },
      { source: "Solar (Rooftop)", percentOfTotal: 20, criticality: "medium", notes: "1.2+ GW installed rooftop solar" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "low", notes: "Heating in cold-climate warehouses" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Landscaping, fire suppression systems", annualVolumeEstimate: "~50M gallons", waterStressExposure: "Low - warehouses have minimal water use", notes: "Industrial logistics buildings have very low water intensity" },
    geographicDependencies: [
      { region: "Inland Empire (CA)", dependencyType: "Major logistics hub", criticality: "high", notes: "Port of LA/Long Beach distribution" },
      { region: "New Jersey/Pennsylvania", dependencyType: "East Coast logistics", criticality: "high", notes: "Northeast distribution" },
      { region: "Dallas, Chicago, Atlanta", dependencyType: "Inland distribution hubs", criticality: "high", notes: "Key logistics markets" },
      { region: "Europe (UK, Germany, France)", dependencyType: "International portfolio", criticality: "medium", notes: "European logistics" }
    ],
    supplyChainNotes: "World's largest logistics real estate company. ~1.2 billion sq ft globally. Rooftop solar program is largest private solar installation.",
    climateRiskExposure: "Medium - physical risk to coastal/flood-zone properties, construction material costs, tenant EV charging demand",
    sources: "PLD 10-K, ESG Report"
  },

  // === DOW 30 - ADDITIONAL COMPONENTS ===
  {
    companyName: "American Express", ticker: "AXP", naicsCode: "522210", naicsDescription: "Credit Card Issuing",
    sector: "Financial Services", subsector: "Credit Services", hqState: "NY", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "77,300",
    materialDependencies: [
      { name: "Payment Card Plastics (PVC, PET)", criticality: "medium", primarySource: "US, Germany, Japan", notes: "Physical card production; shifting toward recycled and bio-based plastics" },
      { name: "EMV Chip Modules", criticality: "high", primarySource: "Netherlands (NXP), Germany (Infineon), France (Thales)", notes: "Secure chip technology for card authentication" },
      { name: "Data Center Servers", criticality: "high", primarySource: "Taiwan, US, China", notes: "Transaction processing infrastructure" },
      { name: "Networking Equipment", criticality: "high", primarySource: "US (Cisco, Arista), China", notes: "Payment network backbone" },
      { name: "Paper & Printing Materials", criticality: "low", primarySource: "US, Canada", notes: "Statements, marketing, office operations" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 75, criticality: "high", notes: "Data centers and office buildings" },
      { source: "Renewable PPAs (Wind/Solar)", percentOfTotal: 15, criticality: "medium", notes: "Committed to 100% renewable electricity" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "low", notes: "Office building heating" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Data center cooling, office facilities", annualVolumeEstimate: "~20M gallons", waterStressExposure: "Low - primarily office-based operations", notes: "Minimal water intensity as a financial services company" },
    geographicDependencies: [
      { region: "New York City", dependencyType: "Global headquarters", criticality: "high", notes: "Executive operations and financial hub" },
      { region: "Phoenix, AZ", dependencyType: "Operations center", criticality: "high", notes: "Major servicing and technology center" },
      { region: "UK & Europe", dependencyType: "International operations", criticality: "medium", notes: "Second-largest market; regulatory exposure to EU sustainability mandates" },
      { region: "Asia-Pacific", dependencyType: "Growth market", criticality: "medium", notes: "Japan, Australia, India expansion" }
    ],
    supplyChainNotes: "Closed-loop payment network with direct merchant relationships. Less exposed to interchange regulation than Visa/Mastercard but concentrated in premium/corporate card segment.",
    climateRiskExposure: "Low-Medium - primarily operational risk from extreme weather to data centers; credit portfolio exposure to climate-affected sectors",
    sources: "AXP 10-K, ESG Report"
  },
  {
    companyName: "Amgen", ticker: "AMGN", naicsCode: "325414", naicsDescription: "Biological Product Manufacturing",
    sector: "Healthcare", subsector: "Biotechnology", hqState: "CA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "27,000",
    materialDependencies: [
      { name: "Biologic Raw Materials (Cell Culture Media)", criticality: "high", primarySource: "US, Ireland, Germany", notes: "Mammalian cell culture media for monoclonal antibody production" },
      { name: "Single-Use Bioprocessing Systems", criticality: "high", primarySource: "US (Cytiva), Sweden, Germany", notes: "Disposable bioreactor bags and filtration assemblies" },
      { name: "Glass Vials & Prefilled Syringes", criticality: "high", primarySource: "Germany (Schott), US (Corning), Japan", notes: "Drug product containment; supply chain bottlenecks post-COVID" },
      { name: "Active Pharmaceutical Ingredients", criticality: "high", primarySource: "US, Ireland, Puerto Rico", notes: "In-house and contract manufacturing of APIs" },
      { name: "Cold Chain Packaging", criticality: "medium", primarySource: "US, Europe", notes: "Temperature-controlled shipping for biologics (2-8°C)" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 55, criticality: "high", notes: "Manufacturing facilities and R&D labs" },
      { source: "Natural Gas", percentOfTotal: 25, criticality: "high", notes: "Steam generation for bioreactors and sterilization" },
      { source: "On-site Solar", percentOfTotal: 10, criticality: "medium", notes: "Solar installations at Thousand Oaks campus" },
      { source: "Renewable PPAs", percentOfTotal: 10, criticality: "medium", notes: "Wind and solar power purchase agreements" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Purified water for biomanufacturing, cleaning-in-place, cooling", annualVolumeEstimate: "~500M gallons", waterStressExposure: "High - Thousand Oaks, CA facility in water-stressed region", notes: "Biologics manufacturing requires ultrapure water (WFI); water recycling programs in place" },
    geographicDependencies: [
      { region: "Thousand Oaks, CA", dependencyType: "Headquarters and R&D", criticality: "high", notes: "Primary research campus; wildfire and drought risk" },
      { region: "Puerto Rico", dependencyType: "Manufacturing", criticality: "high", notes: "Juncos facility; hurricane exposure" },
      { region: "Ireland (Dun Laoghaire)", dependencyType: "International manufacturing", criticality: "high", notes: "European biologics production" },
      { region: "Cambridge, MA", dependencyType: "R&D hub", criticality: "medium", notes: "Biotech research cluster" }
    ],
    supplyChainNotes: "Vertically integrated biologics manufacturing. Critical dependency on single-use bioprocessing supplies and cold chain logistics. Horizon Therapeutics acquisition expanded rare disease portfolio.",
    climateRiskExposure: "Medium - California wildfire/drought risk to HQ, hurricane risk to Puerto Rico manufacturing, cold chain disruption from extreme heat",
    sources: "AMGN 10-K, ESG Report, CDP disclosure"
  },
  {
    companyName: "Cisco Systems", ticker: "CSCO", naicsCode: "334210", naicsDescription: "Telephone Apparatus Manufacturing",
    sector: "Technology", subsector: "Networking Equipment", hqState: "CA", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "85,000",
    materialDependencies: [
      { name: "Semiconductors (ASICs, Merchant Silicon)", criticality: "high", primarySource: "Taiwan (TSMC), US (Broadcom, Intel), South Korea", notes: "Custom networking chips and processors" },
      { name: "Printed Circuit Boards", criticality: "high", primarySource: "China, Taiwan, Thailand", notes: "Multi-layer PCBs for routers and switches" },
      { name: "Optical Transceivers", criticality: "high", primarySource: "China, Japan, US", notes: "High-speed optical networking components; supply constraints" },
      { name: "Sheet Metal & Enclosures", criticality: "medium", primarySource: "China, Mexico, US", notes: "Equipment chassis and rack-mount housings" },
      { name: "Connectors & Cable Assemblies", criticality: "medium", primarySource: "China, Japan, US (TE Connectivity, Amphenol)", notes: "Fiber and copper connectivity" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 50, criticality: "high", notes: "Offices, labs, and data center operations" },
      { source: "Renewable PPAs (Solar/Wind)", percentOfTotal: 40, criticality: "high", notes: "85%+ renewable energy globally" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Campus heating" },
      { source: "On-site Solar", percentOfTotal: 5, criticality: "low", notes: "Solar installations at San Jose campus" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Campus cooling, landscaping", annualVolumeEstimate: "~30M gallons", waterStressExposure: "Moderate - San Jose HQ in California water-stressed region", notes: "Low direct water use; supply chain semiconductor fabs are water-intensive" },
    geographicDependencies: [
      { region: "San Jose, CA", dependencyType: "Headquarters and R&D", criticality: "high", notes: "Engineering and executive operations" },
      { region: "China (Shanghai, Shenzhen)", dependencyType: "Contract manufacturing", criticality: "high", notes: "Flex, Foxconn assembly; geopolitical risk" },
      { region: "Mexico (Guadalajara)", dependencyType: "Manufacturing", criticality: "medium", notes: "Nearshoring assembly operations" },
      { region: "India (Bangalore)", dependencyType: "R&D and services", criticality: "medium", notes: "Software development and support center" }
    ],
    supplyChainNotes: "Fabless model reliant on contract manufacturers. Splunk acquisition adds software/observability. Semiconductor shortage in 2021-2023 caused significant backlog; diversifying suppliers.",
    climateRiskExposure: "Medium - supply chain disruption from Taiwan semiconductor risk, California wildfire/drought exposure, Scope 3 emissions from product energy use",
    sources: "CSCO 10-K, CSR Report, CDP disclosure"
  },
  {
    companyName: "Coca-Cola", ticker: "KO", naicsCode: "312111", naicsDescription: "Soft Drink Manufacturing",
    sector: "Consumer Staples", subsector: "Beverages", hqState: "GA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "79,000",
    materialDependencies: [
      { name: "Sugar & High Fructose Corn Syrup", criticality: "high", primarySource: "Brazil, US, India, Thailand", notes: "Primary sweetener; exposed to crop yield variability from climate change" },
      { name: "Water", criticality: "high", primarySource: "Local municipal and groundwater sources globally", notes: "Core ingredient; 1.9L water per 1L of product" },
      { name: "Aluminum (Cans)", criticality: "high", primarySource: "Canada, Russia, UAE, China", notes: "Largest buyer of aluminum cans globally; recycling rate ~70%" },
      { name: "PET Resin (Plastic Bottles)", criticality: "high", primarySource: "US, China, India", notes: "Transitioning to rPET (recycled PET); World Without Waste goals" },
      { name: "CO2 (Carbonation)", criticality: "medium", primarySource: "Industrial byproduct, US, Europe", notes: "Food-grade CO2; supply disruptions during 2022 shortage" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 50, criticality: "high", notes: "Bottling plants, refrigeration, offices" },
      { source: "Natural Gas", percentOfTotal: 25, criticality: "high", notes: "Heating, steam generation for production" },
      { source: "Diesel/Fleet Fuel", percentOfTotal: 15, criticality: "medium", notes: "Distribution fleet; transitioning to EV" },
      { source: "Renewable", percentOfTotal: 10, criticality: "medium", notes: "Solar and wind at select facilities" }
    ],
    waterDependency: { usageLevel: "very high", primaryUse: "Product ingredient, cleaning, cooling", annualVolumeEstimate: ">80B gallons globally", waterStressExposure: "Very High - operations in India, Mexico, Africa face severe water stress", notes: "Water is the primary ingredient; 2030 water security strategy targets 100% regenerative water use in priority watersheds" },
    geographicDependencies: [
      { region: "Atlanta, GA", dependencyType: "Global headquarters", criticality: "high", notes: "Concentrate production and corporate operations" },
      { region: "Latin America (Mexico, Brazil)", dependencyType: "Major bottling markets", criticality: "high", notes: "Largest revenue regions outside US; water stress concerns" },
      { region: "India & Southeast Asia", dependencyType: "Growth markets", criticality: "high", notes: "Water scarcity and regulatory pressure on water extraction" },
      { region: "Europe", dependencyType: "Established market", criticality: "medium", notes: "Strict packaging and sugar regulations" }
    ],
    supplyChainNotes: "Franchise bottling model with ~200+ bottling partners globally. Extreme water dependency makes climate change an existential risk. Sugar price volatility from weather events.",
    climateRiskExposure: "Very High - water scarcity threatens production in key markets, agricultural input price volatility, packaging regulation, extreme heat affecting distribution",
    sources: "KO 10-K, World Without Waste Report, CDP Water disclosure"
  },
  {
    companyName: "Goldman Sachs", ticker: "GS", naicsCode: "523110", naicsDescription: "Investment Banking and Securities Dealing",
    sector: "Financial Services", subsector: "Investment Banking", hqState: "NY", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "46,500",
    materialDependencies: [
      { name: "Data Center Infrastructure", criticality: "high", primarySource: "US (Dell, HPE), Taiwan, China", notes: "Trading platform and risk management systems" },
      { name: "High-Performance Computing (GPUs)", criticality: "high", primarySource: "Taiwan (TSMC), US (NVIDIA)", notes: "Algorithmic trading and quantitative analysis" },
      { name: "Network & Telecom Equipment", criticality: "high", primarySource: "US, Sweden (Ericsson), Finland", notes: "Ultra-low-latency trading connectivity" },
      { name: "Commercial Real Estate (Office)", criticality: "medium", primarySource: "New York, London, Hong Kong", notes: "200 West Street HQ and global offices" },
      { name: "Cloud Computing Services", criticality: "medium", primarySource: "US (AWS, Azure, GCP)", notes: "Hybrid cloud for analytics and non-latency-sensitive workloads" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 70, criticality: "high", notes: "Trading floors, data centers, offices" },
      { source: "Renewable Energy Credits", percentOfTotal: 20, criticality: "medium", notes: "100% renewable electricity target achieved" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "low", notes: "Building heating in NYC and other cold-climate offices" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Office HVAC cooling, data center cooling", annualVolumeEstimate: "~15M gallons", waterStressExposure: "Low - primarily office-based in water-abundant regions", notes: "Minimal direct water use; indirect exposure through financed portfolio" },
    geographicDependencies: [
      { region: "New York City", dependencyType: "Global headquarters", criticality: "high", notes: "200 West Street; trading operations and executive functions" },
      { region: "London", dependencyType: "European operations", criticality: "high", notes: "Plumtree Court; second-largest office" },
      { region: "Dallas, Salt Lake City", dependencyType: "US operations centers", criticality: "medium", notes: "Back-office and technology operations" },
      { region: "Hong Kong, Singapore", dependencyType: "Asia-Pacific hub", criticality: "medium", notes: "APAC trading and investment banking" }
    ],
    supplyChainNotes: "Primary risk is through financed emissions and investment portfolio. $750B sustainable finance target by 2030. Commodities trading exposes to physical supply chain disruptions.",
    climateRiskExposure: "Medium-High - financed emissions exposure, coastal real estate portfolio risk, regulatory pressure on ESG disclosures, commodities trading volatility",
    sources: "GS 10-K, Sustainability Report, TCFD disclosure"
  },
  {
    companyName: "Home Depot", ticker: "HD", naicsCode: "444110", naicsDescription: "Home Centers",
    sector: "Consumer Discretionary", subsector: "Home Improvement Retail", hqState: "GA", hqRegion: "US",
    revenueRange: ">$100B", employees: "465,000",
    materialDependencies: [
      { name: "Lumber & Engineered Wood", criticality: "high", primarySource: "Canada (BC, Alberta), US (Southeast), Brazil", notes: "Largest US lumber retailer; prices volatile from wildfire, tariffs, housing demand" },
      { name: "Concrete & Building Materials", criticality: "high", primarySource: "US domestic (CEMEX, CRH)", notes: "Bagged concrete, masonry, cement products" },
      { name: "Steel & Metal Products", criticality: "medium", primarySource: "US, China, Mexico", notes: "Tools, hardware, fasteners, appliances" },
      { name: "PVC & Plastic Piping", criticality: "medium", primarySource: "US, China", notes: "Plumbing supplies derived from petrochemicals" },
      { name: "Paint & Coatings Chemicals", criticality: "medium", primarySource: "US (Behr/PPG), China, India", notes: "TiO2, resins, solvents; chemical supply chain complexity" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 75, criticality: "high", notes: "2,300+ stores, lighting, HVAC, forklifts" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "medium", notes: "Store heating in cold climates" },
      { source: "Diesel/Fleet Fuel", percentOfTotal: 10, criticality: "medium", notes: "Distribution fleet; transitioning to alternative fuels" },
      { source: "Renewable (Solar/LED)", percentOfTotal: 5, criticality: "low", notes: "Rooftop solar on select stores and DCs" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Garden center irrigation, restrooms, store operations", annualVolumeEstimate: "~60M gallons", waterStressExposure: "Low - retail stores have minimal water use", notes: "Products sold (e.g., irrigation systems) have much higher embedded water than store operations" },
    geographicDependencies: [
      { region: "Atlanta, GA", dependencyType: "Headquarters", criticality: "high", notes: "Store Support Center" },
      { region: "US Nationwide (2,300+ stores)", dependencyType: "Retail footprint", criticality: "high", notes: "Concentrated in Sun Belt and hurricane-prone states" },
      { region: "Canada & Mexico", dependencyType: "International stores", criticality: "medium", notes: "~300 stores in Canada and Mexico" },
      { region: "China & Southeast Asia", dependencyType: "Product sourcing", criticality: "high", notes: "~30% of products sourced internationally" }
    ],
    supplyChainNotes: "Largest home improvement retailer globally. Lumber supply from Canadian forests affected by mountain pine beetle and wildfire. Post-disaster demand spikes (hurricane rebuilding) strain supply chain.",
    climateRiskExposure: "High - extreme weather drives demand volatility, lumber/building material supply disruption from wildfires, stores in hurricane and flood zones",
    sources: "HD 10-K, ESG Report"
  },
  {
    companyName: "Honeywell", ticker: "HON", naicsCode: "334512", naicsDescription: "Automatic Environmental Control Manufacturing",
    sector: "Industrials", subsector: "Diversified Industrials/Aerospace", hqState: "NC", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "97,000",
    materialDependencies: [
      { name: "Specialty Chemicals (Fluorocarbons, Catalysts)", criticality: "high", primarySource: "US, China, Germany", notes: "Performance Materials segment; HFC and HFO refrigerants" },
      { name: "Semiconductors & Electronic Components", criticality: "high", primarySource: "Taiwan, US, South Korea, Japan", notes: "Sensors, controls, avionics systems" },
      { name: "Titanium & Nickel Alloys", criticality: "high", primarySource: "Russia, Japan, US", notes: "Aerospace engine components and industrial turbines" },
      { name: "Rare Earth Magnets", criticality: "medium", primarySource: "China (95% of processing)", notes: "Motors, sensors, guidance systems" },
      { name: "Fiber Optic & Advanced Composites", criticality: "medium", primarySource: "US, Japan, Germany", notes: "Carbon fiber and advanced materials for aerospace" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 55, criticality: "high", notes: "Manufacturing plants and R&D facilities" },
      { source: "Natural Gas", percentOfTotal: 25, criticality: "high", notes: "Chemical production and process heat" },
      { source: "Renewable PPAs", percentOfTotal: 15, criticality: "medium", notes: "Targeting carbon neutrality in operations" },
      { source: "On-site Cogeneration", percentOfTotal: 5, criticality: "low", notes: "Combined heat and power at select plants" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Chemical manufacturing cooling, process water", annualVolumeEstimate: "~200M gallons", waterStressExposure: "Moderate - some manufacturing in water-stressed regions (Arizona, India)", notes: "Chemical and materials processing requires significant cooling water" },
    geographicDependencies: [
      { region: "Charlotte, NC", dependencyType: "Global headquarters", criticality: "high", notes: "Corporate headquarters relocated from NJ in 2024" },
      { region: "Phoenix, AZ", dependencyType: "Aerospace manufacturing", criticality: "high", notes: "Major aerospace facility; extreme heat risk" },
      { region: "Shanghai, China", dependencyType: "Asia-Pacific operations", criticality: "high", notes: "Manufacturing and R&D; geopolitical risk" },
      { region: "India (Bangalore, Hyderabad)", dependencyType: "Engineering & manufacturing", criticality: "medium", notes: "Growing technology and manufacturing hub" }
    ],
    supplyChainNotes: "Diversified across four segments: Aerospace, Building Technologies, Performance Materials, Safety & Productivity. Transition to lower-GWP refrigerants is both a risk and opportunity. Quantum computing investments.",
    climateRiskExposure: "Medium-High - chemical segment exposed to HFC phasedown regulations, aerospace supply chain disruption, building efficiency products benefit from energy transition",
    sources: "HON 10-K, ESG Report"
  },
  {
    companyName: "IBM", ticker: "IBM", naicsCode: "541512", naicsDescription: "Computer Systems Design Services",
    sector: "Technology", subsector: "IT Services & Consulting", hqState: "NY", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "288,000",
    materialDependencies: [
      { name: "Semiconductors (Mainframe & AI Chips)", criticality: "high", primarySource: "US (GlobalFoundries, Samsung Austin), Taiwan", notes: "Custom Power and Z-series processors; quantum computing chips" },
      { name: "Data Center Servers & Storage", criticality: "high", primarySource: "US, Mexico, China", notes: "Hybrid cloud infrastructure hardware" },
      { name: "Rare Earth Elements", criticality: "medium", primarySource: "China, Australia", notes: "Hard disk drives, electronic components" },
      { name: "Fiber Optic Networks", criticality: "medium", primarySource: "US, Japan (Corning, Fujikura)", notes: "High-speed data connectivity" },
      { name: "Cooling Systems (Liquid Cooling)", criticality: "medium", primarySource: "US, Germany", notes: "Mainframe and quantum computing thermal management" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 55, criticality: "high", notes: "Data centers and global offices" },
      { source: "Renewable PPAs (Wind/Solar)", percentOfTotal: 30, criticality: "high", notes: "75%+ renewable electricity; targeting 90% by 2030" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "medium", notes: "Office and facility heating" },
      { source: "On-site Solar/Fuel Cells", percentOfTotal: 5, criticality: "low", notes: "Select facility installations" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Data center cooling, semiconductor testing", annualVolumeEstimate: "~100M gallons", waterStressExposure: "Moderate - some data centers in water-stressed regions", notes: "Transitioning to air cooling and water-free cooling technologies where possible" },
    geographicDependencies: [
      { region: "Armonk, NY", dependencyType: "Global headquarters", criticality: "high", notes: "Corporate operations" },
      { region: "Poughkeepsie, NY", dependencyType: "Mainframe manufacturing", criticality: "high", notes: "Z-series and Power systems production" },
      { region: "India (Bangalore, Hyderabad)", dependencyType: "Consulting & services delivery", criticality: "high", notes: "Largest employee base; IT services delivery" },
      { region: "Ireland, Germany", dependencyType: "European operations", criticality: "medium", notes: "Cloud and consulting operations" }
    ],
    supplyChainNotes: "Pivoted to hybrid cloud (Red Hat) and AI (watsonx). Spun off infrastructure services as Kyndryl. Quantum computing development in-house. Consulting arm relies on global talent supply.",
    climateRiskExposure: "Medium - data center energy demand, transition opportunity from sustainability consulting services, semiconductor supply chain concentration",
    sources: "IBM 10-K, ESG Report"
  },
  {
    companyName: "McDonald's", ticker: "MCD", naicsCode: "722513", naicsDescription: "Limited-Service Restaurants",
    sector: "Consumer Discretionary", subsector: "Fast Food/Restaurant", hqState: "IL", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "150,000",
    materialDependencies: [
      { name: "Beef", criticality: "high", primarySource: "US, Brazil, Australia, New Zealand", notes: "Largest beef purchaser globally; ~2M tonnes/year; significant Scope 3 emissions from cattle" },
      { name: "Chicken", criticality: "high", primarySource: "US (Tyson, Keystone), Brazil, Thailand", notes: "McNuggets and chicken sandwiches; avian flu supply risk" },
      { name: "Potatoes", criticality: "high", primarySource: "US (Idaho, Washington), Canada, Netherlands", notes: "French fries; Lamb Weston, McCain primary suppliers" },
      { name: "Cooking Oil (Soybean, Canola, Palm)", criticality: "medium", primarySource: "US, Brazil, Malaysia, Indonesia", notes: "Frying oil; palm oil deforestation scrutiny" },
      { name: "Paper & Packaging", criticality: "medium", primarySource: "US, Scandinavia, China", notes: "Transitioning to 100% renewable/recycled packaging by 2025" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 55, criticality: "high", notes: "40,000+ restaurants globally" },
      { source: "Natural Gas", percentOfTotal: 30, criticality: "high", notes: "Cooking equipment, water heating, HVAC" },
      { source: "Diesel/Fleet Fuel", percentOfTotal: 10, criticality: "medium", notes: "Logistics and distribution" },
      { source: "Renewable", percentOfTotal: 5, criticality: "low", notes: "Rooftop solar on select locations" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Food preparation, cleaning, ice production", annualVolumeEstimate: ">10B gallons (including supply chain)", waterStressExposure: "High - beef supply chain is extremely water-intensive (~1,800 gal/lb beef)", notes: "Direct restaurant use moderate; embedded water in beef and agricultural supply chain is enormous" },
    geographicDependencies: [
      { region: "Chicago, IL", dependencyType: "Global headquarters", criticality: "high", notes: "Corporate operations" },
      { region: "US (14,000+ locations)", dependencyType: "Domestic operations", criticality: "high", notes: "Largest market; franchise model" },
      { region: "Europe (UK, France, Germany)", dependencyType: "International markets", criticality: "high", notes: "Highest-margin international markets" },
      { region: "Brazil, Australia", dependencyType: "Beef sourcing", criticality: "high", notes: "Key beef supply regions; deforestation risk in Brazil" }
    ],
    supplyChainNotes: "Franchise model (95% franchised) limits direct control but creates indirect Scope 3 emissions challenge. Beef supply chain is single largest climate impact. Committed to Science-Based Targets.",
    climateRiskExposure: "High - beef supply chain emissions (~50% of footprint), agricultural commodity price volatility from drought/flood, water stress in farming regions",
    sources: "MCD 10-K, Purpose & Impact Report"
  },
  {
    companyName: "Merck & Co.", ticker: "MRK", naicsCode: "325412", naicsDescription: "Pharmaceutical Preparation Manufacturing",
    sector: "Healthcare", subsector: "Pharmaceuticals", hqState: "NJ", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "69,000",
    materialDependencies: [
      { name: "Active Pharmaceutical Ingredients (APIs)", criticality: "high", primarySource: "Ireland, US, India, China", notes: "Complex small molecule and biologic APIs; Keytruda production" },
      { name: "Glass Vials & Containers", criticality: "high", primarySource: "Germany (Schott), US, Japan", notes: "Drug product containment; borosilicate glass supply constraints" },
      { name: "Lipid Nanoparticles & Excipients", criticality: "high", primarySource: "US, Germany, Japan", notes: "Drug delivery systems and formulation ingredients" },
      { name: "Sterile Filtration Membranes", criticality: "medium", primarySource: "US (MilliporeSigma), Germany", notes: "Critical for injectable drug manufacturing" },
      { name: "Cold Chain Logistics Materials", criticality: "medium", primarySource: "US, Europe", notes: "Temperature-controlled packaging for biologics" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 50, criticality: "high", notes: "Manufacturing facilities and R&D labs" },
      { source: "Natural Gas", percentOfTotal: 25, criticality: "high", notes: "Process steam, heating, sterilization" },
      { source: "Renewable PPAs", percentOfTotal: 15, criticality: "medium", notes: "Wind and solar agreements; 55% renewable electricity" },
      { source: "On-site CHP/Solar", percentOfTotal: 10, criticality: "low", notes: "Combined heat and power at manufacturing sites" }
    ],
    waterDependency: { usageLevel: "high", primaryUse: "Pharmaceutical manufacturing process water, cleaning, cooling", annualVolumeEstimate: "~400M gallons", waterStressExposure: "Moderate - facilities in NJ, PA generally water-abundant; some international sites in stressed regions", notes: "Pharmaceutical manufacturing requires USP-grade purified water; water recycling programs at major sites" },
    geographicDependencies: [
      { region: "Rahway, NJ", dependencyType: "Global headquarters", criticality: "high", notes: "Corporate and R&D operations" },
      { region: "Ireland (Carlow, Ballydine)", dependencyType: "Manufacturing", criticality: "high", notes: "Major API and drug product manufacturing; tax advantages" },
      { region: "West Point, PA", dependencyType: "Vaccine manufacturing", criticality: "high", notes: "Largest vaccine production facility" },
      { region: "China, India", dependencyType: "API sourcing and market", criticality: "medium", notes: "Growing market access and supply chain" }
    ],
    supplyChainNotes: "Keytruda (pembrolizumab) represents ~40% of revenue - concentration risk. Biologics manufacturing requires specialized facilities with 3-5 year build times. Animal health division (Organon spun off).",
    climateRiskExposure: "Medium - manufacturing facility flood/storm risk, cold chain disruption from extreme heat, water quality/availability for pharma manufacturing",
    sources: "MRK 10-K, ESG Progress Report"
  },
  {
    companyName: "Nike", ticker: "NKE", naicsCode: "316210", naicsDescription: "Footwear Manufacturing",
    sector: "Consumer Discretionary", subsector: "Athletic Apparel/Footwear", hqState: "OR", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "79,400",
    materialDependencies: [
      { name: "Synthetic Textiles (Polyester, Nylon)", criticality: "high", primarySource: "China, Vietnam, Taiwan, South Korea", notes: "Flyknit, Dri-FIT fabrics; petrochemical-derived; recycled polyester adoption growing" },
      { name: "Natural Rubber", criticality: "high", primarySource: "Vietnam, Thailand, Indonesia", notes: "Outsole material; deforestation and labor rights concerns" },
      { name: "EVA & Polyurethane Foam", criticality: "high", primarySource: "China, Vietnam, South Korea", notes: "Midsole cushioning (Air, ZoomX, React); petroleum-based" },
      { name: "Leather (Bovine)", criticality: "medium", primarySource: "Brazil, Argentina, Australia, US", notes: "Declining use; shifting to synthetic and recycled alternatives" },
      { name: "Cotton", criticality: "medium", primarySource: "US, India, Brazil, Australia", notes: "Apparel; transitioning to organic and Better Cotton" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 50, criticality: "high", notes: "Retail stores, distribution centers, offices" },
      { source: "Renewable (Solar/Wind)", percentOfTotal: 30, criticality: "high", notes: "96% renewable electricity in owned operations" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "medium", notes: "Distribution center heating" },
      { source: "Diesel/Fleet", percentOfTotal: 10, criticality: "medium", notes: "Logistics and shipping" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Textile dyeing and finishing (supply chain), distribution center operations", annualVolumeEstimate: "~5B gallons (including supply chain dyeing)", waterStressExposure: "High - textile dyeing in Vietnam and China in water-stressed river basins", notes: "Direct operations use minimal water; supply chain textile dyeing/finishing is extremely water-intensive and polluting" },
    geographicDependencies: [
      { region: "Beaverton, OR", dependencyType: "World headquarters", criticality: "high", notes: "Corporate campus and design center" },
      { region: "Vietnam", dependencyType: "Primary manufacturing", criticality: "high", notes: "~50% of footwear production; flood risk from Mekong Delta" },
      { region: "China (Fujian, Guangdong)", dependencyType: "Manufacturing and market", criticality: "high", notes: "~25% production; largest growth market; geopolitical risk" },
      { region: "Indonesia", dependencyType: "Manufacturing", criticality: "medium", notes: "~20% of footwear production" }
    ],
    supplyChainNotes: "Asset-light manufacturing model with ~500 contract factories across 40 countries. Concentrated in Vietnam and China. Move to DTC (direct-to-consumer) reduces wholesale dependency. MOVE TO ZERO sustainability program.",
    climateRiskExposure: "High - manufacturing in climate-vulnerable SE Asia (flooding, extreme heat), cotton and rubber supply disruption from drought, supply chain decarbonization challenge",
    sources: "NKE 10-K, Impact Report"
  },
  {
    companyName: "NVIDIA", ticker: "NVDA", naicsCode: "334413", naicsDescription: "Semiconductor and Related Device Manufacturing",
    sector: "Technology", subsector: "Semiconductors/AI", hqState: "CA", hqRegion: "US",
    revenueRange: "$50B-$100B", employees: "29,600",
    materialDependencies: [
      { name: "Advanced Semiconductors (5nm/4nm wafers)", criticality: "high", primarySource: "Taiwan (TSMC - sole source for leading-edge)", notes: "H100, A100, B100 GPU production; extreme concentration risk at TSMC" },
      { name: "HBM (High Bandwidth Memory)", criticality: "high", primarySource: "South Korea (SK Hynix, Samsung)", notes: "HBM3E memory stacking for AI GPUs; supply-constrained" },
      { name: "Advanced Packaging (CoWoS)", criticality: "high", primarySource: "Taiwan (TSMC CoWoS)", notes: "Chip-on-Wafer-on-Substrate packaging; major bottleneck for AI chip production" },
      { name: "Rare Earth Elements (Neodymium)", criticality: "medium", primarySource: "China (80%+ of processing)", notes: "Magnets in data center cooling fans and systems" },
      { name: "PCB Substrates (ABF)", criticality: "medium", primarySource: "Japan (Ajinomoto), Taiwan", notes: "Organic substrates for GPU packaging" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 50, criticality: "high", notes: "Offices, labs, testing facilities" },
      { source: "Renewable PPAs", percentOfTotal: 40, criticality: "high", notes: "100% renewable electricity for operations; massive Scope 3 from GPU power use" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Office heating" },
      { source: "On-site Solar", percentOfTotal: 5, criticality: "low", notes: "Santa Clara campus solar" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Office campus cooling, landscaping", annualVolumeEstimate: "~10M gallons (direct operations)", waterStressExposure: "Low direct, Very High indirect - TSMC fabs in Taiwan use billions of gallons of ultrapure water", notes: "Fabless model means almost all water use is at TSMC and packaging facilities; Taiwan water stress directly affects NVIDIA supply" },
    geographicDependencies: [
      { region: "Santa Clara, CA", dependencyType: "Global headquarters", criticality: "high", notes: "R&D, design, corporate operations" },
      { region: "Taiwan (TSMC fabs)", dependencyType: "Semiconductor fabrication", criticality: "high", notes: "Single point of failure for leading-edge GPU production; geopolitical risk" },
      { region: "South Korea (SK Hynix)", dependencyType: "HBM memory supply", criticality: "high", notes: "Critical AI chip component" },
      { region: "Israel", dependencyType: "R&D center", criticality: "medium", notes: "Mellanox networking technology acquisition" }
    ],
    supplyChainNotes: "Extreme concentration risk at TSMC for advanced chip fabrication. AI boom driving unprecedented demand; CoWoS packaging is primary supply bottleneck. US export controls affect China sales (~25% of revenue).",
    climateRiskExposure: "Medium-High - Taiwan water stress and earthquake risk to TSMC supply, enormous Scope 3 emissions from GPU energy consumption in data centers, US-China geopolitical risk",
    sources: "NVDA 10-K, ESG Report, Semiconductor Industry Association"
  },
  {
    companyName: "Salesforce", ticker: "CRM", naicsCode: "511210", naicsDescription: "Software Publishers",
    sector: "Technology", subsector: "Cloud Software/SaaS", hqState: "CA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "73,000",
    materialDependencies: [
      { name: "Data Center Servers", criticality: "high", primarySource: "US (Dell, HPE), Taiwan, China", notes: "Own and collocated data center infrastructure" },
      { name: "Cloud Infrastructure (Hyperscaler)", criticality: "high", primarySource: "US (AWS, GCP, Azure)", notes: "Significant workload on public cloud partners" },
      { name: "Networking Equipment", criticality: "high", primarySource: "US (Cisco, Arista), China", notes: "Data center networking and connectivity" },
      { name: "Storage Systems (SSDs)", criticality: "medium", primarySource: "South Korea, Japan, US", notes: "Enterprise data storage for customer data" },
      { name: "Cooling Systems", criticality: "medium", primarySource: "US, Japan", notes: "Data center thermal management" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 40, criticality: "high", notes: "Data centers and offices" },
      { source: "Renewable PPAs (Wind/Solar)", percentOfTotal: 50, criticality: "high", notes: "100% renewable energy for operations since 2021" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Office building heating" },
      { source: "Diesel (Backup)", percentOfTotal: 5, criticality: "low", notes: "Data center backup generators" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Data center cooling", annualVolumeEstimate: "~80M gallons", waterStressExposure: "Moderate - some data centers in water-stressed regions; San Francisco HQ low stress", notes: "Growing data center footprint for AI (Einstein) increasing water demand" },
    geographicDependencies: [
      { region: "San Francisco, CA", dependencyType: "Global headquarters", criticality: "high", notes: "Salesforce Tower; earthquake risk" },
      { region: "Virginia (Loudoun County)", dependencyType: "Data center region", criticality: "high", notes: "Major US East cloud infrastructure" },
      { region: "UK & Europe", dependencyType: "International operations", criticality: "medium", notes: "EU data residency requirements" },
      { region: "India (Hyderabad)", dependencyType: "Engineering & support", criticality: "medium", notes: "Large engineering team" }
    ],
    supplyChainNotes: "SaaS model with 150,000+ customers. Hybrid data center strategy (owned + hyperscaler). AI (Einstein/Agentforce) driving compute demand growth. Slack and MuleSoft acquisitions expand platform.",
    climateRiskExposure: "Medium - data center energy/water demand growing with AI, San Francisco earthquake risk, server supply chain semiconductor concentration",
    sources: "CRM 10-K, Stakeholder Impact Report"
  },
  {
    companyName: "Travelers Companies", ticker: "TRV", naicsCode: "524126", naicsDescription: "Direct Property and Casualty Insurance Carriers",
    sector: "Financial Services", subsector: "Property & Casualty Insurance", hqState: "NY", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "30,800",
    materialDependencies: [
      { name: "Data Center & IT Infrastructure", criticality: "high", primarySource: "US (Dell, HPE), Taiwan", notes: "Claims processing, underwriting models, customer systems" },
      { name: "Actuarial & Climate Modeling Software", criticality: "high", primarySource: "US (Verisk, Moody's RMS), UK", notes: "Catastrophe modeling for underwriting" },
      { name: "Cloud Computing Services", criticality: "medium", primarySource: "US (AWS, Azure)", notes: "Digital transformation of insurance operations" },
      { name: "Office Real Estate", criticality: "medium", primarySource: "New York, Hartford CT", notes: "Corporate offices and claims centers" },
      { name: "Paper & Printing", criticality: "low", primarySource: "US domestic", notes: "Policy documents; rapidly declining with digital" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 80, criticality: "high", notes: "Office buildings and data centers" },
      { source: "Natural Gas", percentOfTotal: 10, criticality: "low", notes: "Office heating" },
      { source: "Renewable Energy Credits", percentOfTotal: 10, criticality: "low", notes: "Purchasing RECs for carbon reduction" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Office HVAC, landscaping", annualVolumeEstimate: "~10M gallons", waterStressExposure: "Low - office-based operations", notes: "Minimal direct water dependency; investment portfolio has exposure to water-intensive industries" },
    geographicDependencies: [
      { region: "New York City", dependencyType: "Headquarters", criticality: "high", notes: "Corporate operations" },
      { region: "Hartford, CT", dependencyType: "Major operations center", criticality: "high", notes: "Historical insurance capital; significant operations" },
      { region: "US Nationwide", dependencyType: "Underwriting exposure", criticality: "high", notes: "Property insurance in hurricane, wildfire, and tornado zones" },
      { region: "UK, Ireland, Canada", dependencyType: "International operations", criticality: "medium", notes: "Lloyd's syndicate and international business" }
    ],
    supplyChainNotes: "P&C insurer directly exposed to climate change through increasing catastrophe losses. Wildfire, hurricane, and severe convective storm losses driving premium increases and market exits in high-risk areas.",
    climateRiskExposure: "Very High - climate change is the defining business risk; increasing catastrophe frequency and severity, wildfire exposure in California, hurricane exposure along Gulf/Atlantic coasts",
    sources: "TRV 10-K, TCFD Report"
  },
  {
    companyName: "Verizon", ticker: "VZ", naicsCode: "517311", naicsDescription: "Wired Telecommunications Carriers",
    sector: "Telecommunications", subsector: "Telecommunications", hqState: "NY", hqRegion: "US",
    revenueRange: ">$100B", employees: "105,000",
    materialDependencies: [
      { name: "Fiber Optic Cable", criticality: "high", primarySource: "US (Corning), Japan, China", notes: "Fios network buildout; massive fiber deployment" },
      { name: "5G Radio Equipment (RAN)", criticality: "high", primarySource: "Sweden (Ericsson), Finland (Nokia), South Korea (Samsung)", notes: "Millimeter wave and C-band equipment" },
      { name: "Cell Tower Infrastructure", criticality: "high", primarySource: "US (Crown Castle, American Tower lease)", notes: "160,000+ cell sites; tower lease dependency" },
      { name: "Semiconductors (Baseband, RF)", criticality: "high", primarySource: "Taiwan (TSMC), US (Qualcomm), South Korea", notes: "Network equipment chipsets" },
      { name: "Copper Cable & Conduit", criticality: "medium", primarySource: "US, Chile, Peru", notes: "Legacy copper network maintenance; declining" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 70, criticality: "high", notes: "Network infrastructure, data centers, offices" },
      { source: "Diesel (Backup Generators)", percentOfTotal: 10, criticality: "high", notes: "Cell site backup power; critical during storms" },
      { source: "Renewable PPAs", percentOfTotal: 15, criticality: "medium", notes: "50%+ renewable energy target by 2025" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Office and facility heating" }
    ],
    waterDependency: { usageLevel: "medium", primaryUse: "Data center cooling, office facilities", annualVolumeEstimate: "~100M gallons", waterStressExposure: "Low-Moderate - data centers distributed across regions", notes: "Network equipment generates significant heat; cooling systems at switching centers and data centers" },
    geographicDependencies: [
      { region: "New York City", dependencyType: "Headquarters", criticality: "high", notes: "Corporate operations" },
      { region: "Northeast US (NY, NJ, PA, MA)", dependencyType: "Fios wireline territory", criticality: "high", notes: "Core Fios fiber market; Nor'easter and flooding risk" },
      { region: "US Nationwide", dependencyType: "Wireless network", criticality: "high", notes: "4G/5G coverage; hurricane and wildfire exposure" },
      { region: "India", dependencyType: "IT services and support", criticality: "medium", notes: "Network operations and customer support" }
    ],
    supplyChainNotes: "Massive physical infrastructure network vulnerable to extreme weather. 5G rollout requires significant capital investment and equipment from limited supplier base. Tower lease costs are a major expense.",
    climateRiskExposure: "High - network infrastructure damage from hurricanes, wildfires, and flooding; increased backup power demand during outages; rising cooling costs from heat waves",
    sources: "VZ 10-K, ESG Report"
  },
  {
    companyName: "Visa", ticker: "V", naicsCode: "522320", naicsDescription: "Financial Transactions Processing",
    sector: "Technology", subsector: "Payment Technology", hqState: "CA", hqRegion: "US",
    revenueRange: "$10B-$50B", employees: "30,300",
    materialDependencies: [
      { name: "Data Center Servers & Storage", criticality: "high", primarySource: "US (Dell, HPE), Taiwan, Japan", notes: "VisaNet processes 65,000+ transactions/second; zero-downtime requirement" },
      { name: "Networking Equipment (Ultra-Low Latency)", criticality: "high", primarySource: "US (Cisco, Juniper), Sweden", notes: "Global payment network backbone" },
      { name: "Cybersecurity Hardware & Software", criticality: "high", primarySource: "US (Palo Alto, CrowdStrike), Israel", notes: "Payment security and fraud detection systems" },
      { name: "Cloud Infrastructure", criticality: "medium", primarySource: "US (AWS, Azure, GCP)", notes: "Developer platform and analytics workloads" },
      { name: "Physical Card Materials", criticality: "low", primarySource: "US, Germany, Japan", notes: "Visa does not produce cards; banks order from card manufacturers" }
    ],
    energyDependencies: [
      { source: "Grid Electricity", percentOfTotal: 55, criticality: "high", notes: "Data centers processing 200B+ annual transactions" },
      { source: "Renewable PPAs", percentOfTotal: 35, criticality: "high", notes: "100% renewable electricity for operations" },
      { source: "Diesel (Backup)", percentOfTotal: 5, criticality: "medium", notes: "Data center backup power for uptime guarantee" },
      { source: "Natural Gas", percentOfTotal: 5, criticality: "low", notes: "Office heating" }
    ],
    waterDependency: { usageLevel: "low", primaryUse: "Data center cooling, office operations", annualVolumeEstimate: "~15M gallons", waterStressExposure: "Low - distributed data centers with redundancy", notes: "Low water intensity; payment processing is primarily compute-intensive, not water-intensive" },
    geographicDependencies: [
      { region: "San Francisco, CA", dependencyType: "Global headquarters", criticality: "high", notes: "Corporate operations; earthquake risk" },
      { region: "Ashburn, VA", dependencyType: "East Coast data center", criticality: "high", notes: "Primary US East processing hub" },
      { region: "London, UK", dependencyType: "European headquarters", criticality: "high", notes: "EU processing and operations" },
      { region: "Singapore", dependencyType: "Asia-Pacific hub", criticality: "medium", notes: "APAC transaction processing" }
    ],
    supplyChainNotes: "Asset-light network model; no lending risk. VisaNet availability is >99.999%. Revenue tied to global consumer spending and cross-border travel. Competitive pressure from real-time payment systems.",
    climateRiskExposure: "Low - minimal physical footprint; indirect exposure through consumer spending shifts from climate events and payment infrastructure resilience during disasters",
    sources: "V 10-K, ESG Report"
  }
];
