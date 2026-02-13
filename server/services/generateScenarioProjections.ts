import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default_key" 
});

export async function generateScenarioProjections(
  riskAssessment: any,
  industry: string,
  companyName: string,
  assessmentFramework: string = 'standard'
): Promise<any> {
  try {
    // Determine which metrics to display based on framework and category
    const isOpportunity = riskAssessment.category === 'opportunity';
    const isAdvanced = assessmentFramework === 'advanced';
    
    let currentScoresDescription = '';
    if (isAdvanced) {
      if (isOpportunity) {
        currentScoresDescription = `
Current Baseline Scores:
- Strategic Misalignment Score: ${riskAssessment.strategicMisalignmentScore || 3}/5
- Market Readiness Score: ${riskAssessment.marketReadinessScore || 3}/5
- Value Creation Score: ${riskAssessment.valueCreationScore || 3}/5
- Feasibility Score: ${riskAssessment.feasibilityScore || 3}/5`;
      } else {
        currentScoresDescription = `
Current Baseline Scores:
- Exposure Score: ${riskAssessment.exposureScore || 3}/5
- Vulnerability Score: ${riskAssessment.vulnerabilityScore || 3}/5
- Strategic Misalignment Score: ${riskAssessment.strategicMisalignmentScore || 3}/5
- Mitigation Readiness Score: ${riskAssessment.mitigationReadinessScore || 3}/5`;
      }
    } else {
      currentScoresDescription = `
Current Baseline Scores:
- Impact Score: ${riskAssessment.impactScore}/5
- Likelihood Score: ${riskAssessment.likelihoodScore}/5
- Vulnerability Score: ${riskAssessment.vulnerabilityScore}/5`;
    }

    const prompt = `
You are a climate scenario analysis expert. Generate projections for how this risk assessment would evolve across different NGFS climate scenarios and time horizons.

Current Risk Assessment:
Company: ${companyName}
Industry: ${industry}
Risk Category: ${riskAssessment.category}
Risk Subcategory: ${riskAssessment.subcategory}
${currentScoresDescription}

NGFS Scenarios to analyze:
1. Net Zero 2050 - Orderly transition with immediate policy action
2. Below 2°C - Gradual strengthening of policies
3. Delayed Transition - Late but sudden policy action
4. Divergent Net Zero - Uneven policies across sectors/regions
5. NDCs - Current nationally determined contributions
6. Current Policies - Policies currently in place only
7. Hot House World - Limited policy action, high physical risks

Time Horizons: 2030, 2040, 2050

For each scenario and time horizon, project how the scores would change based on:
- Policy trajectory and timing
- Technology development paths
- Market transformation speed
- Physical risk evolution
- Regulatory enforcement patterns

${isAdvanced ? (
  isOpportunity ? `
Return JSON with this exact structure for Advanced Opportunity Framework:
{
  "net-zero-2050": {
    "2030": {"strategicMisalignmentScore": X, "marketReadinessScore": Y, "valueCreationScore": Z, "feasibilityScore": W, "overallRisk": R},
    "2040": {"strategicMisalignmentScore": X, "marketReadinessScore": Y, "valueCreationScore": Z, "feasibilityScore": W, "overallRisk": R},
    "2050": {"strategicMisalignmentScore": X, "marketReadinessScore": Y, "valueCreationScore": Z, "feasibilityScore": W, "overallRisk": R}
  },
  ... (repeat for all 7 scenarios: below-2c, delayed-transition, divergent-net-zero, ndcs, current-policies, hot-house-world)
}

Ensure scores remain integers 1-5 and overallRisk is calculated as (strategicMisalignmentScore + marketReadinessScore + valueCreationScore + feasibilityScore) / 4.` : `
Return JSON with this exact structure for Advanced Risk Framework:
{
  "net-zero-2050": {
    "2030": {"exposureScore": X, "vulnerabilityScore": Y, "strategicMisalignmentScore": Z, "mitigationReadinessScore": W, "overallRisk": R},
    "2040": {"exposureScore": X, "vulnerabilityScore": Y, "strategicMisalignmentScore": Z, "mitigationReadinessScore": W, "overallRisk": R},
    "2050": {"exposureScore": X, "vulnerabilityScore": Y, "strategicMisalignmentScore": Z, "mitigationReadinessScore": W, "overallRisk": R}
  },
  ... (repeat for all 7 scenarios: below-2c, delayed-transition, divergent-net-zero, ndcs, current-policies, hot-house-world)
}

Ensure scores remain integers 1-5 and overallRisk is calculated as (exposureScore + vulnerabilityScore + strategicMisalignmentScore + mitigationReadinessScore) / 4.`
) : `
Return JSON with this exact structure for Standard Framework:
{
  "net-zero-2050": {
    "2030": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2040": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2050": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W}
  },
  "below-2c": {
    "2030": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2040": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2050": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W}
  },
  "delayed-transition": {
    "2030": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2040": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2050": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W}
  },
  "divergent-net-zero": {
    "2030": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2040": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2050": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W}
  },
  "ndcs": {
    "2030": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2040": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2050": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W}
  },
  "current-policies": {
    "2030": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2040": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2050": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W}
  },
  "hot-house-world": {
    "2030": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2040": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W},
    "2050": {"impactScore": X, "likelihoodScore": Y, "vulnerabilityScore": Z, "overallRisk": W}
  }
}

Ensure scores remain integers 1-5 and overallRisk is calculated as (impactScore * likelihoodScore * vulnerabilityScore) / 5.`}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const scenarioProjections = JSON.parse(content);
    
    return scenarioProjections;
  } catch (error) {
    console.error("Error generating scenario projections:", error);
    throw error;
  }
}