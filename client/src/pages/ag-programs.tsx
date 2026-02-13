import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowLeft, Search, MapPin, Leaf, DollarSign, Sprout, Droplets, TreePine, Building2, Globe, X, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface Program {
  name: string;
  level: "Federal" | "State" | "Local";
  agency: string;
  description: string;
  eligibility: string;
  funding: string;
  category: string;
  url?: string;
}

interface StatePrograms {
  [stateCode: string]: Program[];
}

const FEDERAL_PROGRAMS: Program[] = [
  {
    name: "Environmental Quality Incentives Program (EQIP)",
    level: "Federal",
    agency: "USDA NRCS",
    description: "Provides financial and technical assistance to agricultural producers to address natural resource concerns and deliver environmental benefits.",
    eligibility: "Agricultural producers, including farmers, ranchers, and forest landowners",
    funding: "Cost-share payments up to 75% of practice costs; up to 90% for historically underserved producers",
    category: "Conservation",
    url: "https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives"
  },
  {
    name: "Conservation Reserve Program (CRP)",
    level: "Federal",
    agency: "USDA FSA",
    description: "Pays annual rental payments to farmers who remove environmentally sensitive land from agricultural production and plant species that improve environmental health.",
    eligibility: "Landowners and operators with eligible cropland",
    funding: "Annual rental payments based on soil rental rates; cost-share up to 50% for cover establishment",
    category: "Land Conservation",
    url: "https://www.fsa.usda.gov/programs-and-services/conservation-programs/conservation-reserve-program/"
  },
  {
    name: "Conservation Stewardship Program (CSP)",
    level: "Federal",
    agency: "USDA NRCS",
    description: "Helps agricultural producers maintain and improve existing conservation systems and adopt additional conservation activities.",
    eligibility: "Agricultural producers actively managing land with existing conservation practices",
    funding: "Annual payments for conservation performance; supplemental payments for adopting new practices",
    category: "Stewardship",
    url: "https://www.nrcs.usda.gov/programs-initiatives/csp-conservation-stewardship-program"
  },
  {
    name: "Agricultural Conservation Easement Program (ACEP)",
    level: "Federal",
    agency: "USDA NRCS",
    description: "Protects agricultural lands and wetlands through conservation easements. Includes Agricultural Land Easements (ALE) and Wetland Reserve Easements (WRE).",
    eligibility: "Eligible landowners and entities; land must meet specific criteria for agricultural or wetland value",
    funding: "Up to 50% of fair market value for ALE; 75-100% of easement value for WRE",
    category: "Easements",
    url: "https://www.nrcs.usda.gov/programs-initiatives/acep-agricultural-conservation-easement-program"
  },
  {
    name: "Regional Conservation Partnership Program (RCPP)",
    level: "Federal",
    agency: "USDA NRCS",
    description: "Promotes coordination of conservation activities at regional or landscape scale by partnering with eligible entities to deliver conservation assistance.",
    eligibility: "Agricultural producers in partnership with eligible entities (states, tribes, NGOs, etc.)",
    funding: "Varies by project; leverages partner contributions",
    category: "Partnership",
    url: "https://www.nrcs.usda.gov/programs-initiatives/rcpp-regional-conservation-partnership-program"
  },
  {
    name: "Rural Energy for America Program (REAP)",
    level: "Federal",
    agency: "USDA Rural Development",
    description: "Provides guaranteed loan financing and grant funding to agricultural producers and rural small businesses for renewable energy systems and energy efficiency improvements.",
    eligibility: "Agricultural producers and rural small businesses",
    funding: "Grants up to 50% of project costs (max $1M); loan guarantees up to 75% (max $25M)",
    category: "Energy",
    url: "https://www.rd.usda.gov/programs-services/energy-programs/rural-energy-america-program-renewable-energy-systems-energy-efficiency-improvement-guaranteed-loans"
  },
  {
    name: "Organic Certification Cost Share Program",
    level: "Federal",
    agency: "USDA FSA",
    description: "Provides cost share assistance to producers and handlers for the costs of obtaining or maintaining organic certification.",
    eligibility: "Certified organic operations",
    funding: "Up to 50% of certification costs, maximum $500 per scope of certification",
    category: "Organic",
    url: "https://www.fsa.usda.gov/programs-and-services/occsp/"
  },
  {
    name: "Conservation Innovation Grants (CIG)",
    level: "Federal",
    agency: "USDA NRCS",
    description: "Supports development and adoption of innovative conservation approaches and technologies on agricultural lands.",
    eligibility: "Non-federal entities, tribes, individuals; must be used on private agricultural land",
    funding: "Competitive grants; varies by project",
    category: "Innovation",
    url: "https://www.nrcs.usda.gov/programs-initiatives/cig-conservation-innovation-grants"
  },
  {
    name: "Emergency Conservation Program (ECP)",
    level: "Federal",
    agency: "USDA FSA",
    description: "Provides emergency funding for farmers and ranchers to rehabilitate farmland damaged by natural disasters and to implement emergency water conservation measures.",
    eligibility: "Agricultural producers affected by natural disasters",
    funding: "Cost-share up to 75% of eligible costs",
    category: "Emergency",
    url: "https://www.fsa.usda.gov/programs-and-services/conservation-programs/emergency-conservation/"
  },
  {
    name: "Partnerships for Climate-Smart Commodities",
    level: "Federal",
    agency: "USDA",
    description: "Supports pilot projects to develop markets for climate-smart commodities and expand adoption of climate-smart production practices.",
    eligibility: "Agricultural producers through eligible partner organizations",
    funding: "Up to $100M per project; total program funding $3.1B",
    category: "Climate",
    url: "https://www.usda.gov/climate-smart-commodities"
  },
  {
    name: "Transition Incentives Program (TIP)",
    level: "Federal",
    agency: "USDA FSA",
    description: "Provides incentive payments to retiring or retired CRP participants who transition land to beginning, veteran, or socially disadvantaged farmers/ranchers.",
    eligibility: "Retiring CRP participants transitioning to beginning/veteran/disadvantaged producers",
    funding: "Two additional annual CRP rental payments",
    category: "Beginning Farmers"
  },
  {
    name: "Biomass Crop Assistance Program (BCAP)",
    level: "Federal",
    agency: "USDA FSA",
    description: "Provides financial assistance to owners and operators of agricultural land and forest land for establishing, producing, and delivering biomass feedstocks.",
    eligibility: "Agricultural and forest landowners within designated project areas",
    funding: "Matching payments up to $20/dry ton for biomass delivery; establishment cost-share up to 50%",
    category: "Biomass"
  }
];

const STATE_PROGRAMS: StatePrograms = {
  "AL": [
    { name: "Alabama Agricultural Land Conservation Program", level: "State", agency: "Alabama DCNR", description: "Voluntary conservation easement program to protect working farmland and forestland.", eligibility: "Alabama agricultural landowners", funding: "Easement payments based on land value", category: "Land Conservation" },
    { name: "Alabama Soil and Water Conservation Program", level: "State", agency: "Alabama SWCC", description: "Cost-share assistance for implementing soil and water conservation practices.", eligibility: "Alabama farmers and landowners", funding: "Cost-share up to 75%", category: "Conservation" }
  ],
  "AK": [
    { name: "Alaska Agricultural Revolving Loan Fund", level: "State", agency: "Alaska DNRC", description: "Provides loans for agricultural development including land clearing, equipment, and infrastructure.", eligibility: "Alaska agricultural producers", funding: "Low-interest loans up to $1M", category: "Finance" }
  ],
  "AZ": [
    { name: "Arizona Water Conservation Grant Program", level: "State", agency: "Arizona ADWR", description: "Grants for agricultural water conservation and efficiency projects.", eligibility: "Arizona agricultural operations", funding: "Grants vary by project scope", category: "Water" },
    { name: "Arizona Specialty Crop Block Grant", level: "State", agency: "Arizona Dept of Agriculture", description: "Supports specialty crop competitiveness through marketing, research, and food safety.", eligibility: "Arizona specialty crop producers", funding: "Competitive grants", category: "Specialty Crops" }
  ],
  "AR": [
    { name: "Arkansas Nutrient Management Program", level: "State", agency: "Arkansas NRCS", description: "Assists producers with nutrient management plans to reduce water quality impacts.", eligibility: "Arkansas livestock and crop producers", funding: "Technical assistance and cost-share", category: "Water Quality" },
    { name: "Arkansas Agriculture Water Enhancement Program", level: "State", agency: "ANRC", description: "Cost-share for on-farm water storage and irrigation efficiency improvements.", eligibility: "Arkansas irrigated farms", funding: "Cost-share up to 50%", category: "Water" }
  ],
  "CA": [
    { name: "Healthy Soils Program", level: "State", agency: "CDFA", description: "Incentivizes implementation of conservation management practices that sequester carbon and reduce GHG emissions.", eligibility: "California farmers and ranchers", funding: "Grants up to $100,000 for 3-year practices", category: "Climate", url: "https://www.cdfa.ca.gov/oefi/healthysoils/" },
    { name: "State Water Efficiency and Enhancement Program (SWEEP)", level: "State", agency: "CDFA", description: "Provides financial assistance to implement irrigation systems that reduce GHG emissions and save water.", eligibility: "California agricultural operations", funding: "Grants up to $200,000", category: "Water", url: "https://www.cdfa.ca.gov/oefi/sweep/" },
    { name: "Alternative Manure Management Program (AMMP)", level: "State", agency: "CDFA", description: "Provides financial assistance for dairy and livestock operations to implement non-digester manure management practices.", eligibility: "California dairy and livestock operations", funding: "Grants up to $750,000", category: "Livestock" },
    { name: "Pollinator Habitat Program", level: "State", agency: "CDFA", description: "Supports creation and maintenance of pollinator habitat on farms.", eligibility: "California farms and ranches", funding: "Grants for habitat establishment", category: "Biodiversity" },
    { name: "California Farmland Conservancy Program", level: "State", agency: "CA DOC", description: "Provides grants to acquire agricultural conservation easements on farmland.", eligibility: "California farmland owners and land trusts", funding: "Easement acquisition grants", category: "Land Conservation" }
  ],
  "CO": [
    { name: "Colorado Soil Health Initiative", level: "State", agency: "Colorado Dept of Agriculture", description: "Promotes soil health practices through education, technical assistance, and demonstration projects.", eligibility: "Colorado agricultural producers", funding: "Technical assistance and demonstration funding", category: "Soil Health" },
    { name: "Colorado Water Plan Agricultural Programs", level: "State", agency: "CWCB", description: "Supports agricultural water conservation, efficiency, and alternative transfer methods.", eligibility: "Colorado irrigators and water districts", funding: "Grants and loans for water projects", category: "Water" },
    { name: "Colorado Agricultural Energy Efficiency Program", level: "State", agency: "CEO", description: "Assists agricultural operations with energy audits and efficiency improvements.", eligibility: "Colorado farms and ranches", funding: "Energy audits and rebates", category: "Energy" }
  ],
  "CT": [
    { name: "Connecticut Farmland Preservation Program", level: "State", agency: "CT DoAg", description: "Purchases development rights on prime farmland to protect it from non-agricultural use.", eligibility: "Connecticut farmland owners", funding: "Development rights purchase at fair market value", category: "Land Conservation" }
  ],
  "DE": [
    { name: "Delaware Conservation Cost Share Program", level: "State", agency: "Delaware DNREC", description: "Provides financial assistance for agricultural best management practices.", eligibility: "Delaware agricultural producers", funding: "Cost-share up to 87.5%", category: "Conservation" },
    { name: "Delaware Nutrient Management Program", level: "State", agency: "Delaware Dept of Agriculture", description: "Mandatory nutrient management for agricultural operations over 10 acres.", eligibility: "Delaware farms over 10 acres", funding: "Free nutrient management plans", category: "Water Quality" }
  ],
  "FL": [
    { name: "Florida Agricultural Best Management Practices Program", level: "State", agency: "FDACS", description: "Supports implementation of BMPs for water quality protection in agricultural operations.", eligibility: "Florida agricultural producers", funding: "Cost-share assistance varies", category: "Water Quality" },
    { name: "Florida Rural and Family Lands Protection Program", level: "State", agency: "FDACS", description: "Protects important agricultural lands through conservation easements.", eligibility: "Florida agricultural landowners", funding: "Conservation easement payments", category: "Land Conservation" }
  ],
  "GA": [
    { name: "Georgia Conservation Tax Credit Program", level: "State", agency: "Georgia DNR", description: "Provides state income tax credits for conservation easements on agricultural and natural lands.", eligibility: "Georgia landowners donating conservation easements", funding: "Tax credit up to 25% of FMV, max $250,000", category: "Tax Incentive" },
    { name: "Georgia Soil and Water Conservation Program", level: "State", agency: "Georgia SWCC", description: "Provides technical and financial assistance for soil and water conservation practices.", eligibility: "Georgia agricultural producers", funding: "Cost-share assistance", category: "Conservation" }
  ],
  "HI": [
    { name: "Hawaii Important Agricultural Lands Program", level: "State", agency: "Hawaii DOA", description: "Identifies and protects important agricultural lands through zoning and incentives.", eligibility: "Hawaii agricultural landowners in IAL zones", funding: "Tax incentives and infrastructure support", category: "Land Conservation" }
  ],
  "ID": [
    { name: "Idaho OnePlan", level: "State", agency: "Idaho SCC", description: "Integrated environmental planning tool for Idaho agricultural operations covering nutrient management, irrigation, and conservation.", eligibility: "Idaho agricultural producers", funding: "Free planning tool; connects to cost-share programs", category: "Planning" }
  ],
  "IL": [
    { name: "Illinois Cover Crop Premium Discount Program", level: "State", agency: "Illinois Dept of Agriculture", description: "Provides crop insurance premium discount to farmers who plant cover crops.", eligibility: "Illinois farmers planting cover crops", funding: "$5/acre crop insurance premium discount", category: "Soil Health" },
    { name: "Illinois Partners for Conservation", level: "State", agency: "Illinois NRCS", description: "Combines federal and state funds for targeted conservation in priority areas.", eligibility: "Illinois agricultural producers in priority watersheds", funding: "Enhanced cost-share rates", category: "Conservation" },
    { name: "Illinois Nutrient Loss Reduction Strategy", level: "State", agency: "Illinois EPA", description: "Voluntary framework for reducing nutrient losses from agricultural lands to improve water quality.", eligibility: "Illinois agricultural operations", funding: "Technical assistance and BMP cost-share", category: "Water Quality" }
  ],
  "IN": [
    { name: "Indiana Clean Water Indiana Program", level: "State", agency: "Indiana ISDA", description: "Provides cost-share for conservation practices that protect water quality on agricultural lands.", eligibility: "Indiana agricultural producers", funding: "Cost-share up to 80%", category: "Water Quality" },
    { name: "Indiana Cover Crop Program", level: "State", agency: "Indiana ISDA", description: "Financial incentive for planting cover crops on agricultural fields.", eligibility: "Indiana farmers", funding: "Up to $25/acre for first-time participants", category: "Soil Health" }
  ],
  "IA": [
    { name: "Iowa Water Quality Initiative", level: "State", agency: "Iowa IDALS", description: "Voluntary, science-based approach to reduce nutrient loads from agriculture through conservation practices.", eligibility: "Iowa agricultural producers", funding: "Cost-share for cover crops, bioreactors, wetlands, buffers", category: "Water Quality", url: "https://www.cleanwateriowa.org/" },
    { name: "Iowa Financial Incentive Program", level: "State", agency: "Iowa IDALS", description: "Provides financial incentives for permanent soil and water conservation practices.", eligibility: "Iowa landowners and operators", funding: "Cost-share up to 75%", category: "Conservation" },
    { name: "Iowa Conservation Reserve Enhancement Program (CREP)", level: "State", agency: "Iowa DNR", description: "Enhanced CRP with additional state incentives for targeted wetland and buffer installations.", eligibility: "Iowa landowners in priority areas", funding: "Enhanced federal payments plus state bonuses", category: "Wetlands" }
  ],
  "KS": [
    { name: "Kansas Water Transition Assistance Program", level: "State", agency: "Kansas DWR", description: "Encourages voluntary transition of water rights to reduce irrigation water use in over-appropriated areas.", eligibility: "Kansas water right holders in eligible areas", funding: "Payments for reducing water use", category: "Water" },
    { name: "Kansas Non-Point Source Pollution Control Program", level: "State", agency: "Kansas KDHE", description: "Provides grants and technical assistance for agricultural best management practices.", eligibility: "Kansas agricultural producers", funding: "BMP cost-share grants", category: "Water Quality" }
  ],
  "KY": [
    { name: "Kentucky Soil Erosion and Water Quality Cost Share Program", level: "State", agency: "Kentucky DOSC", description: "Cost-share for agricultural best management practices addressing soil erosion and water quality.", eligibility: "Kentucky agricultural producers", funding: "Cost-share up to 75%, max $30,000/year", category: "Conservation" },
    { name: "Kentucky Agricultural Development Fund", level: "State", agency: "KADF", description: "Invests tobacco settlement funds into diversification and development of Kentucky agriculture.", eligibility: "Kentucky agricultural producers and agribusinesses", funding: "Grants and cost-share for farm improvements", category: "Development" }
  ],
  "LA": [
    { name: "Louisiana Master Farmer Program", level: "State", agency: "LSU AgCenter", description: "Voluntary environmental stewardship certification program for Louisiana agricultural producers.", eligibility: "Louisiana farmers completing training", funding: "Certification and technical assistance", category: "Education" }
  ],
  "ME": [
    { name: "Maine Farmland Protection Program", level: "State", agency: "Maine DACF", description: "Purchases agricultural easements to protect farmland from development.", eligibility: "Maine farmland owners", funding: "Easement purchase payments", category: "Land Conservation" },
    { name: "Maine Agricultural Water Management Program", level: "State", agency: "Maine DACF", description: "Supports efficient water use in Maine agriculture through technical assistance and cost-share.", eligibility: "Maine agricultural operations", funding: "Cost-share for irrigation improvements", category: "Water" }
  ],
  "MD": [
    { name: "Maryland Agricultural Water Quality Cost-Share Program (MACS)", level: "State", agency: "Maryland MDA", description: "Provides cost-share for best management practices including cover crops, nutrient management, and animal waste systems.", eligibility: "Maryland agricultural producers", funding: "Cost-share up to 87.5%", category: "Water Quality", url: "https://mda.maryland.gov/resource_conservation/" },
    { name: "Maryland Cover Crop Program", level: "State", agency: "Maryland MDA", description: "One of the nation's largest state cover crop programs, providing incentives for fall-planted cover crops.", eligibility: "Maryland farmers", funding: "Up to $90/acre depending on species and planting date", category: "Soil Health" },
    { name: "Maryland Agricultural Land Preservation Foundation", level: "State", agency: "MALPF", description: "Purchases agricultural easements to preserve farmland and promote agricultural viability.", eligibility: "Maryland farmland owners in agricultural districts", funding: "Easement purchase based on development value", category: "Land Conservation" }
  ],
  "MA": [
    { name: "Massachusetts Agricultural Preservation Restriction Program", level: "State", agency: "MA MDAR", description: "Purchases development rights on farmland to protect prime agricultural land.", eligibility: "Massachusetts farmland owners", funding: "Development rights purchase", category: "Land Conservation" },
    { name: "Massachusetts Agricultural Environmental Enhancement Program", level: "State", agency: "MA MDAR", description: "Grants for environmental improvement projects on farms.", eligibility: "Massachusetts farms", funding: "Matching grants up to $25,000", category: "Conservation" }
  ],
  "MI": [
    { name: "Michigan Agriculture Environmental Assurance Program (MAEAP)", level: "State", agency: "Michigan MDARD", description: "Voluntary environmental assurance program helping farms evaluate environmental risks and prevent pollution.", eligibility: "Michigan farms", funding: "Free technical assistance; verified farms get liability protection", category: "Environmental Assurance", url: "https://www.michigan.gov/mdard/environment/maeap" },
    { name: "Michigan Farmland Preservation Program", level: "State", agency: "Michigan MDARD", description: "Tax credits and easements to protect agricultural lands.", eligibility: "Michigan farmland owners in eligible areas", funding: "Property tax credits and easement payments", category: "Land Conservation" }
  ],
  "MN": [
    { name: "Minnesota Agricultural Water Quality Certification Program (MAWQCP)", level: "State", agency: "Minnesota MDA", description: "Voluntary program certifying farms that protect water quality, providing regulatory certainty.", eligibility: "Minnesota agricultural producers", funding: "Regulatory certainty for 10 years; priority for state cost-share", category: "Water Quality", url: "https://www.mda.state.mn.us/environment-sustainability/minnesota-agricultural-water-quality-certification-program" },
    { name: "Minnesota Forever Green Initiative", level: "State", agency: "University of Minnesota", description: "Research and development of continuous living cover crops and perennial systems.", eligibility: "Minnesota producers adopting continuous cover practices", funding: "Research support and technical assistance", category: "Soil Health" },
    { name: "Minnesota Agricultural BMP Loan Program", level: "State", agency: "Minnesota MDA", description: "Low-interest loans for agricultural best management practices.", eligibility: "Minnesota agricultural producers", funding: "Low-interest loans up to $200,000", category: "Finance" }
  ],
  "MS": [
    { name: "Mississippi Soil and Water Conservation Program", level: "State", agency: "Mississippi SWCC", description: "Provides cost-share for agricultural conservation practices.", eligibility: "Mississippi agricultural producers", funding: "Cost-share assistance", category: "Conservation" }
  ],
  "MO": [
    { name: "Missouri Soil and Water Conservation Program", level: "State", agency: "Missouri SWCD", description: "Cost-share for implementing conservation practices on agricultural land.", eligibility: "Missouri agricultural producers", funding: "Cost-share up to 75%", category: "Conservation" },
    { name: "Missouri Agricultural and Small Business Development Authority", level: "State", agency: "MASBDA", description: "Tax credits and financing for agricultural projects including energy efficiency and beginning farmer programs.", eligibility: "Missouri agricultural producers and agribusinesses", funding: "Tax credits and loan guarantees", category: "Finance" }
  ],
  "MT": [
    { name: "Montana Rangeland Resources Program", level: "State", agency: "Montana DNRC", description: "Grants for rangeland improvement including weed management, water development, and grazing management.", eligibility: "Montana ranchers and range managers", funding: "Competitive grants up to $50,000", category: "Rangeland" },
    { name: "Montana Growth Through Agriculture Program", level: "State", agency: "Montana DOA", description: "Grants and loans for agricultural development, innovation, and value-added projects.", eligibility: "Montana agricultural producers and processors", funding: "Grants up to $50,000; loans available", category: "Development" }
  ],
  "NE": [
    { name: "Nebraska Soil and Water Conservation Fund", level: "State", agency: "Nebraska NRC", description: "Provides cost-share for conservation practices including terraces, waterways, and irrigation efficiency.", eligibility: "Nebraska agricultural producers", funding: "Cost-share varies by practice", category: "Conservation" },
    { name: "Nebraska Water Sustainability Fund", level: "State", agency: "Nebraska NRC", description: "Funds projects that promote water sustainability including agricultural water efficiency.", eligibility: "Nebraska NRDs and water users", funding: "Competitive grants", category: "Water" }
  ],
  "NV": [
    { name: "Nevada Conservation Districts Programs", level: "State", agency: "Nevada Conservation Districts", description: "Technical assistance and resource coordination for agricultural conservation.", eligibility: "Nevada agricultural producers", funding: "Technical assistance", category: "Conservation" }
  ],
  "NH": [
    { name: "New Hampshire Agricultural Land Preservation Program", level: "State", agency: "NH DESI", description: "Protects farmland through conservation easements.", eligibility: "New Hampshire farmland owners", funding: "Easement purchase payments", category: "Land Conservation" }
  ],
  "NJ": [
    { name: "New Jersey Farmland Preservation Program", level: "State", agency: "NJ SADC", description: "One of the nation's most active farmland preservation programs, purchasing development easements.", eligibility: "New Jersey farmland owners with 5+ acres", funding: "Development easement payments based on land value", category: "Land Conservation" },
    { name: "New Jersey Agricultural Water Management Program", level: "State", agency: "NJ DEP", description: "Permits and technical assistance for agricultural water management and irrigation.", eligibility: "New Jersey agricultural operations", funding: "Technical assistance", category: "Water" }
  ],
  "NM": [
    { name: "New Mexico Acequia Water Conservation Program", level: "State", agency: "NM OSE", description: "Supports traditional acequia irrigation systems with efficiency improvements.", eligibility: "New Mexico acequia communities", funding: "Infrastructure improvement grants", category: "Water" },
    { name: "New Mexico Agricultural Conservation Assistance Program", level: "State", agency: "NM SWCD", description: "State cost-share for soil and water conservation practices.", eligibility: "New Mexico agricultural producers", funding: "Cost-share assistance", category: "Conservation" }
  ],
  "NY": [
    { name: "New York Agricultural Environmental Management (AEM)", level: "State", agency: "NYS SWCC", description: "Tiered assessment and planning program helping farms reduce environmental impact through best management practices.", eligibility: "New York agricultural producers", funding: "Free assessments; connects to cost-share programs", category: "Environmental Management", url: "https://www.nys-soilandwater.org/aem/" },
    { name: "New York Climate Resilient Farming Program", level: "State", agency: "NYS SWCC", description: "Grants for on-farm practices that reduce GHG emissions and improve climate resilience.", eligibility: "New York farms with AEM Tier 1 assessment", funding: "Grants up to $100,000", category: "Climate" },
    { name: "New York Farmland Protection Implementation Grants", level: "State", agency: "NYS DOA", description: "Funds purchase of development rights on farms to protect agricultural land.", eligibility: "New York municipalities and land trusts", funding: "Up to 75% of easement value", category: "Land Conservation" },
    { name: "New York Source Water Buffer Program", level: "State", agency: "NYS DEC", description: "Financial incentives for agricultural buffers protecting drinking water sources.", eligibility: "New York farms near water sources", funding: "Annual payments for buffer maintenance", category: "Water Quality" }
  ],
  "NC": [
    { name: "North Carolina Agriculture Cost Share Program", level: "State", agency: "NC SWCC", description: "Provides cost-share for BMPs addressing soil erosion, animal waste, and water quality.", eligibility: "North Carolina agricultural producers", funding: "Cost-share up to 75%", category: "Conservation" },
    { name: "North Carolina Agricultural Development and Farmland Preservation Trust Fund", level: "State", agency: "NC ADFP", description: "Grants for farmland preservation, agricultural development, and farm transition planning.", eligibility: "North Carolina farms and agricultural entities", funding: "Competitive grants", category: "Land Conservation" },
    { name: "North Carolina Community Conservation Assistance Program", level: "State", agency: "NC SWCC", description: "Provides technical and financial assistance for conservation on agricultural and urban lands.", eligibility: "North Carolina landowners in priority areas", funding: "Cost-share varies by practice", category: "Conservation" }
  ],
  "ND": [
    { name: "North Dakota Outdoor Heritage Fund", level: "State", agency: "ND ITD", description: "Funds conservation projects including agricultural land protection and habitat improvement.", eligibility: "North Dakota landowners and conservation groups", funding: "Competitive grants", category: "Conservation" },
    { name: "North Dakota Water Commission Programs", level: "State", agency: "ND SWC", description: "Supports agricultural water management including irrigation development and water conservation.", eligibility: "North Dakota water users", funding: "Cost-share and technical assistance", category: "Water" }
  ],
  "OH": [
    { name: "Ohio H2Ohio Program", level: "State", agency: "Ohio DOA", description: "Major state initiative reducing phosphorus runoff from agricultural lands through targeted BMPs.", eligibility: "Ohio farmers in priority watersheds", funding: "Payments for cover crops ($15-35/acre), drainage management, and wetland construction", category: "Water Quality", url: "https://h2.ohio.gov/" },
    { name: "Ohio Agricultural Easement Purchase Program", level: "State", agency: "Ohio DOA", description: "Purchases agricultural easements to permanently protect prime farmland.", eligibility: "Ohio farmland owners", funding: "Easement purchase payments", category: "Land Conservation" }
  ],
  "OK": [
    { name: "Oklahoma Conservation Commission Cost-Share Program", level: "State", agency: "Oklahoma CC", description: "Cost-share for implementing conservation practices on agricultural land.", eligibility: "Oklahoma agricultural producers", funding: "Cost-share up to 80%", category: "Conservation" }
  ],
  "OR": [
    { name: "Oregon Agricultural Water Quality Management Program", level: "State", agency: "Oregon ODA", description: "Mandatory agricultural water quality plans by area with voluntary cost-share for compliance.", eligibility: "Oregon agricultural producers", funding: "Technical assistance and cost-share", category: "Water Quality" },
    { name: "Oregon Soil Health Initiative", level: "State", agency: "Oregon ODA", description: "Promotes soil health practices through education, demonstration, and incentives.", eligibility: "Oregon agricultural producers", funding: "Technical assistance and demonstration projects", category: "Soil Health" }
  ],
  "PA": [
    { name: "Pennsylvania Resource Enhancement and Protection Program (REAP)", level: "State", agency: "PA SCC", description: "Tax credits for implementing conservation BMPs including cover crops, no-till, and nutrient management.", eligibility: "Pennsylvania agricultural producers", funding: "Tax credits 50-75% of project cost, up to $250,000", category: "Tax Incentive", url: "https://www.agriculture.pa.gov/Plants_Land_Water/StateConservationCommission/REAP/" },
    { name: "Pennsylvania Farmland Preservation Program", level: "State", agency: "PA DOA", description: "Purchases conservation easements on productive agricultural land.", eligibility: "Pennsylvania farmland owners in Agricultural Security Areas", funding: "Easement purchase payments", category: "Land Conservation" },
    { name: "Pennsylvania Growing Greener Program", level: "State", agency: "PA DEP", description: "Grants for watershed protection projects including agricultural BMPs.", eligibility: "Pennsylvania organizations and producers in priority watersheds", funding: "Competitive grants", category: "Water Quality" }
  ],
  "RI": [
    { name: "Rhode Island Farmland Preservation Program", level: "State", agency: "RI DEM", description: "Protects farmland through conservation easement purchases.", eligibility: "Rhode Island farmland owners", funding: "Easement purchase payments", category: "Land Conservation" }
  ],
  "SC": [
    { name: "South Carolina Conservation Districts Cost-Share", level: "State", agency: "SC DHEC", description: "Cost-share for agricultural conservation practices through local conservation districts.", eligibility: "South Carolina agricultural producers", funding: "Cost-share varies", category: "Conservation" }
  ],
  "SD": [
    { name: "South Dakota Grassland Conservation Programs", level: "State", agency: "SD GFP", description: "Programs to protect native grasslands and support sustainable grazing practices.", eligibility: "South Dakota ranchers and landowners", funding: "Technical assistance and incentive payments", category: "Rangeland" }
  ],
  "TN": [
    { name: "Tennessee Agricultural Enhancement Program", level: "State", agency: "Tennessee TDA", description: "Cost-share for agricultural improvements including conservation, livestock, and diversification.", eligibility: "Tennessee agricultural producers", funding: "Cost-share varies by practice", category: "Development" },
    { name: "Tennessee Soil Conservation Cost-Share Program", level: "State", agency: "Tennessee SWCC", description: "Cost-share for soil erosion and water quality conservation practices.", eligibility: "Tennessee agricultural producers", funding: "Cost-share up to 75%", category: "Conservation" }
  ],
  "TX": [
    { name: "Texas Water Development Board Agricultural Water Conservation Grants", level: "State", agency: "TWDB", description: "Grants for agricultural water conservation strategies and irrigation efficiency.", eligibility: "Texas agricultural water users", funding: "Competitive grants", category: "Water" },
    { name: "Texas State Soil and Water Conservation Board Programs", level: "State", agency: "TSSWCB", description: "Water quality management plans and cost-share for agricultural BMPs.", eligibility: "Texas agricultural producers", funding: "Cost-share and technical assistance", category: "Water Quality" },
    { name: "Texas Farm and Ranch Lands Conservation Program", level: "State", agency: "Texas GLO", description: "Voluntary conservation easements to protect working farms and ranches.", eligibility: "Texas farmland and ranchland owners", funding: "Easement payments", category: "Land Conservation" }
  ],
  "UT": [
    { name: "Utah Agriculture Water Optimization Program", level: "State", agency: "Utah DAF", description: "Assists agricultural producers with water efficiency improvements and conservation.", eligibility: "Utah agricultural water users", funding: "Cost-share for efficiency improvements", category: "Water" }
  ],
  "VT": [
    { name: "Vermont Required Agricultural Practices (RAPs)", level: "State", agency: "Vermont AAFM", description: "Mandatory practices for all farms plus voluntary cost-share for conservation improvements.", eligibility: "Vermont agricultural producers", funding: "Technical assistance; BMP grants up to $75,000", category: "Water Quality", url: "https://agriculture.vermont.gov/water-quality" },
    { name: "Vermont Agricultural Environmental Management Program", level: "State", agency: "Vermont AAFM", description: "Grants for farm practices that improve water quality and environmental outcomes.", eligibility: "Vermont farms", funding: "Competitive grants", category: "Conservation" },
    { name: "Vermont Farmland Conservation Program", level: "State", agency: "Vermont Housing and Conservation Board", description: "Purchases easements to protect productive farmland and support farm viability.", eligibility: "Vermont farmland owners", funding: "Easement payments", category: "Land Conservation" }
  ],
  "VA": [
    { name: "Virginia Agricultural BMP Cost-Share Program", level: "State", agency: "Virginia DCR", description: "Cost-share for cover crops, nutrient management, stream exclusion, and other BMPs.", eligibility: "Virginia agricultural producers", funding: "Cost-share rates vary; cover crops up to $70/acre", category: "Conservation", url: "https://www.dcr.virginia.gov/soil-and-water/costshar" },
    { name: "Virginia Conservation Reserve Enhancement Program", level: "State", agency: "Virginia DCR", description: "Enhanced CRP targeting buffers and wetlands in priority areas.", eligibility: "Virginia landowners in priority watersheds", funding: "Enhanced federal payments plus state bonuses", category: "Water Quality" }
  ],
  "WA": [
    { name: "Washington Conservation Commission Programs", level: "State", agency: "Washington SCC", description: "Provides cost-share for agricultural conservation practices through conservation districts.", eligibility: "Washington agricultural producers", funding: "Cost-share varies by district", category: "Conservation" },
    { name: "Washington Sustainable Farms and Fields Program", level: "State", agency: "Washington SCC", description: "Incentivizes carbon sequestration practices on agricultural lands.", eligibility: "Washington farmers", funding: "Payments for carbon-sequestering practices", category: "Climate" },
    { name: "Washington Farmland Preservation Program", level: "State", agency: "Washington RCO", description: "Grants for purchasing development rights on working farmland.", eligibility: "Washington farmland owners and land trusts", funding: "Competitive grants for easement purchase", category: "Land Conservation" }
  ],
  "WV": [
    { name: "West Virginia Agricultural Enhancement Program", level: "State", agency: "WV DOA", description: "Cost-share for agricultural improvements and conservation practices.", eligibility: "West Virginia agricultural producers", funding: "Cost-share varies", category: "Conservation" }
  ],
  "WI": [
    { name: "Wisconsin Producer-Led Watershed Protection Grants", level: "State", agency: "Wisconsin DATCP", description: "Grants to farmer-led groups implementing conservation practices at watershed scale.", eligibility: "Wisconsin farmer-led conservation groups", funding: "Grants up to $40,000/year per group", category: "Watershed", url: "https://datcp.wi.gov/Pages/Programs_Services/ProducerLedWatershedProtectionGrants.aspx" },
    { name: "Wisconsin Farmland Preservation Program", level: "State", agency: "Wisconsin DATCP", description: "Tax credits for farmland meeting conservation compliance in certified planning areas.", eligibility: "Wisconsin farmers in certified farmland preservation areas", funding: "Tax credits up to $10/acre", category: "Land Conservation" },
    { name: "Wisconsin Soil and Water Resource Management Program", level: "State", agency: "Wisconsin DATCP", description: "Provides cost-share for conservation practices through county land and water conservation departments.", eligibility: "Wisconsin agricultural producers", funding: "Cost-share up to 70%", category: "Conservation" }
  ],
  "WY": [
    { name: "Wyoming Water Development Commission Programs", level: "State", agency: "Wyoming WWDC", description: "Supports agricultural water development and rehabilitation of irrigation infrastructure.", eligibility: "Wyoming irrigation districts and water users", funding: "Grants and loans for water infrastructure", category: "Water" }
  ]
};

const FIPS_TO_STATE: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
  "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
  "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
  "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
  "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
  "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
  "56": "WY"
};

const STATE_NAMES: Record<string, string> = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

const LOCAL_PROGRAMS: Record<string, Program[]> = {
  "06037": [
    { name: "LA County Agricultural Water Conservation Program", level: "Local", agency: "LA County Dept of Agricultural Commissioner", description: "Local water conservation assistance for agricultural operations in Los Angeles County.", eligibility: "LA County agricultural operations", funding: "Technical assistance and cost-share", category: "Water" }
  ],
  "06019": [
    { name: "Fresno County Ag Land Mitigation Program", level: "Local", agency: "Fresno County", description: "Mitigation program for agricultural land conversion in the San Joaquin Valley.", eligibility: "Fresno County agricultural landowners", funding: "Mitigation fund payments", category: "Land Conservation" },
    { name: "Fresno Irrigation District Conservation Program", level: "Local", agency: "Fresno Irrigation District", description: "Water conservation incentives for agricultural irrigators in the district.", eligibility: "Fresno Irrigation District water users", funding: "Rebates for drip/micro irrigation", category: "Water" }
  ],
  "06107": [
    { name: "Tulare County Dairy Digester Program", level: "Local", agency: "Tulare County APCD", description: "Incentives for dairy digester installation to reduce methane emissions.", eligibility: "Tulare County dairy operations", funding: "Grants up to $500,000", category: "Climate" }
  ],
  "06029": [
    { name: "Kern County Agricultural Water Banking", level: "Local", agency: "Kern Water Bank Authority", description: "Agricultural water banking and groundwater recharge programs.", eligibility: "Kern County water users", funding: "Water storage credits", category: "Water" }
  ],
  "17019": [
    { name: "Champaign County Soil Health Partnership", level: "Local", agency: "Champaign County SWCD", description: "Local partnership promoting cover crops and reduced tillage in Champaign County.", eligibility: "Champaign County farmers", funding: "Cover crop seed cost-share", category: "Soil Health" }
  ],
  "19153": [
    { name: "Polk County Urban-Ag Buffer Program", level: "Local", agency: "Polk County SWCD", description: "Buffer strip incentives between urban and agricultural land uses.", eligibility: "Polk County edge-of-field operators", funding: "Annual buffer payments", category: "Conservation" }
  ],
  "19013": [
    { name: "Black Hawk County Water Quality Initiative", level: "Local", agency: "Black Hawk SWCD", description: "Targeted nutrient reduction program for the Cedar River watershed.", eligibility: "Black Hawk County producers in Cedar watershed", funding: "Enhanced cost-share for BMPs", category: "Water Quality" }
  ],
  "20173": [
    { name: "Sedgwick County Agricultural Water Conservation District", level: "Local", agency: "Sedgwick County", description: "Local water conservation district providing irrigation efficiency assistance.", eligibility: "Sedgwick County irrigators", funding: "Technical assistance", category: "Water" }
  ],
  "27053": [
    { name: "Hennepin County Agricultural Preserves Program", level: "Local", agency: "Hennepin County", description: "Property tax reductions for farmland enrolled in agricultural preserves.", eligibility: "Hennepin County farmland owners", funding: "Property tax reduction", category: "Tax Incentive" }
  ],
  "31055": [
    { name: "Douglas County NRD Groundwater Program", level: "Local", agency: "Lower Platte South NRD", description: "Groundwater management and irrigation efficiency for agricultural operations.", eligibility: "Douglas County irrigators", funding: "Flow meter cost-share and management plans", category: "Water" }
  ],
  "36061": [
    { name: "Manhattan Urban Agriculture Grant", level: "Local", agency: "NYC DCLA", description: "Grants for urban agriculture and community farming projects in New York City.", eligibility: "NYC urban agriculture projects", funding: "Grants up to $15,000", category: "Development" }
  ],
  "36027": [
    { name: "Dutchess County Farmland Protection Program", level: "Local", agency: "Dutchess County", description: "Purchase of development rights to protect active farmland in the Hudson Valley.", eligibility: "Dutchess County farmland owners", funding: "PDR payments based on appraised value", category: "Land Conservation" }
  ],
  "39049": [
    { name: "Franklin County Soil & Water Conservation District Programs", level: "Local", agency: "Franklin County SWCD", description: "Local cost-share for cover crops, grassed waterways, and nutrient management.", eligibility: "Franklin County agricultural producers", funding: "Cost-share up to 75%", category: "Conservation" }
  ],
  "42071": [
    { name: "Lancaster County Clean Water Consortium", level: "Local", agency: "Lancaster Clean Water Partners", description: "Multi-partner initiative to reduce nutrient and sediment pollution from Lancaster County farms.", eligibility: "Lancaster County farmers", funding: "Enhanced BMP cost-share", category: "Water Quality" }
  ],
  "48201": [
    { name: "Harris County Flood Control Agricultural BMPs", level: "Local", agency: "Harris County FCD", description: "Agricultural best management practices for flood reduction in the Houston area.", eligibility: "Harris County agricultural operations", funding: "Stormwater management cost-share", category: "Water" }
  ],
  "48113": [
    { name: "Dallas County Urban Agriculture Initiative", level: "Local", agency: "Dallas County", description: "Support for urban farming and agricultural enterprises within Dallas County.", eligibility: "Dallas County urban farms", funding: "Micro-grants up to $5,000", category: "Development" }
  ],
  "53033": [
    { name: "King County Farmland Preservation Program", level: "Local", agency: "King County DNRP", description: "Purchase of development rights and transfer of development rights for farmland protection.", eligibility: "King County farmland owners in agricultural production districts", funding: "PDR payments", category: "Land Conservation" }
  ],
  "53053": [
    { name: "Pierce County Agriculture Program", level: "Local", agency: "Pierce Conservation District", description: "Farm planning and cost-share for conservation practices in Pierce County.", eligibility: "Pierce County agricultural operations", funding: "Free farm plans and BMP cost-share", category: "Conservation" }
  ],
  "12086": [
    { name: "Miami-Dade Agricultural Best Management Practices", level: "Local", agency: "Miami-Dade DERM", description: "BMP requirements and incentives for agricultural operations in the Everglades buffer zone.", eligibility: "Miami-Dade County agricultural operations", funding: "Technical assistance and compliance support", category: "Water Quality" }
  ],
  "12011": [
    { name: "Broward County Agricultural Land Retention Program", level: "Local", agency: "Broward County", description: "Program to retain remaining agricultural lands through tax incentives and easements.", eligibility: "Broward County active farmland", funding: "Tax incentives", category: "Land Conservation" }
  ],
  "08031": [
    { name: "Denver Urban Agriculture Fund", level: "Local", agency: "Denver Dept of Public Health", description: "Grants for urban agriculture projects including community gardens and small farms.", eligibility: "Denver urban agriculture projects", funding: "Grants up to $10,000", category: "Development" }
  ],
  "08069": [
    { name: "Larimer County Agricultural Irrigation Efficiency", level: "Local", agency: "Northern Colorado Water Conservancy District", description: "Irrigation efficiency improvements for agricultural operations.", eligibility: "Larimer County irrigators in NCWCD", funding: "Cost-share for sprinkler/drip conversion", category: "Water" }
  ],
  "13121": [
    { name: "Fulton County Urban Agriculture Program", level: "Local", agency: "Fulton County", description: "Support for urban farming and agricultural land use in metro Atlanta.", eligibility: "Fulton County urban farms", funding: "Zoning assistance and micro-grants", category: "Development" }
  ],
  "24005": [
    { name: "Baltimore County Agricultural Land Preservation", level: "Local", agency: "Baltimore County", description: "Local easement program preserving working farmland in the county.", eligibility: "Baltimore County farmland owners", funding: "Easement purchase payments", category: "Land Conservation" }
  ],
  "25017": [
    { name: "Middlesex County Agricultural Conservation Program", level: "Local", agency: "Middlesex Conservation District", description: "Conservation technical assistance and cost-share for county farms.", eligibility: "Middlesex County agricultural operations", funding: "Cost-share and planning assistance", category: "Conservation" }
  ],
  "55025": [
    { name: "Dane County Land & Water Conservation", level: "Local", agency: "Dane County LWRD", description: "Cost-share for agricultural conservation practices targeting erosion control and water quality in the Yahara watershed.", eligibility: "Dane County agricultural producers", funding: "Cost-share up to 70%", category: "Water Quality" }
  ],
  "55079": [
    { name: "Milwaukee County Urban Agriculture Incentive", level: "Local", agency: "Milwaukee County", description: "Tax incentive program for converting vacant land to urban agricultural use.", eligibility: "Milwaukee County landowners converting to agriculture", funding: "Property tax reduction for 5 years", category: "Tax Incentive" }
  ],
  "26161": [
    { name: "Washtenaw County Agricultural Preservation Program", level: "Local", agency: "Washtenaw County", description: "Purchase of development rights to preserve agricultural lands near Ann Arbor.", eligibility: "Washtenaw County farmland owners", funding: "PDR payments", category: "Land Conservation" }
  ],
  "37119": [
    { name: "Mecklenburg County Farmland Preservation", level: "Local", agency: "Mecklenburg County", description: "Voluntary agricultural district enrollment for farmland protection near Charlotte.", eligibility: "Mecklenburg County farmland owners", funding: "Property tax benefits and development review", category: "Land Conservation" }
  ],
  "51059": [
    { name: "Fairfax County Agricultural and Forestal District Program", level: "Local", agency: "Fairfax County", description: "Property tax benefits for land enrolled in agricultural and forestal districts.", eligibility: "Fairfax County agricultural landowners with 20+ acres", funding: "Land use tax assessment", category: "Tax Incentive" }
  ]
};

function getCountyPrograms(countyFips: string): { federal: Program[]; state: Program[]; local: Program[]; stateName: string; stateCode: string } {
  const stateFips = countyFips.substring(0, 2);
  const stateCode = FIPS_TO_STATE[stateFips] || "";
  const stateName = STATE_NAMES[stateCode] || "Unknown";
  const statePrograms = STATE_PROGRAMS[stateCode] || [];
  const localPrograms = LOCAL_PROGRAMS[countyFips] || [];

  return {
    federal: FEDERAL_PROGRAMS,
    state: statePrograms,
    local: localPrograms,
    stateName,
    stateCode
  };
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Conservation": "bg-green-100 text-green-800",
    "Land Conservation": "bg-emerald-100 text-emerald-800",
    "Water": "bg-blue-100 text-blue-800",
    "Water Quality": "bg-cyan-100 text-cyan-800",
    "Climate": "bg-purple-100 text-purple-800",
    "Energy": "bg-yellow-100 text-yellow-800",
    "Soil Health": "bg-amber-100 text-amber-800",
    "Organic": "bg-lime-100 text-lime-800",
    "Stewardship": "bg-teal-100 text-teal-800",
    "Easements": "bg-indigo-100 text-indigo-800",
    "Partnership": "bg-violet-100 text-violet-800",
    "Innovation": "bg-pink-100 text-pink-800",
    "Emergency": "bg-red-100 text-red-800",
    "Tax Incentive": "bg-orange-100 text-orange-800",
    "Finance": "bg-slate-100 text-slate-800",
    "Biodiversity": "bg-green-100 text-green-800",
    "Livestock": "bg-amber-100 text-amber-800",
    "Rangeland": "bg-yellow-100 text-yellow-800",
    "Watershed": "bg-blue-100 text-blue-800",
    "Environmental Management": "bg-teal-100 text-teal-800",
    "Environmental Assurance": "bg-teal-100 text-teal-800",
    "Education": "bg-indigo-100 text-indigo-800",
    "Development": "bg-slate-100 text-slate-800",
    "Planning": "bg-gray-100 text-gray-800",
    "Beginning Farmers": "bg-green-100 text-green-800",
    "Biomass": "bg-lime-100 text-lime-800",
    "Specialty Crops": "bg-orange-100 text-orange-800",
    "Wetlands": "bg-cyan-100 text-cyan-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Water":
    case "Water Quality":
    case "Watershed":
    case "Wetlands":
      return <Droplets className="w-4 h-4" />;
    case "Conservation":
    case "Stewardship":
    case "Environmental Management":
    case "Environmental Assurance":
      return <Leaf className="w-4 h-4" />;
    case "Land Conservation":
    case "Easements":
      return <MapPin className="w-4 h-4" />;
    case "Climate":
      return <Globe className="w-4 h-4" />;
    case "Energy":
    case "Biomass":
      return <Sprout className="w-4 h-4" />;
    case "Finance":
    case "Tax Incentive":
    case "Development":
      return <DollarSign className="w-4 h-4" />;
    case "Biodiversity":
    case "Rangeland":
    case "Soil Health":
    case "Organic":
      return <TreePine className="w-4 h-4" />;
    default:
      return <Building2 className="w-4 h-4" />;
  }
}

function ProgramCard({ program, defaultExpanded = false }: { program: Program; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border rounded-lg p-3 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="mt-0.5">{getCategoryIcon(program.category)}</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm leading-tight">{program.name}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-xs">{program.agency}</Badge>
              <Badge className={`text-xs ${getCategoryColor(program.category)}`}>{program.category}</Badge>
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </div>
      {expanded && (
        <div className="mt-3 pl-6 space-y-2 text-sm">
          <p className="text-gray-700">{program.description}</p>
          <div>
            <span className="font-medium text-gray-900">Eligibility: </span>
            <span className="text-gray-600">{program.eligibility}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Funding: </span>
            <span className="text-gray-600">{program.funding}</span>
          </div>
          {program.url && (
            <a href={program.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgProgramsPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedCounty, setSelectedCounty] = useState<{ name: string; fips: string; stateName: string; stateCode: string } | null>(null);
  const [hoveredCounty, setHoveredCounty] = useState<{ name: string; fips: string; x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | "Federal" | "State" | "Local">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [mapLoaded, setMapLoaded] = useState(false);

  const renderMap = useCallback(async () => {
    if (!mapRef.current) return;

    const width = mapRef.current.clientWidth;
    const height = Math.min(width * 0.62, 600);

    const existingSvg = d3.select(mapRef.current).select("svg");
    if (!existingSvg.empty()) existingSvg.remove();

    const svg = d3.select(mapRef.current)
      .append("svg")
      .attr("viewBox", `0 0 975 610`)
      .attr("width", width)
      .attr("height", height)
      .style("max-width", "100%")
      .style("height", "auto");

    svgRef.current = svg.node();

    try {
      const response = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json");
      const us = await response.json();

      const counties = topojson.feature(us, us.objects.counties) as any;
      const states = topojson.feature(us, us.objects.states) as any;
      const stateMesh = topojson.mesh(us, us.objects.states, (a: any, b: any) => a !== b);

      const colorScale = d3.scaleOrdinal<string>()
        .domain(Object.keys(FIPS_TO_STATE))
        .range(d3.schemeTableau10.concat(d3.schemePastel1).concat(d3.schemePastel2));

      svg.append("g")
        .selectAll("path")
        .data(counties.features)
        .join("path")
        .attr("d", d3.geoPath() as any)
        .attr("fill", (d: any) => {
          const stateFips = String(d.id).padStart(5, "0").substring(0, 2);
          const stateCode = FIPS_TO_STATE[stateFips];
          const countyFips = String(d.id).padStart(5, "0");
          const statePrograms = STATE_PROGRAMS[stateCode] || [];
          const localPrograms = LOCAL_PROGRAMS[countyFips] || [];
          const programCount = FEDERAL_PROGRAMS.length + statePrograms.length + localPrograms.length;
          const intensity = Math.min(programCount / 20, 1);
          return d3.interpolateGreens(0.15 + intensity * 0.55);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.2)
        .attr("cursor", "pointer")
        .on("mouseover", function (event: any, d: any) {
          d3.select(this).attr("stroke", "#1a365d").attr("stroke-width", 1.5);
          const countyFips = String(d.id).padStart(5, "0");
          const stateFips = countyFips.substring(0, 2);
          const stateCode = FIPS_TO_STATE[stateFips] || "";
          const countyName = d.properties?.name || `County ${countyFips}`;

          const [mx, my] = d3.pointer(event, mapRef.current);
          setHoveredCounty({
            name: countyName,
            fips: countyFips,
            x: mx,
            y: my
          });
        })
        .on("mousemove", function (event: any, d: any) {
          const countyFips = String(d.id).padStart(5, "0");
          const countyName = d.properties?.name || `County ${countyFips}`;
          const [mx, my] = d3.pointer(event, mapRef.current);
          setHoveredCounty({
            name: countyName,
            fips: countyFips,
            x: mx,
            y: my
          });
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.2);
          setHoveredCounty(null);
        })
        .on("click", function (event: any, d: any) {
          const countyFips = String(d.id).padStart(5, "0");
          const stateFips = countyFips.substring(0, 2);
          const stateCode = FIPS_TO_STATE[stateFips] || "";
          const stateName = STATE_NAMES[stateCode] || "Unknown";
          const countyName = d.properties?.name || `County ${countyFips}`;
          setSelectedCounty({ name: countyName, fips: countyFips, stateName, stateCode });
        });

      svg.append("path")
        .datum(stateMesh)
        .attr("d", d3.geoPath() as any)
        .attr("fill", "none")
        .attr("stroke", "#374151")
        .attr("stroke-width", 0.8)
        .attr("pointer-events", "none");

      setMapLoaded(true);
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  }, []);

  useEffect(() => {
    renderMap();
    const handleResize = () => renderMap();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderMap]);

  const selectedPrograms = selectedCounty ? getCountyPrograms(selectedCounty.fips) : null;
  const hoveredPrograms = hoveredCounty ? getCountyPrograms(hoveredCounty.fips) : null;

  const allCategories = Array.from(new Set([
    ...FEDERAL_PROGRAMS.map(p => p.category),
    ...Object.values(STATE_PROGRAMS).flat().map(p => p.category),
    ...Object.values(LOCAL_PROGRAMS).flat().map(p => p.category)
  ])).sort();

  const filterFn = (p: Program) => {
    const matchesSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "all" || p.level === filterLevel;
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  };

  const filteredPrograms = selectedPrograms ? {
    federal: selectedPrograms.federal.filter(filterFn),
    state: selectedPrograms.state.filter(filterFn),
    local: selectedPrograms.local.filter(filterFn)
  } : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">Agricultural Environmental Programs</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <p className="text-gray-600 max-w-3xl">
            Explore federal, state, and local environmental programs available to agricultural companies and farms across the United States. 
            Hover over any county to see available programs, or click to view full details with eligibility and funding information.
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-3 rounded-sm" style={{ background: d3.interpolateGreens(0.2) }} />
              <span>Fewer programs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-3 rounded-sm" style={{ background: d3.interpolateGreens(0.5) }} />
              <span>More programs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-3 rounded-sm" style={{ background: d3.interpolateGreens(0.7) }} />
              <span>Many programs</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <div ref={mapRef} className="relative w-full" style={{ minHeight: 300 }}>
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading county map...</p>
                      </div>
                    </div>
                  )}
                  {hoveredCounty && hoveredPrograms && (
                    <div
                      ref={tooltipRef}
                      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 pointer-events-none"
                      style={{
                        left: Math.min(hoveredCounty.x + 15, (mapRef.current?.clientWidth || 600) - 320),
                        top: Math.max(hoveredCounty.y - 10, 0),
                        maxWidth: 310,
                        maxHeight: 350,
                        overflow: "hidden"
                      }}
                    >
                      <div className="font-semibold text-gray-900 text-sm mb-1">
                        {hoveredCounty.name} County, {hoveredPrograms.stateName}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {FEDERAL_PROGRAMS.length} federal + {hoveredPrograms.state.length} state{hoveredPrograms.local.length > 0 ? ` + ${hoveredPrograms.local.length} local` : ""} programs available
                      </div>
                      <div className="space-y-1">
                        {hoveredPrograms.local.length > 0 && (
                          <>
                            <div className="text-xs font-medium text-orange-700">Local Programs:</div>
                            {hoveredPrograms.local.map((p, i) => (
                              <div key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                <span className="text-orange-500 mt-0.5">•</span>
                                <span className="line-clamp-1">{p.name}</span>
                              </div>
                            ))}
                          </>
                        )}
                        <div className="text-xs font-medium text-green-700">Federal Programs:</div>
                        {FEDERAL_PROGRAMS.slice(0, 4).map((p, i) => (
                          <div key={i} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span className="line-clamp-1">{p.name}</span>
                          </div>
                        ))}
                        {FEDERAL_PROGRAMS.length > 4 && (
                          <div className="text-xs text-gray-400">+{FEDERAL_PROGRAMS.length - 4} more federal programs</div>
                        )}
                        {hoveredPrograms.state.length > 0 && (
                          <>
                            <div className="text-xs font-medium text-blue-700 mt-1">State Programs ({hoveredPrograms.stateCode}):</div>
                            {hoveredPrograms.state.slice(0, 3).map((p, i) => (
                              <div key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span className="line-clamp-1">{p.name}</span>
                              </div>
                            ))}
                            {hoveredPrograms.state.length > 3 && (
                              <div className="text-xs text-gray-400">+{hoveredPrograms.state.length - 3} more state programs</div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-primary font-medium">Click for full details →</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {!selectedCounty && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    Federal Programs Available Nationwide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    These {FEDERAL_PROGRAMS.length} USDA programs are available to eligible agricultural producers in every state and county.
                    Click a county on the map to see state-specific programs as well.
                  </p>
                  <div className="space-y-2">
                    {FEDERAL_PROGRAMS.map((program, idx) => (
                      <ProgramCard key={idx} program={program} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedCounty && filteredPrograms ? (
              <div className="space-y-4 sticky top-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        <MapPin className="w-5 h-5 inline mr-1 text-green-600" />
                        {selectedCounty.name} County
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedCounty(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">{selectedCounty.stateName}</p>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge className="bg-green-100 text-green-800">{filteredPrograms.federal.length} Federal</Badge>
                      <Badge className="bg-blue-100 text-blue-800">{filteredPrograms.state.length} State</Badge>
                      {filteredPrograms.local.length > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">{filteredPrograms.local.length} Local</Badge>
                      )}
                      <Badge variant="outline">{filteredPrograms.federal.length + filteredPrograms.state.length + filteredPrograms.local.length} Total</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search programs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-9 text-sm"
                        />
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {(["all", "Federal", "State", "Local"] as const).map(level => (
                          <Button
                            key={level}
                            variant={filterLevel === level ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setFilterLevel(level)}
                          >
                            {level === "all" ? "All Levels" : level}
                          </Button>
                        ))}
                      </div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full h-8 text-xs border rounded px-2 bg-white"
                      >
                        <option value="all">All Categories</option>
                        {allCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <div className="max-h-[calc(100vh-350px)] overflow-y-auto space-y-2 pr-1">
                  {filteredPrograms.local.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Local Programs ({filteredPrograms.local.length})
                      </h3>
                      <div className="space-y-2">
                        {filteredPrograms.local.map((program, idx) => (
                          <ProgramCard key={`local-${idx}`} program={program} defaultExpanded={true} />
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredPrograms.federal.length > 0 && (
                    <div className={filteredPrograms.local.length > 0 ? "mt-4" : ""}>
                      <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        Federal Programs ({filteredPrograms.federal.length})
                      </h3>
                      <div className="space-y-2">
                        {filteredPrograms.federal.map((program, idx) => (
                          <ProgramCard key={`fed-${idx}`} program={program} />
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredPrograms.state.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {selectedCounty.stateName} State Programs ({filteredPrograms.state.length})
                      </h3>
                      <div className="space-y-2">
                        {filteredPrograms.state.map((program, idx) => (
                          <ProgramCard key={`state-${idx}`} program={program} />
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredPrograms.federal.length === 0 && filteredPrograms.state.length === 0 && filteredPrograms.local.length === 0 && (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No programs match your filters.</p>
                        <Button variant="link" size="sm" onClick={() => { setSearchQuery(""); setFilterLevel("all"); setFilterCategory("all"); }}>
                          Clear filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 sticky top-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Select a County</h3>
                      <p className="text-sm text-gray-600">
                        Click any county on the map to view all available federal, state, and local agricultural environmental programs.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Program Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Federal Programs</span>
                        <Badge className="bg-green-100 text-green-800">{FEDERAL_PROGRAMS.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">States with Programs</span>
                        <Badge className="bg-blue-100 text-blue-800">{Object.keys(STATE_PROGRAMS).length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total State Programs</span>
                        <Badge variant="outline">{Object.values(STATE_PROGRAMS).flat().length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Counties with Local Programs</span>
                        <Badge className="bg-orange-100 text-orange-800">{Object.keys(LOCAL_PROGRAMS).length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Local Programs</span>
                        <Badge variant="outline">{Object.values(LOCAL_PROGRAMS).flat().length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Program Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {["Conservation", "Water Quality", "Land Conservation", "Climate", "Soil Health", "Water", "Energy"].map(cat => {
                        const count = FEDERAL_PROGRAMS.filter(p => p.category === cat).length +
                          Object.values(STATE_PROGRAMS).flat().filter(p => p.category === cat).length +
                          Object.values(LOCAL_PROGRAMS).flat().filter(p => p.category === cat).length;
                        if (count === 0) return null;
                        return (
                          <div key={cat} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(cat)}
                              <span className="text-gray-700">{cat}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
