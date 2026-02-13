import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Thermometer, Droplets, Wind, Flame, CloudRain, Waves, Sun, Zap, Building2, Scale, TrendingUp, Users, Wrench, Shield, ChevronDown, ChevronUp, Plus, Loader2, AlertTriangle, CheckCircle, Info, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PhysicalRisk {
  hazard: string;
  severity: number;
  likelihood: number;
  timeframe: string;
  description: string;
  projectedImpact: string;
  adaptationMeasures: string;
}

interface TransitionRisk {
  category: string;
  risk: string;
  severity: number;
  likelihood: number;
  timeframe: string;
  description: string;
  financialImplication: string;
  mitigationStrategy: string;
}

interface MunicipalAssessment {
  cityName: string;
  state: string;
  population: string;
  region: string;
  climateZone: string;
  physicalRisks: PhysicalRisk[];
  transitionRisks: TransitionRisk[];
  overallPhysicalScore: number;
  overallTransitionScore: number;
  keyFindings: string;
  recommendations: string[];
}

const EXAMPLE_CITIES: MunicipalAssessment[] = [
  {
    cityName: "Denver",
    state: "Colorado",
    population: "715,000",
    region: "Mountain West",
    climateZone: "Semi-arid continental",
    overallPhysicalScore: 3.4,
    overallTransitionScore: 2.8,
    keyFindings: "Denver faces significant wildfire smoke exposure and increasing extreme heat days. Water supply from snowpack-dependent sources is increasingly unreliable. The city's rapid growth is straining infrastructure while creating opportunities for climate-forward development.",
    recommendations: [
      "Expand urban tree canopy to 20% coverage for heat mitigation",
      "Diversify water supply beyond South Platte River basin",
      "Strengthen wildfire smoke early warning and air filtration systems",
      "Accelerate building electrification in new construction",
      "Invest in transit-oriented development to reduce vehicle emissions"
    ],
    physicalRisks: [
      { hazard: "Wildfire Smoke", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Denver experiences increasing wildfire smoke events from western fires, with poor air quality days tripling since 2010. PM2.5 concentrations regularly exceed EPA standards during fire season.", projectedImpact: "50+ unhealthy air quality days per year by 2035", adaptationMeasures: "Public air quality shelters, HVAC filtration upgrades, outdoor worker protections" },
      { hazard: "Extreme Heat", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Days above 95°F projected to double by 2050. Urban heat island effect compounds temperatures in downtown and industrial areas.", projectedImpact: "30+ days above 95°F annually by 2050, up from 10 historically", adaptationMeasures: "Cool roof mandates, expanded cooling centers, heat action plans" },
      { hazard: "Drought", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Colorado River compact and snowpack dependency create water supply vulnerabilities. Denver Water's supply has been stressed by consecutive dry years.", projectedImpact: "20-30% reduction in reliable water supply by 2040", adaptationMeasures: "Water recycling expansion, tiered pricing, xeriscaping incentives" },
      { hazard: "Flash Flooding", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Intense precipitation events overwhelm aging stormwater infrastructure, particularly along Cherry Creek and the South Platte River corridors.", projectedImpact: "$50-100M in annual flood damage potential", adaptationMeasures: "Green infrastructure, detention basin expansion, floodplain restoration" },
      { hazard: "Winter Storms", severity: 2, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "While overall snowfall may decrease, intense blizzard events and rapid freeze-thaw cycles damage infrastructure and disrupt transportation.", projectedImpact: "Increased infrastructure maintenance costs of $20-40M annually", adaptationMeasures: "Resilient road materials, improved de-icing strategies" },
      { hazard: "Hailstorms", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Denver metro is in one of the nation's most active hail corridors. Climate change may intensify convective storms producing damaging hail.", projectedImpact: "$2-4B in insured property losses per major event", adaptationMeasures: "Impact-resistant building materials, improved warning systems" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "Colorado GHG Reduction Mandates", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Colorado's HB19-1261 requires 50% emissions reduction by 2030 and 90% by 2050. Denver must align municipal operations and building codes.", financialImplication: "$200-500M in building retrofit costs over 10 years", mitigationStrategy: "Phased building performance standards, incentive programs for early compliance" },
      { category: "Technology", risk: "Grid Modernization Costs", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Transitioning from Xcel Energy's coal-dependent grid to renewables requires significant transmission and distribution upgrades.", financialImplication: "$150-300M in municipal utility infrastructure", mitigationStrategy: "Community solar programs, distributed energy resource integration" },
      { category: "Market", risk: "Water Rights Repricing", severity: 4, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "As water scarcity intensifies, municipal water costs will rise significantly, affecting economic competitiveness and household budgets.", financialImplication: "40-80% increase in water utility rates by 2040", mitigationStrategy: "Conservation pricing, water reuse technology investment" },
      { category: "Workforce", risk: "Outdoor Worker Heat Exposure", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Construction, landscaping, and utility workers face increasing heat-related illness risks, requiring schedule adjustments and productivity losses.", financialImplication: "$30-60M annually in lost productivity and health costs", mitigationStrategy: "Mandatory heat break policies, early morning work schedules" },
      { category: "Infrastructure", risk: "Transportation System Adaptation", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "RTD transit system and road network need upgrades for extreme weather resilience. EV charging infrastructure requires massive expansion.", financialImplication: "$500M-1B in transportation infrastructure investment needed", mitigationStrategy: "Integrated mobility planning, federal infrastructure funding pursuit" }
    ]
  },
  {
    cityName: "Los Angeles",
    state: "California",
    population: "3,900,000",
    region: "Pacific Coast",
    climateZone: "Mediterranean",
    overallPhysicalScore: 4.2,
    overallTransitionScore: 3.1,
    keyFindings: "Los Angeles faces a convergence of wildfire, extreme heat, drought, and sea level rise risks. The city's sprawling geography and aging infrastructure amplify physical vulnerabilities. California's aggressive climate policy creates both compliance costs and economic opportunities.",
    recommendations: [
      "Create defensible space zones in wildland-urban interface areas",
      "Accelerate LA's Green New Deal building decarbonization targets",
      "Expand recycled water to 70% of non-potable demand by 2035",
      "Invest $2B in coastal resilience along Santa Monica Bay",
      "Electrify public transit fleet and expand Metro rail system"
    ],
    physicalRisks: [
      { hazard: "Wildfire", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "The 2025 Palisades and Eaton fires demonstrated catastrophic wildfire potential within city limits. Over 100,000 structures are in very high fire hazard severity zones.", projectedImpact: "$10-50B+ per major wildfire event in direct losses", adaptationMeasures: "Vegetation management, building hardening, community firebreaks, evacuation route improvements" },
      { hazard: "Extreme Heat", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Heat waves reaching 110°F+ in the San Fernando Valley are becoming more frequent. Low-income communities of color bear disproportionate heat burden.", projectedImpact: "45+ extreme heat days per year by 2050, 2-3x increase in heat deaths", adaptationMeasures: "Cool pavement programs, shade equity initiatives, heat island mitigation" },
      { hazard: "Drought", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "LA imports 85% of its water. Colorado River allocations are shrinking and Sierra Nevada snowpack is declining, threatening the city's water security.", projectedImpact: "30-50% reduction in imported water reliability by 2045", adaptationMeasures: "Stormwater capture, groundwater replenishment, water recycling expansion" },
      { hazard: "Sea Level Rise", severity: 4, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Santa Monica, Venice, and Long Beach face significant inundation risk. Port of LA/Long Beach operations could be disrupted by 2-3 feet of sea level rise.", projectedImpact: "$8-12B in coastal property and infrastructure at risk by 2050", adaptationMeasures: "Managed retreat planning, seawall upgrades, living shoreline restoration" },
      { hazard: "Air Quality Degradation", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Wildfire smoke combined with vehicle emissions and industrial pollution create severe air quality crises. LA already has the worst ozone in the US.", projectedImpact: "100+ unhealthy air quality days annually, $5-10B in health costs", adaptationMeasures: "Clean air shelters, fleet electrification, industrial emission controls" },
      { hazard: "Flooding", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Atmospheric rivers and intense precipitation events overwhelm LA's concrete-channeled flood infrastructure. Post-fire landscapes increase debris flow risk.", projectedImpact: "$500M-2B per major flood event", adaptationMeasures: "Green infrastructure, LA River revitalization, permeable surfaces" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "California Cap-and-Trade Expansion", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "AB 32 and SB 32 mandate 40% GHG reduction below 1990 levels by 2030. Municipal compliance costs are substantial for fleet, buildings, and waste.", financialImplication: "$500M-1B in compliance costs over 5 years", mitigationStrategy: "Early adoption incentives, cap-and-trade revenue reinvestment" },
      { category: "Policy & Legal", risk: "Building Decarbonization Mandates", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "LA's Green New Deal and California's Title 24 require all-electric new construction and phased gas appliance replacement in existing buildings.", financialImplication: "$1-3B in building retrofit costs citywide", mitigationStrategy: "Phased compliance timelines, utility rebate programs, workforce training" },
      { category: "Technology", risk: "EV Infrastructure Gap", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "California's 2035 ICE vehicle ban requires massive charging infrastructure buildout. Grid capacity may be insufficient for widespread EV adoption.", financialImplication: "$2-5B in charging infrastructure and grid upgrades", mitigationStrategy: "Utility rate design for managed charging, workplace charging mandates" },
      { category: "Market", risk: "Insurance Market Retreat", severity: 5, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Major insurers are leaving California's homeowner market due to wildfire risk. Property values and mortgage availability could decline in fire-prone areas.", financialImplication: "$20-50B in potential property value impacts across fire zones", mitigationStrategy: "FAIR Plan reform, community-based insurance pools, risk reduction credits" },
      { category: "Reputation", risk: "Climate Migration Destination Pressure", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "As other regions face climate impacts, LA may see increased population pressure while managing its own climate challenges, straining housing and services.", financialImplication: "$1-3B annually in additional infrastructure and services", mitigationStrategy: "Regional climate migration planning, affordable housing expansion" },
      { category: "Infrastructure", risk: "Power Grid Reliability", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "LADWP's aging grid faces stress from heat waves, wildfire de-energization events, and increasing electrification demand. Public Safety Power Shutoffs disrupt millions.", financialImplication: "$2-5B in grid hardening and modernization costs", mitigationStrategy: "Grid undergrounding, distributed energy storage, microgrids" }
    ]
  },
  {
    cityName: "New York",
    state: "New York",
    population: "8,300,000",
    region: "Northeast",
    climateZone: "Humid subtropical",
    overallPhysicalScore: 3.8,
    overallTransitionScore: 3.3,
    keyFindings: "New York City faces existential coastal flooding and sea level rise threats, particularly for lower Manhattan and coastal communities. Extreme heat disproportionately affects low-income neighborhoods. The city's ambitious Local Law 97 creates significant building sector transition costs.",
    recommendations: [
      "Accelerate East Side Coastal Resiliency project and BIG U implementation",
      "Mandate building-level flood resilience for critical infrastructure",
      "Expand cool roof program to cover 1 billion square feet by 2030",
      "Create green jobs pathway for Local Law 97 building retrofits",
      "Develop managed retreat framework for highest-risk coastal areas"
    ],
    physicalRisks: [
      { hazard: "Coastal Flooding", severity: 5, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "NYC has 520 miles of coastline vulnerable to storm surge. Hurricane Sandy caused $19B in damage. Storm frequency and intensity are increasing.", projectedImpact: "400,000+ residents in 100-year floodplain, $100B+ in asset exposure", adaptationMeasures: "Coastal barriers, floodgates, building elevation requirements" },
      { hazard: "Sea Level Rise", severity: 5, likelihood: 5, timeframe: "Medium-term (2035-2050)", description: "NYC Panel on Climate Change projects 11-21 inches of sea level rise by 2050. Critical subway infrastructure, airports, and wastewater plants are at risk.", projectedImpact: "Permanent inundation of low-lying areas, $50-100B in infrastructure exposure", adaptationMeasures: "Living shorelines, infrastructure relocation, tidal barrier systems" },
      { hazard: "Extreme Heat", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Urban heat island adds 7-10°F to nighttime temperatures. Neighborhoods with less tree canopy and more impervious surfaces face highest heat mortality risk.", projectedImpact: "Heat-related deaths could triple by 2050 without intervention", adaptationMeasures: "Street tree planting, cool roofs, open hydrant programs, cooling centers" },
      { hazard: "Intense Precipitation", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Hurricane Ida (2021) demonstrated NYC's vulnerability to flash flooding from intense rainfall. Basement apartments and subway system face acute risk.", projectedImpact: "25% increase in extreme precipitation events, $5-15B in annual damage potential", adaptationMeasures: "Green infrastructure, cloudburst management, basement apartment protections" },
      { hazard: "Nor'easters", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Winter storms combined with sea level rise create compound flooding risks along all five borough coastlines. Wind damage to aging building stock is increasing.", projectedImpact: "$2-10B per major nor'easter event", adaptationMeasures: "Building wind resistance upgrades, emergency preparedness enhancement" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "Local Law 97 Compliance", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Local Law 97 requires buildings over 25,000 sq ft to cut emissions 40% by 2030 and 80% by 2050. Affects 50,000+ buildings covering 60% of citywide emissions.", financialImplication: "$16-24B in building retrofit costs across covered buildings", mitigationStrategy: "Property Assessed Clean Energy financing, utility incentives, compliance flexibility" },
      { category: "Policy & Legal", risk: "NYC Gas Ban for New Buildings", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Local Law 154 bans fossil fuel combustion in new buildings under 7 stories (2024) and taller buildings (2027). Developers must redesign heating and cooking systems.", financialImplication: "$1-3B in additional construction costs over 10 years", mitigationStrategy: "Heat pump incentive programs, developer technical assistance" },
      { category: "Market", risk: "Stranded Real Estate Assets", severity: 4, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Flood-zone properties face declining values as insurance costs rise and flood events increase. Commercial buildings failing LL97 face penalties and reduced demand.", financialImplication: "$30-80B in potential property value decline in flood zones", mitigationStrategy: "Flood resilience investments, building energy upgrades, disclosure requirements" },
      { category: "Technology", risk: "Grid Decarbonization Costs", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "ConEd and NYPA must transition from gas peaker plants and build offshore wind connections. Peak demand management becomes critical with building electrification.", financialImplication: "$5-15B in grid infrastructure investment", mitigationStrategy: "Demand response programs, battery storage, offshore wind procurement" },
      { category: "Infrastructure", risk: "MTA Climate Resilience", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "NYC subway system requires billions in flood protection and heat resilience upgrades. Service disruptions from extreme weather cost the economy $millions daily.", financialImplication: "$10-20B in MTA climate adaptation investments needed", mitigationStrategy: "Flood barriers at vulnerable stations, pump system upgrades, redundancy planning" },
      { category: "Workforce", risk: "Green Building Skills Gap", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "LL97 compliance requires 40,000+ skilled workers for heat pump installation, building envelope improvements, and energy management. Current workforce is insufficient.", financialImplication: "$500M-1B in workforce development investment needed", mitigationStrategy: "Union training programs, community college partnerships, immigrant worker pathways" }
    ]
  },
  {
    cityName: "Dallas",
    state: "Texas",
    population: "1,340,000",
    region: "South Central",
    climateZone: "Humid subtropical",
    overallPhysicalScore: 3.6,
    overallTransitionScore: 2.5,
    keyFindings: "Dallas faces intensifying extreme heat and severe storms while its economy remains heavily tied to oil and gas. Water supply from aging reservoirs is vulnerable to extended drought. The absence of strong state climate policy creates both flexibility and uncertainty for municipal planning.",
    recommendations: [
      "Develop comprehensive urban heat management plan targeting vulnerable communities",
      "Diversify water supply through reclaimed water and regional partnerships",
      "Strengthen building codes for tornado and hail resistance",
      "Create voluntary green building incentive program given state policy limits",
      "Invest in distributed solar and storage to improve grid resilience"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Dallas already experiences 20+ days above 100°F in hot years. By 2050, this could exceed 60 days. The 2023 heat dome demonstrated lethal potential.", projectedImpact: "60+ days above 100°F by 2050, significant increase in heat mortality", adaptationMeasures: "Cooling centers, urban forestry expansion, cool building standards" },
      { hazard: "Severe Storms & Tornadoes", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Dallas sits at the southern end of Tornado Alley. Severe thunderstorms with damaging hail and straight-line winds are becoming more intense.", projectedImpact: "$1-5B per major severe weather outbreak in metro area", adaptationMeasures: "Enhanced building codes, safe room requirements, improved warning systems" },
      { hazard: "Drought", severity: 4, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "North Texas reservoirs have dropped to critical levels during extended drought. Growing population increases demand while climate change reduces reliability.", projectedImpact: "Water demand could exceed supply by 20% by 2040 without conservation", adaptationMeasures: "Water recycling, conservation mandates, regional water transfers" },
      { hazard: "Flash Flooding", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Rapid urbanization has increased impervious surfaces. Trinity River corridor and tributary creeks experience dangerous flash flooding during intense storms.", projectedImpact: "$200-500M in annual flood damage, Trinity River corridor at risk", adaptationMeasures: "Trinity River floodway improvements, green infrastructure, detention" },
      { hazard: "Ice Storms", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Winter Storm Uri (2021) exposed critical vulnerability to cold weather events. Power grid failures caused widespread suffering and damage.", projectedImpact: "Major ice storm can cause $5-20B in damage and grid failure", adaptationMeasures: "Grid winterization, backup power requirements, building weatherization" },
      { hazard: "Air Quality", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Ozone levels frequently exceed EPA standards during summer heat. Increasing temperatures worsen ground-level ozone formation.", projectedImpact: "50+ ozone exceedance days per year, significant respiratory health costs", adaptationMeasures: "Vehicle emission reduction, industrial controls, health alert systems" }
    ],
    transitionRisks: [
      { category: "Market", risk: "Oil & Gas Sector Transition", severity: 4, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Dallas-Fort Worth's economy has significant oil & gas sector exposure. As energy transition accelerates, corporate relocations and job losses are possible.", financialImplication: "$5-15B in economic impact if oil & gas sector contracts 30%", mitigationStrategy: "Economic diversification, clean energy sector recruitment, worker retraining" },
      { category: "Infrastructure", risk: "ERCOT Grid Vulnerability", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Texas' isolated grid (ERCOT) faces reliability challenges from extreme heat and cold. Lack of interconnection limits backup options during crisis.", financialImplication: "$2-10B per major grid failure event", mitigationStrategy: "Grid hardening, distributed generation, demand response expansion" },
      { category: "Policy & Legal", risk: "Federal Climate Regulation Uncertainty", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "While Texas resists state climate policy, federal regulations on emissions, efficiency, and disclosure may still impact Dallas businesses and operations.", financialImplication: "$500M-2B in compliance costs depending on federal policy direction", mitigationStrategy: "Scenario planning for multiple policy futures, voluntary compliance" },
      { category: "Technology", risk: "Building Cooling Cost Escalation", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Rising temperatures increase cooling demand 15-30% by 2050. Aging commercial building stock requires significant HVAC upgrades.", financialImplication: "$300-700M annually in additional cooling energy costs", mitigationStrategy: "Building energy efficiency retrofits, cool roof programs, district cooling" },
      { category: "Reputation", risk: "Corporate ESG Pressure", severity: 2, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Major Dallas-headquartered companies face investor and customer pressure on climate action, potentially affecting HQ location decisions.", financialImplication: "Potential loss of corporate relocations worth $1-5B in economic activity", mitigationStrategy: "Municipal sustainability programs, green building incentives" }
    ]
  },
  {
    cityName: "Chicago",
    state: "Illinois",
    population: "2,700,000",
    region: "Great Lakes / Midwest",
    climateZone: "Humid continental",
    overallPhysicalScore: 3.2,
    overallTransitionScore: 3.0,
    keyFindings: "Chicago benefits from abundant fresh water via Lake Michigan but faces significant heat, flooding, and extreme weather risks. The city's aging infrastructure requires substantial climate adaptation investment. Illinois' clean energy mandates create transition costs but also position Chicago as a clean energy hub.",
    recommendations: [
      "Upgrade stormwater systems to handle increasing precipitation intensity",
      "Expand urban tree canopy in heat-vulnerable South and West Side neighborhoods",
      "Leverage Great Lakes water advantage for economic development",
      "Pursue federal funding for infrastructure modernization",
      "Develop climate workforce training programs at community colleges"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "The 1995 heat wave killed 739 people. By 2050, Chicago could experience 60 days above 90°F annually, up from 15 historically. Communities of color face highest risk.", projectedImpact: "60+ days above 90°F by 2050, heat mortality could quadruple", adaptationMeasures: "Cooling centers, urban forestry, heat emergency response plans" },
      { hazard: "Intense Precipitation & Flooding", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Basement flooding affects hundreds of thousands of homes. The Deep Tunnel (TARP) system is overwhelmed during extreme rainfall. Annual precipitation has increased 15%.", projectedImpact: "$2-5B in annual flood damage across metro area", adaptationMeasures: "Green infrastructure, TARP expansion, permeable alley program" },
      { hazard: "Lake Michigan Shoreline Erosion", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Record high lake levels in 2020 caused significant shoreline erosion and damage to lakefront infrastructure, parks, and roads.", projectedImpact: "$1-3B in lakefront infrastructure damage and repair costs", adaptationMeasures: "Shoreline armoring, managed retreat from eroding areas, living shorelines" },
      { hazard: "Severe Storms", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Derecho events, severe thunderstorms, and occasional tornadoes cause significant damage to the metro area. Wind events threaten aging building stock.", projectedImpact: "$500M-2B per major severe weather event", adaptationMeasures: "Building code strengthening, tree risk management, backup power" },
      { hazard: "Extreme Cold", severity: 2, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Polar vortex disruptions can bring dangerous cold. The 2019 polar vortex saw -23°F wind chills causing infrastructure failures and casualties.", projectedImpact: "Infrastructure damage, energy cost spikes, health impacts", adaptationMeasures: "Building weatherization, emergency warming centers, pipe protection" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "Illinois CEJA Compliance", severity: 3, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "The Climate and Equitable Jobs Act requires 100% clean energy by 2045 and coal plant closure by 2030. Municipal operations must transition rapidly.", financialImplication: "$500M-1.5B in clean energy transition costs for municipal sector", mitigationStrategy: "Clean energy procurement, building electrification, fleet conversion" },
      { category: "Infrastructure", risk: "Aging Infrastructure Compound Risk", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Chicago's water mains average 100+ years old. Combined with climate stresses from heat and flooding, infrastructure failure risk is compounding.", financialImplication: "$3-8B in infrastructure replacement and climate-proofing", mitigationStrategy: "Asset management prioritization, federal infrastructure funding, rate increases" },
      { category: "Market", risk: "Climate Destination Economics", severity: 2, likelihood: 3, timeframe: "Long-term (2050-2100)", description: "Chicago's Great Lakes location and water abundance may attract climate migrants and businesses, creating growth opportunities but also strain.", financialImplication: "Potential $5-15B in economic growth but $3-8B in infrastructure needs", mitigationStrategy: "Proactive growth planning, infrastructure pre-investment, housing development" },
      { category: "Technology", risk: "Building Electrification Costs", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Converting Chicago's gas-heated building stock to electric heat pumps requires significant upfront investment and grid capacity expansion.", financialImplication: "$5-15B in building conversion costs across residential and commercial", mitigationStrategy: "Incentive programs, phased mandates, workforce development" },
      { category: "Workforce", risk: "Just Transition for Energy Workers", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Coal and gas plant closures affect workers and tax bases in communities within the Chicago metro area. CEJA includes workforce provisions but implementation is complex.", financialImplication: "$200-500M in workforce transition costs and community support", mitigationStrategy: "CEJA workforce hubs, apprenticeship programs, clean energy job placement" }
    ]
  },
  {
    cityName: "Miami",
    state: "Florida",
    population: "450,000",
    region: "Southeast",
    climateZone: "Tropical monsoon",
    overallPhysicalScore: 4.8,
    overallTransitionScore: 3.5,
    keyFindings: "Miami faces the highest sea level rise risk of any major US city due to its low elevation and porous limestone geology that undermines traditional flood barriers. Hurricane intensification, extreme heat, and saltwater intrusion threaten the city's long-term viability. The insurance market is already pricing in catastrophic risk.",
    recommendations: [
      "Implement aggressive stormwater pump and infrastructure elevation program",
      "Require all new construction to meet 3-foot sea level rise standard",
      "Establish managed retreat framework for most vulnerable neighborhoods",
      "Create regional climate resilience authority with Miami-Dade County",
      "Pursue federal disaster mitigation funding for pre-disaster investments"
    ],
    physicalRisks: [
      { hazard: "Sea Level Rise", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Miami's porous limestone substrate means seawalls alone cannot prevent flooding. King tide flooding already impacts major roads. 2-3 feet of rise by 2060 threatens city viability.", projectedImpact: "10-14 inches of additional rise by 2040, threatening $30B+ in property", adaptationMeasures: "Pump stations, road elevation, building standards, managed retreat planning" },
      { hazard: "Hurricane Intensification", severity: 5, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Warmer waters fuel rapid hurricane intensification. Category 4-5 hurricanes with higher storm surge threaten catastrophic damage. Hurricane Andrew (1992) caused $27B.", projectedImpact: "Category 4-5 hurricane could cause $100B+ in damage to greater Miami", adaptationMeasures: "Building code enforcement, hurricane-resistant construction, evacuation planning" },
      { hazard: "Tidal Flooding", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Sunny day flooding during king tides already inundates Miami Beach, Brickell, and other low-lying areas. Frequency has increased 400% since 2006.", projectedImpact: "200+ tidal flood events per year by 2040, $500M+ in annual damage", adaptationMeasures: "Stormwater pumps, raised roads, living shorelines, saltwater barriers" },
      { hazard: "Extreme Heat", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Heat index regularly exceeds 105°F in summer. Miami's outdoor-dependent tourism and construction economy is particularly vulnerable.", projectedImpact: "90+ dangerous heat days per year by 2050", adaptationMeasures: "Chief Heat Officer programs, shade requirements, worker heat protections" },
      { hazard: "Saltwater Intrusion", severity: 4, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Rising seas push saltwater into the Biscayne Aquifer, Miami-Dade's primary freshwater source. This threatens drinking water for 2.7 million people.", projectedImpact: "50%+ of wellfields at risk by 2060, $2-5B in water system adaptation", adaptationMeasures: "Salinity barriers, alternative water supply, desalination investment" },
      { hazard: "Coral Reef Degradation", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Florida's coral reef tract, the only barrier reef in the continental US, is rapidly dying from ocean warming, reducing natural storm surge protection.", projectedImpact: "Loss of reef protection could increase storm surge damage by 30-50%", adaptationMeasures: "Coral restoration programs, reef-safe development practices" }
    ],
    transitionRisks: [
      { category: "Market", risk: "Insurance Market Collapse", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Major insurers are leaving Florida. Citizens Property Insurance (state insurer of last resort) faces unsustainable exposure. Premiums have tripled in some areas.", financialImplication: "$15-40B in property value decline as insurance becomes unavailable", mitigationStrategy: "Risk reduction credits, community resilience projects, federal insurance reform" },
      { category: "Market", risk: "Real Estate Value Correction", severity: 5, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Climate risk pricing is beginning to affect Miami real estate. Sea level rise disclosure requirements and flood insurance costs could trigger market correction.", financialImplication: "$50-100B in potential property value decline across Miami-Dade", mitigationStrategy: "Resilience investment to protect values, managed transition planning" },
      { category: "Policy & Legal", risk: "Climate Liability Litigation", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Miami-Dade faces potential liability for development approvals in known flood zones. Property owners may pursue legal claims as conditions worsen.", financialImplication: "$1-5B in potential legal exposure over 20 years", mitigationStrategy: "Updated zoning and development standards, disclosure requirements" },
      { category: "Infrastructure", risk: "Utility System Adaptation", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "FPL and Miami-Dade water/sewer systems require massive hardening against sea level rise and storms. Turkey Point nuclear plant faces long-term flood risk.", financialImplication: "$5-15B in utility infrastructure adaptation costs", mitigationStrategy: "Rate-funded resilience investments, federal grants, infrastructure bonds" },
      { category: "Workforce", risk: "Construction & Tourism Worker Heat Risk", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Miami's dominant construction and tourism industries rely on outdoor workers. Miami-Dade heat ordinance faces state-level preemption challenges.", financialImplication: "$200-500M annually in lost productivity and health costs", mitigationStrategy: "Municipal heat protections, schedule adaptations, hydration programs" },
      { category: "Reputation", risk: "Climate Migration Outflow", severity: 3, likelihood: 3, timeframe: "Long-term (2050-2100)", description: "As climate impacts intensify, Miami may lose population and tax base to less-exposed cities. Young professionals increasingly cite climate in relocation decisions.", financialImplication: "$5-20B in long-term economic loss from population decline", mitigationStrategy: "Aggressive resilience investment, quality of life preservation" }
    ]
  },
  {
    cityName: "Boston",
    state: "Massachusetts",
    population: "675,000",
    region: "New England",
    climateZone: "Humid continental",
    overallPhysicalScore: 3.5,
    overallTransitionScore: 3.2,
    keyFindings: "Boston faces significant coastal flooding risk from nor'easters and sea level rise, particularly in the Back Bay and Seaport districts built on filled tidal flats. Extreme heat in urban cores disproportionately affects environmental justice communities. Massachusetts' aggressive climate mandates create near-term compliance costs.",
    recommendations: [
      "Complete harbor barrier feasibility study and interim flood protection",
      "Expand BERDO compliance support for mid-size building owners",
      "Invest in green infrastructure for combined sewer overflow reduction",
      "Develop district-level climate resilience plans for vulnerable neighborhoods",
      "Accelerate public transit electrification for MBTA fleet"
    ],
    physicalRisks: [
      { hazard: "Coastal Flooding", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Boston Harbor storm surge threatens downtown, Seaport, East Boston, and Charlestown. Much of Back Bay and Seaport is built on filled land at 10-15 feet elevation.", projectedImpact: "1% annual flood now causes $1B+ damage; rising with sea levels", adaptationMeasures: "Harbor barrier study, waterfront design standards, flood-proofing" },
      { hazard: "Sea Level Rise", severity: 4, likelihood: 5, timeframe: "Medium-term (2035-2050)", description: "Boston expects 9-21 inches of sea level rise by 2050. Historic waterfront areas, Logan Airport, and major hospitals face increasing flood exposure.", projectedImpact: "40 inches possible by 2070 under high scenario, $80B+ in assets at risk", adaptationMeasures: "Elevated construction standards, living shorelines, harbor infrastructure" },
      { hazard: "Extreme Heat", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Heat days above 90°F projected to triple by 2050. Roxbury, Dorchester, and Mattapan communities face highest heat island exposure with least tree canopy.", projectedImpact: "30+ days above 90°F by 2050, 5x increase in heat-related illness", adaptationMeasures: "Tree equity initiatives, cool roofs, heat emergency planning" },
      { hazard: "Nor'easters", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Powerful nor'easters combined with rising seas create compound flood risks. January 2018 flood came within inches of breaching seawalls in multiple neighborhoods.", projectedImpact: "Major nor'easter could cause $5-15B in damage with current sea levels", adaptationMeasures: "Seawall upgrades, building resilience, emergency response" },
      { hazard: "Intense Precipitation", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Extreme rainfall events overwhelm Boston's combined sewer system, causing sewage overflows into Boston Harbor and Charles River. Basement flooding is widespread.", projectedImpact: "20% increase in extreme precipitation, CSO events increasing", adaptationMeasures: "Green infrastructure, sewer separation, stormwater management" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "BERDO 2.0 Compliance", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Boston's Building Emissions Reduction and Disclosure Ordinance requires large buildings to achieve net-zero emissions by 2050 with interim targets starting 2025.", financialImplication: "$3-8B in building retrofit costs for covered buildings", mitigationStrategy: "Technical assistance, financing programs, alternative compliance pathways" },
      { category: "Policy & Legal", risk: "Massachusetts Clean Energy Mandates", severity: 3, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "MA requires 50% emissions reduction by 2030 and net-zero by 2050. Building sector electrification and clean heating mandates affect all new construction.", financialImplication: "$500M-1.5B in municipal compliance costs", mitigationStrategy: "Phased implementation, mass procurement programs, utility partnerships" },
      { category: "Technology", risk: "Cold Climate Heat Pump Challenges", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Boston's cold winters require cold-climate heat pumps that are more expensive. Older building stock presents installation challenges.", financialImplication: "$2-5B in heating system conversion costs across building stock", mitigationStrategy: "Cold climate HP incentives, networked geothermal, district energy" },
      { category: "Market", risk: "Coastal Real Estate Repricing", severity: 4, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Seaport District and waterfront property values face potential decline as flood risk awareness increases and insurance costs rise.", financialImplication: "$10-30B in potential waterfront property value impacts", mitigationStrategy: "Flood resilience investments, disclosure mandates, resilience certification" },
      { category: "Infrastructure", risk: "MBTA Climate Resilience", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "MBTA's century-old system faces flooding, heat buckling of tracks, and extreme weather disruptions. Blue Line tunnel under harbor is particularly vulnerable.", financialImplication: "$2-5B in climate resilience upgrades needed for MBTA", mitigationStrategy: "Flood barriers, track modernization, bus fleet electrification" }
    ]
  },
  {
    cityName: "Tucson",
    state: "Arizona",
    population: "545,000",
    region: "Southwest",
    climateZone: "Hot desert",
    overallPhysicalScore: 4.0,
    overallTransitionScore: 2.3,
    keyFindings: "Tucson faces extreme and worsening heat that already causes significant mortality. Water supply depends on the Central Arizona Project and declining Colorado River allocations. Dust storms and flash flooding pose additional hazards. The city has been proactive on water conservation but faces existential supply questions.",
    recommendations: [
      "Mandate cool roof and shade structures for all new development",
      "Expand rainwater harvesting and groundwater replenishment programs",
      "Develop extreme heat emergency response capacity for 120°F+ events",
      "Invest in solar microgrids for critical facilities and cooling centers",
      "Create regional water banking partnerships with agricultural users"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Tucson already averages 60+ days above 100°F. By 2050 this could exceed 100 days. Night temperatures staying above 85°F prevent recovery and increase mortality.", projectedImpact: "100+ days above 100°F by 2050, exponential increase in heat deaths", adaptationMeasures: "Shade requirements, cooling refuges, nighttime heat monitoring, outdoor work bans" },
      { hazard: "Drought & Water Scarcity", severity: 5, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Tucson receives 55% of water from the Central Arizona Project (Colorado River). Tier 1 and Tier 2 shortage declarations reduce Arizona's allocation.", projectedImpact: "30-50% reduction in Colorado River allocation by 2040", adaptationMeasures: "Water recycling to 100% of wastewater, aquifer storage, demand reduction" },
      { hazard: "Flash Flooding", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Monsoon season brings intense rainfall that causes dangerous flash floods in washes and low-lying areas. Climate change may intensify monsoon events.", projectedImpact: "More intense monsoon events, $50-200M in annual flood damage", adaptationMeasures: "Wash management, green infrastructure, flood warning systems" },
      { hazard: "Dust Storms (Haboobs)", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Massive dust storms reduce visibility to zero and deposit fine particulates affecting respiratory health. Drought and desertification increase dust storm frequency.", projectedImpact: "Increasing respiratory illness, transportation disruptions, infrastructure damage", adaptationMeasures: "Early warning systems, air filtration, vegetation windbreaks" },
      { hazard: "Wildfire", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Catalina Mountains and surrounding desert scrub face increasing fire risk. The Bighorn Fire (2020) threatened neighborhoods and caused evacuations.", projectedImpact: "Major wildfire could threaten 10,000+ homes in WUI zones", adaptationMeasures: "Defensible space, vegetation management, fire-resistant construction" }
    ],
    transitionRisks: [
      { category: "Infrastructure", risk: "Water System Transformation", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Tucson Water must transition to greater water recycling, rainwater harvesting, and demand management as Colorado River supplies decline.", financialImplication: "$500M-1.5B in water infrastructure investment over 15 years", mitigationStrategy: "Phased infrastructure upgrades, conservation pricing, federal funding" },
      { category: "Market", risk: "Cooling Energy Cost Escalation", severity: 3, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "As temperatures rise, residential and commercial cooling costs increase substantially, straining household budgets and business operations.", financialImplication: "$100-300M annually in additional community cooling costs by 2040", mitigationStrategy: "Solar + storage programs, building efficiency, TEP rate reform" },
      { category: "Technology", risk: "Solar Integration Opportunity", severity: 2, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Tucson's exceptional solar resource creates opportunities for distributed generation, but grid integration and storage challenges remain.", financialImplication: "$200-500M in solar and storage investment opportunity", mitigationStrategy: "Community solar programs, battery incentives, grid modernization" },
      { category: "Workforce", risk: "Outdoor Economy Heat Limits", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Construction, agriculture, mining, and tourism workers face dangerous heat. Work season compression and productivity losses affect the local economy.", financialImplication: "$100-300M annually in lost productivity and health costs", mitigationStrategy: "Schedule shifting, mechanization investment, indoor cooling requirements" },
      { category: "Reputation", risk: "Climate Livability Concerns", severity: 3, likelihood: 3, timeframe: "Long-term (2050-2100)", description: "As heat becomes more extreme, Tucson may struggle to attract workers and businesses. 'Climate haven' marketing by other cities creates competitive pressure.", financialImplication: "Potential population and economic growth slowdown", mitigationStrategy: "Quality of life investments, shade and cooling infrastructure, water security" }
    ]
  },
  {
    cityName: "Atlanta",
    state: "Georgia",
    population: "500,000",
    region: "Southeast",
    climateZone: "Humid subtropical",
    overallPhysicalScore: 3.3,
    overallTransitionScore: 2.7,
    keyFindings: "Atlanta faces increasing extreme heat and severe storms while its rapid growth strains water resources from the Chattahoochee River system. The city's tree canopy, while notable, is declining with development. Atlanta's position as a major economic hub creates both vulnerabilities and opportunities in the climate transition.",
    recommendations: [
      "Protect and expand tree canopy with enforceable canopy cover requirements",
      "Invest in Chattahoochee watershed protection and water conservation",
      "Strengthen building codes for severe storm and wind resistance",
      "Expand MARTA and reduce car dependency to cut emissions",
      "Develop green infrastructure program for urban flooding mitigation"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Atlanta's urban heat island adds 10-15°F to summer temperatures. Days above 95°F projected to double by 2050. Low-income communities in south Atlanta face highest exposure.", projectedImpact: "50+ days above 95°F by 2050, significant health impacts", adaptationMeasures: "Tree canopy protection, cool surfaces, heat action plans" },
      { hazard: "Severe Storms & Tornadoes", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Atlanta experiences severe thunderstorms with damaging winds, large hail, and occasional tornadoes. The 2008 downtown tornado caused $250M in damage.", projectedImpact: "$500M-2B per major severe weather event in metro area", adaptationMeasures: "Enhanced building codes, tree risk management, emergency preparedness" },
      { hazard: "Drought & Water Supply", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Metro Atlanta depends on the Chattahoochee River and Lake Lanier. 'Water Wars' with Alabama and Florida continue while population growth increases demand.", projectedImpact: "Water demand may exceed supply by 15-25% by 2050", adaptationMeasures: "Water recycling, conservation programs, regional water planning" },
      { hazard: "Flooding", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Rapid development increases impervious surfaces. Peachtree Creek and other urban waterways flood during intense rainfall, affecting homes and infrastructure.", projectedImpact: "$200-500M in annual urban flood damage, increasing with development", adaptationMeasures: "Green infrastructure, stream restoration, development standards" },
      { hazard: "Air Quality", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Atlanta's car-dependent sprawl contributes to ozone problems. Rising temperatures worsen ground-level ozone formation during summer months.", projectedImpact: "30+ ozone exceedance days annually, respiratory health costs", adaptationMeasures: "Transit expansion, vehicle electrification, emission controls" }
    ],
    transitionRisks: [
      { category: "Market", risk: "Corporate Climate Expectations", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Atlanta HQ companies (Coca-Cola, Delta, UPS, Home Depot) face investor pressure on climate. Municipal climate action affects corporate location decisions.", financialImplication: "$1-5B in economic activity tied to corporate climate positioning", mitigationStrategy: "Municipal climate leadership, clean energy procurement, sustainability branding" },
      { category: "Infrastructure", risk: "Urban Sprawl Energy Costs", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Atlanta's car-dependent development pattern creates high per-capita emissions and energy costs. Retrofitting sprawl for efficiency is expensive.", financialImplication: "$2-5B in transportation and building energy costs above denser peer cities", mitigationStrategy: "Transit-oriented development, mixed-use zoning, MARTA expansion" },
      { category: "Policy & Legal", risk: "State Climate Policy Resistance", severity: 2, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Georgia's state government has limited climate policy ambition. Atlanta must navigate municipal action within state-level political constraints.", financialImplication: "Limited state funding support, $200-500M in costs borne locally", mitigationStrategy: "Federal funding pursuit, private sector partnerships, peer city coalitions" },
      { category: "Technology", risk: "Building Stock Modernization", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Atlanta's commercial real estate market must modernize aging building stock for energy efficiency. Tenant expectations for green buildings are rising.", financialImplication: "$2-5B in commercial building retrofit investment needed", mitigationStrategy: "PACE financing, commercial benchmarking, green lease provisions" },
      { category: "Workforce", risk: "Climate-Ready Workforce Development", severity: 2, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Atlanta's growing clean energy and sustainability sectors need trained workers. HBCUs and technical colleges can fill this gap with targeted programs.", financialImplication: "$100-300M in workforce development investment opportunity", mitigationStrategy: "HBCU partnerships, apprenticeship programs, clean energy job training" }
    ]
  },
  {
    cityName: "Raleigh",
    state: "North Carolina",
    population: "475,000",
    region: "Southeast / Piedmont",
    climateZone: "Humid subtropical",
    overallPhysicalScore: 3.0,
    overallTransitionScore: 2.4,
    keyFindings: "Raleigh faces moderate but increasing climate risks with extreme heat and severe storms as primary concerns. The city's rapid growth in the Research Triangle creates both infrastructure stress and innovation opportunities. Inland location provides some buffer from coastal hazards but flooding is a growing concern.",
    recommendations: [
      "Strengthen stormwater management as development accelerates",
      "Leverage Research Triangle innovation ecosystem for climate solutions",
      "Expand tree canopy requirements in new development areas",
      "Develop regional climate resilience partnership with Durham and Chapel Hill",
      "Pursue smart growth policies to reduce sprawl-related emissions"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Raleigh is warming faster than the national average. Days above 95°F projected to increase significantly, stressing power grid and outdoor workers.", projectedImpact: "40+ days above 95°F by 2050, up from 10 historically", adaptationMeasures: "Urban forestry, cool roofs, heat emergency planning" },
      { hazard: "Severe Storms", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Severe thunderstorms, damaging winds, and occasional tornadoes affect the Triangle. April 2011 tornado outbreak caused significant damage.", projectedImpact: "$200M-1B per major severe weather event", adaptationMeasures: "Building code strengthening, tree management, warning systems" },
      { hazard: "Hurricane Remnants & Flooding", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "While inland, Raleigh receives heavy rainfall from hurricane remnants. Hurricane Matthew (2016) and Florence (2018) caused severe flooding in the Neuse River basin.", projectedImpact: "$100-500M per major flooding event from hurricane remnants", adaptationMeasures: "Floodplain management, stream restoration, stormwater capacity" },
      { hazard: "Drought", severity: 2, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Falls Lake reservoir occasionally reaches low levels during drought. Growing population increases demand on limited water supply sources.", projectedImpact: "Water restrictions during drought years, economic impact $50-100M", adaptationMeasures: "Water conservation programs, supply diversification, reclaimed water" },
      { hazard: "Ice Storms", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Raleigh is vulnerable to ice storms that can paralyze the region for days. Tree damage and power outages affect hundreds of thousands.", projectedImpact: "$100-500M per major ice storm, multi-day power outages", adaptationMeasures: "Grid hardening, vegetation management, emergency preparedness" }
    ],
    transitionRisks: [
      { category: "Technology", risk: "Clean Tech Innovation Opportunity", severity: 1, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Research Triangle's universities and tech sector create climate innovation opportunities. Companies seeking climate talent may relocate to the area.", financialImplication: "$1-5B in clean tech economic development opportunity", mitigationStrategy: "Clean tech incubators, university partnerships, talent recruitment" },
      { category: "Infrastructure", risk: "Rapid Growth Infrastructure Strain", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Raleigh is among the fastest-growing US cities. Ensuring new infrastructure is climate-resilient adds cost but prevents future retrofit expenses.", financialImplication: "$1-3B in climate-resilient infrastructure premium over 15 years", mitigationStrategy: "Climate-forward building codes, smart growth planning, infrastructure bonds" },
      { category: "Policy & Legal", risk: "NC Clean Energy Standards", severity: 2, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "North Carolina's HB 951 requires 70% carbon reduction by 2030 for utilities. Municipal compliance costs are moderate but growing.", financialImplication: "$200-500M in clean energy transition costs", mitigationStrategy: "Duke Energy clean energy procurement, municipal solar, efficiency programs" },
      { category: "Market", risk: "Corporate Sustainability Demands", severity: 2, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Triangle companies (Cisco, IBM, Red Hat) require sustainability in operations. Municipal climate action supports economic development competitiveness.", financialImplication: "$500M-2B in corporate investment tied to sustainability positioning", mitigationStrategy: "Municipal sustainability leadership, green building standards" },
      { category: "Workforce", risk: "Climate-Resilient Workforce", severity: 2, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Growing need for climate adaptation and clean energy workers. NC State, Duke, and UNC create natural workforce pipeline.", financialImplication: "$100-300M in workforce development opportunity", mitigationStrategy: "University partnerships, community college programs, apprenticeships" }
    ]
  },
  {
    cityName: "Washington",
    state: "District of Columbia",
    population: "690,000",
    region: "Mid-Atlantic",
    climateZone: "Humid subtropical",
    overallPhysicalScore: 3.4,
    overallTransitionScore: 3.0,
    keyFindings: "Washington DC faces increasing extreme heat, Potomac River flooding, and intense precipitation events. As the federal capital, the city has unique opportunities to leverage federal climate investments. The Clean Energy DC Act creates aggressive local mandates for building decarbonization.",
    recommendations: [
      "Accelerate Clean Energy DC building performance standards implementation",
      "Invest in Anacostia River and Rock Creek flood mitigation",
      "Expand tree canopy in Wards 7 and 8 for heat equity",
      "Leverage federal agency partnerships for climate resilience",
      "Develop regional climate adaptation plan with Maryland and Virginia"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "DC's humid heat creates dangerous heat index values exceeding 110°F. Urban heat island intensifies conditions in low-income neighborhoods east of the Anacostia River.", projectedImpact: "40+ dangerous heat days by 2050, disproportionate impact in Wards 7-8", adaptationMeasures: "Tree canopy equity, cool roofs, cooling centers, heat emergency protocol" },
      { hazard: "Flooding", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Intense rainfall overwhelms DC's aging combined sewer system. Potomac River flooding threatens Georgetown, the National Mall, and federal buildings.", projectedImpact: "25% increase in extreme precipitation, $500M-2B flood damage potential", adaptationMeasures: "Green infrastructure, CSO tunnel, floodwall improvements" },
      { hazard: "Severe Storms", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Derecho events and severe thunderstorms cause significant tree damage and power outages. DC's extensive tree canopy creates both benefits and wind damage risk.", projectedImpact: "$200-800M per major storm event, extended power outages", adaptationMeasures: "Grid resilience, tree risk management, underground utilities" },
      { hazard: "Sea Level Rise (Tidal Potomac)", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "The tidal Potomac is rising. Cherry Blossom area, Hains Point, and Reagan National Airport face increasing tidal flood exposure.", projectedImpact: "1-2 feet of Potomac rise by 2050 affecting waterfront areas", adaptationMeasures: "Waterfront resilience design, building elevation, living shorelines" },
      { hazard: "Hurricanes & Tropical Storms", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "While not a direct coastal target, DC receives significant rainfall and wind from tropical systems tracking up the East Coast.", projectedImpact: "Major tropical system could cause $1-5B in metro area damage", adaptationMeasures: "Emergency preparedness, flood-proofing, backup power for critical facilities" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "Clean Energy DC Compliance", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "The Clean Energy DC Act requires 100% renewable electricity by 2032 and carbon neutrality by 2050. Building Energy Performance Standards affect large buildings.", financialImplication: "$2-5B in building retrofit and clean energy transition costs", mitigationStrategy: "PACE financing, green bank programs, utility partnership" },
      { category: "Infrastructure", risk: "Federal Building Modernization", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "GSA must modernize federal buildings for climate resilience and energy efficiency. Federal spending creates economic opportunity but construction disruption.", financialImplication: "$5-15B in federal building modernization in DC metro area", mitigationStrategy: "Workforce development, traffic management during construction" },
      { category: "Market", risk: "Office Market Transition", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Post-pandemic office market combined with building performance standards creates challenges for commercial property. Green buildings command premium rents.", financialImplication: "$5-15B in potential commercial property value shifts", mitigationStrategy: "Building modernization incentives, adaptive reuse programs" },
      { category: "Technology", risk: "District Energy Expansion", severity: 2, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "DC's density supports district energy systems for efficient heating and cooling. Capitol Hill and downtown areas are candidates for geothermal networks.", financialImplication: "$500M-1.5B in district energy infrastructure investment", mitigationStrategy: "Pilot projects, public-private partnerships, federal co-investment" },
      { category: "Workforce", risk: "Green Building Workforce Demand", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Building performance standards create massive demand for skilled retrofit workers. DC's workforce development system must scale rapidly.", financialImplication: "$200-500M in workforce training investment needed", mitigationStrategy: "Pre-apprenticeship programs, community college partnerships, DOL grants" }
    ]
  },
  {
    cityName: "Seattle",
    state: "Washington",
    population: "740,000",
    region: "Pacific Northwest",
    climateZone: "Oceanic / Marine West Coast",
    overallPhysicalScore: 3.1,
    overallTransitionScore: 2.8,
    keyFindings: "Seattle's traditionally mild climate is becoming more volatile with extreme heat events, wildfire smoke, and changing precipitation patterns. The 2021 heat dome (108°F) shattered records and caused hundreds of deaths regionally. The city's tech economy drives aggressive climate policy but also rapid growth challenges.",
    recommendations: [
      "Mandate air conditioning or mechanical cooling in all residential buildings",
      "Expand wildfire smoke response capacity and clean air shelters",
      "Invest in aging stormwater infrastructure for changing precipitation",
      "Accelerate building electrification leveraging clean hydro grid",
      "Develop regional heat emergency response system with King County"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat Events", severity: 4, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "The 2021 heat dome reached 108°F in Seattle, shattering all records. Most buildings lack AC. Climate change makes such events 150x more likely.", projectedImpact: "Heat dome events every 5-10 years instead of once per millennium", adaptationMeasures: "Mandatory cooling capacity, heat emergency response, shade infrastructure" },
      { hazard: "Wildfire Smoke", severity: 4, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Smoke from eastern Washington, Oregon, and BC wildfires regularly blankets Seattle with hazardous air quality for weeks. 2020 was worst on record.", projectedImpact: "30-50 unhealthy air quality days per year by 2040", adaptationMeasures: "Clean air shelters, building filtration standards, outdoor activity restrictions" },
      { hazard: "Landslides", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Seattle's steep terrain and clay soils create landslide risk during heavy rain events. Climate change is altering precipitation patterns to include more intense events.", projectedImpact: "Increasing landslide events affecting homes and infrastructure", adaptationMeasures: "Slope stabilization, development restrictions, monitoring systems" },
      { hazard: "Flooding", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Atmospheric rivers and intense rainfall events overwhelm aging stormwater systems. Duwamish River industrial corridor and low-lying neighborhoods face flood risk.", projectedImpact: "15-20% increase in extreme precipitation events by 2050", adaptationMeasures: "Green infrastructure, stormwater upgrades, floodplain management" },
      { hazard: "Sea Level Rise", severity: 2, likelihood: 4, timeframe: "Long-term (2050-2100)", description: "Puget Sound sea level rise is partially offset by tectonic uplift but still affects low-lying waterfront areas, industrial zones, and port infrastructure.", projectedImpact: "6-24 inches of net sea level rise by 2100 in Puget Sound", adaptationMeasures: "Waterfront resilience planning, port adaptation, living shorelines" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "Washington Clean Buildings Act", severity: 3, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "WA Clean Buildings Act requires large commercial buildings to meet energy performance standards. Seattle's own policies add additional requirements.", financialImplication: "$1-3B in building energy improvement costs across commercial stock", mitigationStrategy: "Incentive programs, technical assistance, phased compliance" },
      { category: "Technology", risk: "Clean Grid Advantage", severity: 1, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Seattle City Light's 90%+ hydroelectric grid makes electrification highly effective for emissions reduction. This creates competitive advantage for building decarbonization.", financialImplication: "Lower per-building decarbonization cost vs. fossil-heavy grids", mitigationStrategy: "Accelerated electrification leveraging clean grid, EV charging expansion" },
      { category: "Market", risk: "Tech Sector Climate Commitments", severity: 2, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Amazon, Microsoft, and other Seattle tech giants have aggressive climate pledges affecting real estate, transportation, and supply chain decisions.", financialImplication: "$2-8B in corporate climate investment in Seattle metro area", mitigationStrategy: "Public-private climate partnerships, shared infrastructure investment" },
      { category: "Infrastructure", risk: "Transportation System Evolution", severity: 3, likelihood: 4, timeframe: "Medium-term (2035-2050)", description: "Sound Transit expansion and fleet electrification require significant investment. Climate events increasingly disrupt I-5 corridor and ferry service.", financialImplication: "$3-8B in climate-resilient transportation investment", mitigationStrategy: "Multi-modal planning, resilient design standards, federal funding" },
      { category: "Workforce", risk: "Climate Tech Talent Pipeline", severity: 2, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Seattle's tech ecosystem creates opportunities for climate tech innovation. UW and regional colleges supply workforce but competition for talent is intense.", financialImplication: "$500M-2B in climate tech sector growth opportunity", mitigationStrategy: "Climate tech accelerators, university partnerships, talent programs" }
    ]
  },
  {
    cityName: "Baltimore",
    state: "Maryland",
    population: "575,000",
    region: "Mid-Atlantic",
    climateZone: "Humid subtropical",
    overallPhysicalScore: 3.5,
    overallTransitionScore: 2.9,
    keyFindings: "Baltimore faces significant extreme heat, coastal flooding, and aging infrastructure challenges compounded by socioeconomic disparities. The Inner Harbor and Fells Point are vulnerable to sea level rise. Environmental justice communities in East and West Baltimore face disproportionate heat and air quality burdens.",
    recommendations: [
      "Implement equitable urban heat mitigation in underserved neighborhoods",
      "Develop Inner Harbor and Fells Point flood resilience master plan",
      "Upgrade aging water and sewer infrastructure for climate resilience",
      "Create green job pathways for building retrofit workforce",
      "Pursue federal environmental justice funding for climate adaptation"
    ],
    physicalRisks: [
      { hazard: "Extreme Heat", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Baltimore's urban heat island creates dangerous temperatures in low-income communities. Areas without tree canopy can be 10-15°F hotter than leafy neighborhoods.", projectedImpact: "40+ days above 95°F by 2050, heat deaths concentrated in EJ communities", adaptationMeasures: "Tree planting equity, cool roofs, heat emergency response, cooling centers" },
      { hazard: "Coastal & Tidal Flooding", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Inner Harbor, Fells Point, and Canton face increasing tidal flooding. The Chesapeake Bay is experiencing some of the highest sea level rise rates on the East Coast.", projectedImpact: "2+ feet of sea level rise by 2050, $5-15B in waterfront assets at risk", adaptationMeasures: "Seawall upgrades, flood barriers, waterfront resilience design" },
      { hazard: "Intense Precipitation", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "The 2016 Ellicott City floods demonstrated catastrophic flash flood potential in the region. Baltimore's aging stormwater system is frequently overwhelmed.", projectedImpact: "20-30% increase in extreme rainfall, $200-800M in flood damage per event", adaptationMeasures: "Green infrastructure, stormwater upgrades, flood-proofing" },
      { hazard: "Air Quality", severity: 3, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Baltimore has some of the worst asthma rates in the US. Heat-amplified ozone and industrial emissions from the port and industrial corridor compound health impacts.", projectedImpact: "30+ ozone exceedance days, $500M+ in health costs annually", adaptationMeasures: "Industrial emission controls, fleet electrification, health monitoring" },
      { hazard: "Severe Storms", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Severe thunderstorms and tropical storm remnants cause wind damage and urban flooding. Aging building stock and tree canopy create additional vulnerability.", projectedImpact: "$200-500M per major storm event", adaptationMeasures: "Building code enforcement, tree management, emergency preparedness" }
    ],
    transitionRisks: [
      { category: "Policy & Legal", risk: "Maryland Climate Solutions Now Act", severity: 3, likelihood: 5, timeframe: "Near-term (2025-2035)", description: "Maryland's Climate Solutions Now Act requires 60% GHG reduction by 2031 and net-zero by 2045. Building performance standards affect large buildings.", financialImplication: "$1-3B in building and infrastructure compliance costs", mitigationStrategy: "State incentive programs, EmPOWER Maryland rebates, PACE financing" },
      { category: "Infrastructure", risk: "Aging Water/Sewer System", severity: 4, likelihood: 4, timeframe: "Near-term (2025-2035)", description: "Baltimore's century-old water and sewer system requires billions in upgrades. Climate change intensifies demands through both flooding and drought cycles.", financialImplication: "$3-8B in water/sewer infrastructure investment under federal consent decree", mitigationStrategy: "Rate increases, federal funding, green infrastructure offsets" },
      { category: "Market", risk: "Port of Baltimore Adaptation", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "The Port of Baltimore, a major economic engine, faces sea level rise and storm disruption risks. Adaptation is essential for economic competitiveness.", financialImplication: "$1-3B in port resilience investment", mitigationStrategy: "Elevated infrastructure, flood barriers, operations continuity planning" },
      { category: "Workforce", risk: "Environmental Justice Workforce", severity: 3, likelihood: 3, timeframe: "Near-term (2025-2035)", description: "Climate transition creates opportunity for green jobs in historically disinvested communities. Building retrofits, clean energy, and resilience work can address inequity.", financialImplication: "$200-500M in workforce development investment opportunity", mitigationStrategy: "Local hiring requirements, pre-apprenticeship programs, community partnerships" },
      { category: "Technology", risk: "Building Electrification in Older Stock", severity: 3, likelihood: 3, timeframe: "Medium-term (2035-2050)", description: "Baltimore's aging rowhouse stock presents unique challenges for heat pump adoption and building envelope improvements. Panel upgrades often required.", financialImplication: "$2-5B in residential building modernization costs", mitigationStrategy: "Targeted incentives for rowhouses, bulk procurement, contractor training" }
    ]
  }
];

function getScoreColor(score: number): string {
  if (score >= 4.5) return "text-red-600";
  if (score >= 3.5) return "text-orange-600";
  if (score >= 2.5) return "text-yellow-600";
  return "text-green-600";
}

function getScoreBg(score: number): string {
  if (score >= 4.5) return "bg-red-100 text-red-800";
  if (score >= 3.5) return "bg-orange-100 text-orange-800";
  if (score >= 2.5) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

function getScoreLabel(score: number): string {
  if (score >= 4.5) return "Critical";
  if (score >= 3.5) return "High";
  if (score >= 2.5) return "Moderate";
  if (score >= 1.5) return "Low";
  return "Minimal";
}

function getBarColor(score: number): string {
  if (score >= 4.5) return "bg-red-500";
  if (score >= 3.5) return "bg-orange-500";
  if (score >= 2.5) return "bg-yellow-500";
  return "bg-green-500";
}

function getHazardIcon(hazard: string) {
  const h = hazard.toLowerCase();
  if (h.includes("heat")) return <Thermometer className="w-4 h-4" />;
  if (h.includes("flood") || h.includes("rain") || h.includes("precipitation")) return <CloudRain className="w-4 h-4" />;
  if (h.includes("drought") || h.includes("water")) return <Droplets className="w-4 h-4" />;
  if (h.includes("fire") || h.includes("wildfire")) return <Flame className="w-4 h-4" />;
  if (h.includes("wind") || h.includes("storm") || h.includes("tornado") || h.includes("hurricane") || h.includes("nor'easter") || h.includes("ice")) return <Wind className="w-4 h-4" />;
  if (h.includes("sea level") || h.includes("tidal") || h.includes("coastal") || h.includes("coral")) return <Waves className="w-4 h-4" />;
  if (h.includes("air") || h.includes("smoke") || h.includes("dust")) return <Sun className="w-4 h-4" />;
  if (h.includes("landslide")) return <AlertTriangle className="w-4 h-4" />;
  if (h.includes("hail")) return <CloudRain className="w-4 h-4" />;
  return <AlertTriangle className="w-4 h-4" />;
}

function getCategoryIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes("policy") || c.includes("legal")) return <Scale className="w-4 h-4" />;
  if (c.includes("technology")) return <Zap className="w-4 h-4" />;
  if (c.includes("market")) return <TrendingUp className="w-4 h-4" />;
  if (c.includes("reputation")) return <Shield className="w-4 h-4" />;
  if (c.includes("workforce")) return <Users className="w-4 h-4" />;
  if (c.includes("infrastructure")) return <Wrench className="w-4 h-4" />;
  return <Building2 className="w-4 h-4" />;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = (score / 5) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${getScoreColor(score)}`}>{score.toFixed(1)}/5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${getBarColor(score)} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PhysicalRiskCard({ risk }: { risk: PhysicalRisk }) {
  const [expanded, setExpanded] = useState(false);
  const riskScore = ((risk.severity + risk.likelihood) / 2);

  return (
    <Card className="border-l-4" style={{ borderLeftColor: riskScore >= 4 ? '#ef4444' : riskScore >= 3 ? '#f97316' : riskScore >= 2 ? '#eab308' : '#22c55e' }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getHazardIcon(risk.hazard)}
              <span className="font-semibold text-gray-900">{risk.hazard}</span>
              <Badge className={getScoreBg(riskScore)}>{riskScore.toFixed(1)}</Badge>
              <Badge variant="outline" className="text-xs">{risk.timeframe}</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        {expanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            <div className="grid grid-cols-2 gap-4">
              <ScoreBar label="Severity" score={risk.severity} />
              <ScoreBar label="Likelihood" score={risk.likelihood} />
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-red-800 mb-1">Projected Impact</p>
              <p className="text-sm text-red-700">{risk.projectedImpact}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 mb-1">Adaptation Measures</p>
              <p className="text-sm text-blue-700">{risk.adaptationMeasures}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TransitionRiskCard({ risk }: { risk: TransitionRisk }) {
  const [expanded, setExpanded] = useState(false);
  const riskScore = ((risk.severity + risk.likelihood) / 2);

  return (
    <Card className="border-l-4" style={{ borderLeftColor: riskScore >= 4 ? '#ef4444' : riskScore >= 3 ? '#f97316' : riskScore >= 2 ? '#eab308' : '#22c55e' }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {getCategoryIcon(risk.category)}
              <span className="font-semibold text-gray-900">{risk.risk}</span>
              <Badge className={getScoreBg(riskScore)}>{riskScore.toFixed(1)}</Badge>
              <Badge variant="outline" className="text-xs">{risk.category}</Badge>
              <Badge variant="outline" className="text-xs">{risk.timeframe}</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        {expanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            <div className="grid grid-cols-2 gap-4">
              <ScoreBar label="Severity" score={risk.severity} />
              <ScoreBar label="Likelihood" score={risk.likelihood} />
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-amber-800 mb-1">Financial Implication</p>
              <p className="text-sm text-amber-700">{risk.financialImplication}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-green-800 mb-1">Mitigation Strategy</p>
              <p className="text-sm text-green-700">{risk.mitigationStrategy}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CityAssessmentView({ city }: { city: MunicipalAssessment }) {
  const [activeTab, setActiveTab] = useState("overview");
  const combinedScore = ((city.overallPhysicalScore + city.overallTransitionScore) / 2);

  const handleExport = () => {
    let csv = "Category,Item,Severity,Likelihood,Score,Timeframe,Description\n";
    city.physicalRisks.forEach(r => {
      csv += `Physical Risk,"${r.hazard}",${r.severity},${r.likelihood},${((r.severity + r.likelihood) / 2).toFixed(1)},"${r.timeframe}","${r.description.replace(/"/g, '""')}"\n`;
    });
    city.transitionRisks.forEach(r => {
      csv += `Transition Risk - ${r.category},"${r.risk}",${r.severity},${r.likelihood},${((r.severity + r.likelihood) / 2).toFixed(1)},"${r.timeframe}","${r.description.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${city.cityName}_climate_risk_assessment.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">{city.cityName}, {city.state}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">{city.region} | {city.climateZone} | Pop. {city.population}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Physical Risk</p>
            <p className={`text-3xl font-bold ${getScoreColor(city.overallPhysicalScore)}`}>{city.overallPhysicalScore.toFixed(1)}</p>
            <Badge className={getScoreBg(city.overallPhysicalScore)}>{getScoreLabel(city.overallPhysicalScore)}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Transition Risk</p>
            <p className={`text-3xl font-bold ${getScoreColor(city.overallTransitionScore)}`}>{city.overallTransitionScore.toFixed(1)}</p>
            <Badge className={getScoreBg(city.overallTransitionScore)}>{getScoreLabel(city.overallTransitionScore)}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Combined Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(combinedScore)}`}>{combinedScore.toFixed(1)}</p>
            <Badge className={getScoreBg(combinedScore)}>{getScoreLabel(combinedScore)}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Key Findings</p>
              <p className="text-sm text-blue-800">{city.keyFindings}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="physical">Physical Risks ({city.physicalRisks.length})</TabsTrigger>
          <TabsTrigger value="transition">Transition Risks ({city.transitionRisks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Top Physical Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {city.physicalRisks
                  .sort((a, b) => ((b.severity + b.likelihood) / 2) - ((a.severity + a.likelihood) / 2))
                  .slice(0, 3)
                  .map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getHazardIcon(r.hazard)}
                        <span className="text-sm font-medium">{r.hazard}</span>
                      </div>
                      <Badge className={getScoreBg((r.severity + r.likelihood) / 2)}>
                        {((r.severity + r.likelihood) / 2).toFixed(1)}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Top Transition Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {city.transitionRisks
                  .sort((a, b) => ((b.severity + b.likelihood) / 2) - ((a.severity + a.likelihood) / 2))
                  .slice(0, 3)
                  .map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(r.category)}
                        <span className="text-sm font-medium truncate max-w-[200px]">{r.risk}</span>
                      </div>
                      <Badge className={getScoreBg((r.severity + r.likelihood) / 2)}>
                        {((r.severity + r.likelihood) / 2).toFixed(1)}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {city.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical" className="space-y-3 mt-4">
          {city.physicalRisks
            .sort((a, b) => ((b.severity + b.likelihood) / 2) - ((a.severity + a.likelihood) / 2))
            .map((risk, i) => (
              <PhysicalRiskCard key={i} risk={risk} />
            ))}
        </TabsContent>

        <TabsContent value="transition" className="space-y-3 mt-4">
          {city.transitionRisks
            .sort((a, b) => ((b.severity + b.likelihood) / 2) - ((a.severity + a.likelihood) / 2))
            .map((risk, i) => (
              <TransitionRiskCard key={i} risk={risk} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function MunicipalRiskPage() {
  const [cities, setCities] = useState<MunicipalAssessment[]>(EXAMPLE_CITIES);
  const [selectedCity, setSelectedCity] = useState<string>(EXAMPLE_CITIES[0].cityName);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (cityName: string) => {
      const response = await fetch("/api/municipal-risk/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Analysis failed");
      }
      return response.json() as Promise<MunicipalAssessment>;
    },
    onSuccess: (data) => {
      setCities(prev => [...prev, data]);
      setSelectedCity(data.cityName);
      setAddDialogOpen(false);
      setNewCityName("");
      toast({ title: "City Added", description: `Climate risk assessment for ${data.cityName} has been generated.` });
    },
    onError: (error: Error) => {
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    },
  });

  const selectedCityData = cities.find(c => c.cityName === selectedCity);

  const sortedCities = [...cities].sort((a, b) => {
    const scoreA = (a.overallPhysicalScore + a.overallTransitionScore) / 2;
    const scoreB = (b.overallPhysicalScore + b.overallTransitionScore) / 2;
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold text-gray-900">Municipal Climate Risk Assessment</h1>
              </div>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add City
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add City - AI-Powered Risk Assessment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-gray-600">
                    Enter any city name to generate a comprehensive climate risk assessment covering physical hazards and transition risks.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City Name</label>
                    <Input
                      placeholder="e.g., Phoenix, Portland, Houston..."
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCityName.trim()) {
                          analyzeMutation.mutate(newCityName.trim());
                        }
                      }}
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={!newCityName.trim() || analyzeMutation.isPending}
                    onClick={() => analyzeMutation.mutate(newCityName.trim())}
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Climate Risks...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Assessment
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600 max-w-3xl">
            Comprehensive climate risk assessments for US municipalities covering physical hazards (extreme heat, flooding, wildfire, sea level rise) 
            and transition risks (policy, technology, market, workforce, infrastructure). Each city is scored on a 1-5 scale for both physical and transition risk exposure.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {sortedCities.map(city => {
            const combined = (city.overallPhysicalScore + city.overallTransitionScore) / 2;
            return (
              <button
                key={city.cityName}
                onClick={() => setSelectedCity(city.cityName)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedCity === city.cityName
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <p className="font-medium text-sm truncate">{city.cityName}</p>
                <p className="text-xs text-gray-500">{city.state}</p>
                <div className="mt-1">
                  <Badge className={`${getScoreBg(combined)} text-xs`}>{combined.toFixed(1)}</Badge>
                </div>
              </button>
            );
          })}
        </div>

        {selectedCityData && <CityAssessmentView city={selectedCityData} />}
      </div>
    </div>
  );
}
