/**
 * Sector-Dependent Risk Weightings
 * 
 * This module defines the weightings for calculating residual risk scores
 * using the formula: Residual Risk = w1*Likelihood + w2*Impact + w3*Vulnerability
 * 
 * Weightings vary by:
 * - Sector (energy, manufacturing, agriculture, technology, food_beverage, etc.)
 * - Risk Category (Policy/Legal, Technology, Market, Reputation, Physical)
 * - Risk Subcategory (specific risk types within each category)
 * 
 * All weights for a given sector/category combination sum to 1.0
 */

export interface RiskWeights {
  likelihood: number;  // w1
  impact: number;      // w2
  vulnerability: number; // w3
}

export interface CategoryWeights {
  [subcategory: string]: RiskWeights;
}

export interface SectorWeightings {
  [category: string]: CategoryWeights;
}

// Default weights when no specific sector weights are defined
const DEFAULT_WEIGHTS: RiskWeights = {
  likelihood: 0.33,
  impact: 0.34,
  vulnerability: 0.33
};

/**
 * Sector-specific weightings for each risk category and subcategory
 * 
 * Rationale for weightings:
 * - Energy sector: Higher impact weights for policy risks due to regulatory exposure
 * - Technology sector: Higher likelihood weights due to rapid tech evolution
 * - Manufacturing: Balanced weights with emphasis on vulnerability for supply chain risks
 * - Agriculture: Higher vulnerability weights due to physical climate exposure
 * - Food & Beverage: Higher impact weights for market and reputation risks
 */
export const SECTOR_WEIGHTINGS: { [sectorCode: string]: SectorWeightings } = {
  
  // ============== ENERGY SECTOR ==============
  // High exposure to policy/regulatory risks and stranded assets
  energy: {
    "Policy / Legal": {
      "Carbon pricing and reporting obligations": { likelihood: 0.25, impact: 0.45, vulnerability: 0.30 },
      "Mandates on and regulation of existing products and services": { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 },
      "Exposure to litigation": { likelihood: 0.35, impact: 0.40, vulnerability: 0.25 },
      _default: { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 }
    },
    "Technology": {
      "Substitution of existing products and services": { likelihood: 0.35, impact: 0.40, vulnerability: 0.25 },
      "Unsuccessful investment in new technologies": { likelihood: 0.30, impact: 0.45, vulnerability: 0.25 },
      _default: { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 }
    },
    "Market": {
      "Changing customer behavior": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Increased cost of raw materials": { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 },
      "Uncertainty in market signals": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      _default: { likelihood: 0.33, impact: 0.37, vulnerability: 0.30 }
    },
    "Reputation": {
      "Shift in consumer preferences": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Stigmatization of sector": { likelihood: 0.25, impact: 0.45, vulnerability: 0.30 },
      "Increased shareholder concern/negative feedback": { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 },
      _default: { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 }
    },
    "Physical": {
      "Acute": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Chronic": { likelihood: 0.30, impact: 0.35, vulnerability: 0.35 },
      _default: { likelihood: 0.32, impact: 0.35, vulnerability: 0.33 }
    },
    "Opportunity": {
      _default: { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 }
    }
  },

  // ============== MANUFACTURING SECTOR ==============
  // Moderate transition risk with supply chain vulnerabilities
  manufacturing: {
    "Policy / Legal": {
      "Carbon pricing and reporting obligations": { likelihood: 0.30, impact: 0.35, vulnerability: 0.35 },
      "Mandates on and regulation of existing products and services": { likelihood: 0.30, impact: 0.35, vulnerability: 0.35 },
      "Exposure to litigation": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      _default: { likelihood: 0.32, impact: 0.35, vulnerability: 0.33 }
    },
    "Technology": {
      "Substitution of existing products and services": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Unsuccessful investment in new technologies": { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 },
      _default: { likelihood: 0.32, impact: 0.38, vulnerability: 0.30 }
    },
    "Market": {
      "Changing customer behavior": { likelihood: 0.35, impact: 0.30, vulnerability: 0.35 },
      "Increased cost of raw materials": { likelihood: 0.25, impact: 0.35, vulnerability: 0.40 },
      "Uncertainty in market signals": { likelihood: 0.35, impact: 0.30, vulnerability: 0.35 },
      _default: { likelihood: 0.32, impact: 0.32, vulnerability: 0.36 }
    },
    "Reputation": {
      "Shift in consumer preferences": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Stigmatization of sector": { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 },
      "Increased shareholder concern/negative feedback": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      _default: { likelihood: 0.33, impact: 0.37, vulnerability: 0.30 }
    },
    "Physical": {
      "Acute": { likelihood: 0.30, impact: 0.30, vulnerability: 0.40 },
      "Chronic": { likelihood: 0.25, impact: 0.35, vulnerability: 0.40 },
      _default: { likelihood: 0.28, impact: 0.32, vulnerability: 0.40 }
    },
    "Opportunity": {
      _default: { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 }
    }
  },

  // ============== AGRICULTURE SECTOR ==============
  // Very high physical risk exposure, significant vulnerability to climate
  agriculture: {
    "Policy / Legal": {
      "Carbon pricing and reporting obligations": { likelihood: 0.35, impact: 0.30, vulnerability: 0.35 },
      "Mandates on and regulation of existing products and services": { likelihood: 0.35, impact: 0.30, vulnerability: 0.35 },
      "Exposure to litigation": { likelihood: 0.40, impact: 0.30, vulnerability: 0.30 },
      _default: { likelihood: 0.37, impact: 0.30, vulnerability: 0.33 }
    },
    "Technology": {
      "Substitution of existing products and services": { likelihood: 0.35, impact: 0.30, vulnerability: 0.35 },
      "Unsuccessful investment in new technologies": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      _default: { likelihood: 0.35, impact: 0.32, vulnerability: 0.33 }
    },
    "Market": {
      "Changing customer behavior": { likelihood: 0.30, impact: 0.30, vulnerability: 0.40 },
      "Increased cost of raw materials": { likelihood: 0.25, impact: 0.30, vulnerability: 0.45 },
      "Uncertainty in market signals": { likelihood: 0.30, impact: 0.30, vulnerability: 0.40 },
      _default: { likelihood: 0.28, impact: 0.30, vulnerability: 0.42 }
    },
    "Reputation": {
      "Shift in consumer preferences": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Stigmatization of sector": { likelihood: 0.30, impact: 0.35, vulnerability: 0.35 },
      "Increased shareholder concern/negative feedback": { likelihood: 0.35, impact: 0.30, vulnerability: 0.35 },
      _default: { likelihood: 0.33, impact: 0.33, vulnerability: 0.34 }
    },
    "Physical": {
      "Acute": { likelihood: 0.25, impact: 0.30, vulnerability: 0.45 },
      "Chronic": { likelihood: 0.20, impact: 0.30, vulnerability: 0.50 },
      _default: { likelihood: 0.22, impact: 0.30, vulnerability: 0.48 }
    },
    "Opportunity": {
      _default: { likelihood: 0.35, impact: 0.30, vulnerability: 0.35 }
    }
  },

  // ============== TECHNOLOGY SECTOR ==============
  // Lower direct emissions, higher likelihood weights due to rapid change
  technology: {
    "Policy / Legal": {
      "Carbon pricing and reporting obligations": { likelihood: 0.40, impact: 0.30, vulnerability: 0.30 },
      "Mandates on and regulation of existing products and services": { likelihood: 0.40, impact: 0.30, vulnerability: 0.30 },
      "Exposure to litigation": { likelihood: 0.40, impact: 0.35, vulnerability: 0.25 },
      _default: { likelihood: 0.40, impact: 0.32, vulnerability: 0.28 }
    },
    "Technology": {
      "Substitution of existing products and services": { likelihood: 0.40, impact: 0.35, vulnerability: 0.25 },
      "Unsuccessful investment in new technologies": { likelihood: 0.35, impact: 0.40, vulnerability: 0.25 },
      _default: { likelihood: 0.38, impact: 0.37, vulnerability: 0.25 }
    },
    "Market": {
      "Changing customer behavior": { likelihood: 0.40, impact: 0.35, vulnerability: 0.25 },
      "Increased cost of raw materials": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Uncertainty in market signals": { likelihood: 0.40, impact: 0.35, vulnerability: 0.25 },
      _default: { likelihood: 0.38, impact: 0.35, vulnerability: 0.27 }
    },
    "Reputation": {
      "Shift in consumer preferences": { likelihood: 0.40, impact: 0.35, vulnerability: 0.25 },
      "Stigmatization of sector": { likelihood: 0.35, impact: 0.40, vulnerability: 0.25 },
      "Increased shareholder concern/negative feedback": { likelihood: 0.40, impact: 0.35, vulnerability: 0.25 },
      _default: { likelihood: 0.38, impact: 0.37, vulnerability: 0.25 }
    },
    "Physical": {
      "Acute": { likelihood: 0.40, impact: 0.35, vulnerability: 0.25 },
      "Chronic": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      _default: { likelihood: 0.38, impact: 0.35, vulnerability: 0.27 }
    },
    "Opportunity": {
      _default: { likelihood: 0.35, impact: 0.40, vulnerability: 0.25 }
    }
  },

  // ============== FOOD & BEVERAGE SECTOR ==============
  // High market and reputation sensitivity, supply chain vulnerabilities
  food_beverage: {
    "Policy / Legal": {
      "Carbon pricing and reporting obligations": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Mandates on and regulation of existing products and services": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Exposure to litigation": { likelihood: 0.35, impact: 0.40, vulnerability: 0.25 },
      _default: { likelihood: 0.35, impact: 0.37, vulnerability: 0.28 }
    },
    "Technology": {
      "Substitution of existing products and services": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      "Unsuccessful investment in new technologies": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      _default: { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 }
    },
    "Market": {
      "Changing customer behavior": { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 },
      "Increased cost of raw materials": { likelihood: 0.25, impact: 0.35, vulnerability: 0.40 },
      "Uncertainty in market signals": { likelihood: 0.35, impact: 0.35, vulnerability: 0.30 },
      _default: { likelihood: 0.30, impact: 0.37, vulnerability: 0.33 }
    },
    "Reputation": {
      "Shift in consumer preferences": { likelihood: 0.30, impact: 0.45, vulnerability: 0.25 },
      "Stigmatization of sector": { likelihood: 0.30, impact: 0.45, vulnerability: 0.25 },
      "Increased shareholder concern/negative feedback": { likelihood: 0.30, impact: 0.40, vulnerability: 0.30 },
      _default: { likelihood: 0.30, impact: 0.43, vulnerability: 0.27 }
    },
    "Physical": {
      "Acute": { likelihood: 0.30, impact: 0.30, vulnerability: 0.40 },
      "Chronic": { likelihood: 0.25, impact: 0.30, vulnerability: 0.45 },
      _default: { likelihood: 0.28, impact: 0.30, vulnerability: 0.42 }
    },
    "Opportunity": {
      _default: { likelihood: 0.35, impact: 0.40, vulnerability: 0.25 }
    }
  }
};

/**
 * Get the appropriate weights for a given sector, category, and subcategory
 */
export function getWeightsForRisk(
  sectorCode: string,
  category: string,
  subcategory: string
): RiskWeights {
  // Normalize sector code
  const normalizedSector = sectorCode.toLowerCase().replace(/[\s&]/g, '_');
  
  // Try to find sector-specific weights
  const sectorWeights = SECTOR_WEIGHTINGS[normalizedSector];
  
  if (!sectorWeights) {
    // Fall back to default weights
    return DEFAULT_WEIGHTS;
  }
  
  // Try to find category weights
  const categoryWeights = sectorWeights[category];
  
  if (!categoryWeights) {
    // Fall back to default weights
    return DEFAULT_WEIGHTS;
  }
  
  // Try to find exact subcategory match
  if (categoryWeights[subcategory]) {
    return categoryWeights[subcategory];
  }
  
  // Fall back to category default
  if (categoryWeights._default) {
    return categoryWeights._default;
  }
  
  return DEFAULT_WEIGHTS;
}

/**
 * Calculate residual risk using sector-dependent weighted additive formula
 * 
 * Formula: Residual Risk = w1*Likelihood + w2*Impact + w3*Vulnerability
 * 
 * @param likelihood Score 1-5
 * @param impact Score 1-5
 * @param vulnerability Score 1-5
 * @param weights Sector-dependent weights
 * @returns Residual risk score (1-5 scale)
 */
export function calculateResidualRisk(
  likelihood: number,
  impact: number,
  vulnerability: number,
  weights: RiskWeights
): number {
  const residualRisk = 
    weights.likelihood * likelihood +
    weights.impact * impact +
    weights.vulnerability * vulnerability;
  
  // Ensure result is within 1-5 range and round to 2 decimal places
  return Math.round(Math.max(1, Math.min(5, residualRisk)) * 100) / 100;
}

/**
 * Map subcategory to its parent risk category group
 * This is needed because the request.category might be "transition" but we need
 * to look up weights by the specific category like "Policy / Legal"
 */
const SUBCATEGORY_TO_CATEGORY: { [subcategory: string]: string } = {
  // Policy / Legal
  "Carbon pricing and reporting obligations": "Policy / Legal",
  "Mandates on and regulation of existing products and services": "Policy / Legal",
  "Exposure to litigation": "Policy / Legal",
  // Technology
  "Substitution of existing products and services": "Technology",
  "Unsuccessful investment in new technologies": "Technology",
  // Market
  "Changing customer behavior": "Market",
  "Increased cost of raw materials": "Market",
  "Uncertainty in market signals": "Market",
  // Reputation
  "Shift in consumer preferences": "Reputation",
  "Stigmatization of sector": "Reputation",
  "Increased shareholder concern/negative feedback": "Reputation",
  // Physical
  "Acute": "Physical",
  "Chronic": "Physical",
};

/**
 * Get the category group for a given subcategory
 * Falls back to the provided category if no mapping found
 */
export function getCategoryGroup(category: string, subcategory: string): string {
  // First check if the category itself is already a valid category group
  const validCategories = ["Policy / Legal", "Technology", "Market", "Reputation", "Physical", "Opportunity"];
  if (validCategories.includes(category)) {
    return category;
  }
  
  // Try to find the category from the subcategory mapping
  if (SUBCATEGORY_TO_CATEGORY[subcategory]) {
    return SUBCATEGORY_TO_CATEGORY[subcategory];
  }
  
  // For physical risks, check if category contains "physical"
  if (category.toLowerCase().includes("physical")) {
    return "Physical";
  }
  
  // For opportunities
  if (category.toLowerCase().includes("opportunity") || category === "opportunity") {
    return "Opportunity";
  }
  
  // Default fallback - try to infer from subcategory keywords
  const subcategoryLower = subcategory.toLowerCase();
  if (subcategoryLower.includes("carbon") || subcategoryLower.includes("regulation") || subcategoryLower.includes("litigation") || subcategoryLower.includes("policy")) {
    return "Policy / Legal";
  }
  if (subcategoryLower.includes("technology") || subcategoryLower.includes("substitution") || subcategoryLower.includes("investment")) {
    return "Technology";
  }
  if (subcategoryLower.includes("market") || subcategoryLower.includes("customer") || subcategoryLower.includes("raw material") || subcategoryLower.includes("cost")) {
    return "Market";
  }
  if (subcategoryLower.includes("reputation") || subcategoryLower.includes("consumer") || subcategoryLower.includes("shareholder") || subcategoryLower.includes("stigma")) {
    return "Reputation";
  }
  
  // Final fallback to Policy / Legal as a default transition risk category
  return "Policy / Legal";
}

/**
 * Map industry string to sector code
 */
export function mapIndustryToSector(industry: string): string {
  const industryLower = industry.toLowerCase();
  
  const mappings: { [key: string]: string[] } = {
    energy: ["energy", "oil", "gas", "petroleum", "utilities", "power", "electricity", "coal", "mining"],
    manufacturing: ["manufacturing", "industrial", "automotive", "chemicals", "materials", "steel", "cement", "construction"],
    agriculture: ["agriculture", "farming", "forestry", "fishing", "livestock", "crops"],
    technology: ["technology", "tech", "software", "hardware", "it", "digital", "cloud", "data", "telecommunications"],
    food_beverage: ["food", "beverage", "restaurant", "grocery", "consumer goods", "retail food", "packaged goods"]
  };
  
  for (const [sectorCode, keywords] of Object.entries(mappings)) {
    if (keywords.some(keyword => industryLower.includes(keyword))) {
      return sectorCode;
    }
  }
  
  // Default to manufacturing as a middle-ground sector
  return "manufacturing";
}

/**
 * Get a summary of weights for display purposes
 */
export function getWeightsSummary(sectorCode: string): { [category: string]: RiskWeights } {
  const sectorWeights = SECTOR_WEIGHTINGS[sectorCode];
  
  if (!sectorWeights) {
    return {
      "Policy / Legal": DEFAULT_WEIGHTS,
      "Technology": DEFAULT_WEIGHTS,
      "Market": DEFAULT_WEIGHTS,
      "Reputation": DEFAULT_WEIGHTS,
      "Physical": DEFAULT_WEIGHTS
    };
  }
  
  const summary: { [category: string]: RiskWeights } = {};
  
  for (const category of Object.keys(sectorWeights)) {
    summary[category] = sectorWeights[category]._default || DEFAULT_WEIGHTS;
  }
  
  return summary;
}
