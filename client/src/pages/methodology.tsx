import { ArrowLeft, Leaf, Calculator, Database, LineChart, Target, Scale, Layers, BarChart3, Globe, Zap, Factory, TrendingUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MethodologyPage() {
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
                <Leaf className="text-secondary text-xl" />
                <h1 className="text-xl font-semibold text-gray-900">Methodology & Data Sources</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Methodology & Data Sources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A complete guide to the scoring frameworks, analytical methods, and authoritative data sources 
            that power our climate risk assessments
          </p>
        </div>

        <Tabs defaultValue="scoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scoring">Risk Scoring</TabsTrigger>
            <TabsTrigger value="financial">Financial Impact</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="data">Data Sources</TabsTrigger>
          </TabsList>

          {/* Risk Scoring Methodology */}
          <TabsContent value="scoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Calculator className="w-6 h-6 mr-3 text-primary" />
                  Risk Scoring Methodology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Our platform offers two assessment frameworks to evaluate climate-related risks and opportunities. 
                  Both frameworks use a 1-5 scoring scale where higher scores indicate greater risk exposure or 
                  opportunity potential.
                </p>

                {/* Standard Framework */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary" />
                    Standard Framework
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The standard framework provides a straightforward assessment using three core metrics 
                    that align with traditional risk management practices.
                  </p>
                  
                  <div className="grid gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">Impact Score (1-5)</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Measures the potential magnitude of financial, operational, or strategic consequences 
                        if the risk materializes. Score 1 = minimal impact; Score 5 = severe, potentially 
                        existential impact.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">Likelihood Score (1-5)</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Assesses the probability that the risk will occur within the assessment time horizon. 
                        Score 1 = rare occurrence; Score 5 = almost certain to occur.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">Vulnerability Score (1-5)</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Evaluates the organization's current susceptibility to the risk based on existing 
                        defenses, dependencies, and resilience measures. Score 1 = well protected; 
                        Score 5 = highly vulnerable.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900">Residual Risk Calculation</h4>
                    <p className="text-blue-800 text-sm mt-1">
                      <code className="bg-blue-100 px-2 py-1 rounded">
                        Residual Risk = w₁ × Likelihood + w₂ × Impact + w₃ × Vulnerability
                      </code>
                      <br />
                      Where w₁, w₂, and w₃ are <strong>sector-dependent weightings</strong> that vary by industry and risk category.
                    </p>
                  </div>
                </div>

                {/* Sector-Dependent Weightings */}
                <div className="border rounded-lg p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Scale className="w-5 h-5 mr-2 text-amber-600" />
                    Sector-Dependent Weightings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Different sectors face different types of climate risks. Our methodology applies 
                    sector-specific weightings that reflect the unique risk profile of each industry.
                    Weights always sum to 1.0 for each sector/category combination.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-amber-100">
                          <th className="border border-amber-200 px-3 py-2 text-left font-semibold">Sector</th>
                          <th className="border border-amber-200 px-3 py-2 text-left font-semibold">Risk Category</th>
                          <th className="border border-amber-200 px-3 py-2 text-center font-semibold">w₁ (Likelihood)</th>
                          <th className="border border-amber-200 px-3 py-2 text-center font-semibold">w₂ (Impact)</th>
                          <th className="border border-amber-200 px-3 py-2 text-center font-semibold">w₃ (Vulnerability)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Energy Sector */}
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2 font-medium" rowSpan={5}>Energy</td>
                          <td className="border border-amber-200 px-3 py-2">Policy / Legal</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.40</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Technology</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.40</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Market</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.37</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Reputation</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.40</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Physical</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                        </tr>

                        {/* Manufacturing Sector */}
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2 font-medium" rowSpan={5}>Manufacturing</td>
                          <td className="border border-amber-200 px-3 py-2">Policy / Legal</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Technology</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.38</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Market</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.36</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Reputation</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.37</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Physical</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.28</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.40</td>
                        </tr>

                        {/* Agriculture Sector */}
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2 font-medium" rowSpan={5}>Agriculture</td>
                          <td className="border border-amber-200 px-3 py-2">Policy / Legal</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.37</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Technology</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Market</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.28</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.42</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Reputation</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.34</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Physical</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.22</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.48</td>
                        </tr>

                        {/* Technology Sector */}
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2 font-medium" rowSpan={5}>Technology</td>
                          <td className="border border-amber-200 px-3 py-2">Policy / Legal</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.40</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.32</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.28</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Technology</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.38</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.37</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.25</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Market</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.38</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.27</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Reputation</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.38</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.37</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.25</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Physical</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.38</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.27</td>
                        </tr>

                        {/* Food & Beverage Sector */}
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2 font-medium" rowSpan={5}>Food & Beverage</td>
                          <td className="border border-amber-200 px-3 py-2">Policy / Legal</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.37</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.28</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Technology</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.35</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Market</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.37</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.33</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="border border-amber-200 px-3 py-2">Reputation</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.43</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.27</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-amber-200 px-3 py-2">Physical</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.28</td>
                          <td className="border border-amber-200 px-3 py-2 text-center">0.30</td>
                          <td className="border border-amber-200 px-3 py-2 text-center text-amber-700 font-medium">0.42</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900 mb-2">Why Sector-Specific Weights?</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• <strong>Energy:</strong> Higher impact weights for policy/technology risks due to regulatory exposure and stranded asset risk</li>
                        <li>• <strong>Manufacturing:</strong> Higher vulnerability weights for supply chain and physical risks</li>
                        <li>• <strong>Agriculture:</strong> Higher vulnerability weights due to direct physical climate exposure</li>
                        <li>• <strong>Technology:</strong> Higher likelihood weights across all categories due to rapid change</li>
                        <li>• <strong>Food & Beverage:</strong> Higher impact weights for reputation and market risks</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900 mb-2">Subcategory Granularity</h4>
                      <p className="text-gray-600 text-sm">
                        Weights are further refined at the subcategory level. For example, within the Energy 
                        sector's Policy/Legal category, "Carbon pricing" uses different weights than "Litigation risk" 
                        to reflect the different nature of these risk drivers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advanced Framework */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-primary" />
                    Advanced Framework
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The advanced framework provides deeper analysis with additional metrics that capture 
                    strategic alignment and preparedness dimensions.
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-3">For Risks:</h4>
                  <div className="grid gap-3 mb-6">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-gray-900">Exposure Score</h5>
                      <p className="text-gray-600 text-sm">Degree of business operations exposed to the risk driver.</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-gray-900">Strategic Misalignment Score</h5>
                      <p className="text-gray-600 text-sm">Gap between current strategy and required transition pathway.</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-gray-900">Mitigation Readiness Score</h5>
                      <p className="text-gray-600 text-sm">Organization's preparedness to address and mitigate the risk.</p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">For Opportunities:</h4>
                  <div className="grid gap-3">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-gray-900">Market Readiness Score</h5>
                      <p className="text-gray-600 text-sm">Market maturity and demand for the opportunity.</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-gray-900">Value Creation Score</h5>
                      <p className="text-gray-600 text-sm">Potential financial and strategic value that can be captured.</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-gray-900">Feasibility Score</h5>
                      <p className="text-gray-600 text-sm">Technical and organizational capability to pursue the opportunity.</p>
                    </div>
                  </div>
                </div>

                {/* AI Enhancement */}
                <div className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-600" />
                    AI-Enhanced Analysis
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Our platform uses advanced AI (GPT-5) to generate comprehensive risk narratives and 
                    scoring recommendations. The AI considers:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Company-specific context and business model
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Industry sector characteristics and benchmarks
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Real sector emissions and economic data
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      NGFS scenario implications for the specific sector
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Peer comparison and industry best practices
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Impact Methodology */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <BarChart3 className="w-6 h-6 mr-3 text-primary" />
                  Financial Impact Methodology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  The Financial Impact Analysis module quantifies the potential economic consequences of 
                  climate transition across different scenarios. Our approach combines sector-level macroeconomic 
                  projections with company-specific risk assessments.
                </p>

                <div className="grid gap-6">
                  {/* GDP Impact */}
                  <div className="border rounded-lg p-5 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      GDP Impact Projections
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Measures the percentage deviation from baseline GDP under each climate scenario, 
                      derived from Integrated Assessment Models (IAMs).
                    </p>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-2">Calculation Approach</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Sector-specific GDP multipliers from NGFS Phase V data</li>
                        <li>• Time-horizon adjustments (2030, 2040, 2050)</li>
                        <li>• Input-output relationships between sectors</li>
                        <li>• Regional economic dependency factors</li>
                      </ul>
                    </div>
                  </div>

                  {/* Carbon Price */}
                  <div className="border rounded-lg p-5 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-orange-600" />
                      Carbon Price Trajectories
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Projects the cost of carbon emissions (USD per tonne CO2) under different policy scenarios.
                    </p>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-2">Scenario Ranges</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Net Zero 2050:</span>
                          <span className="text-gray-600 ml-2">$180-$450/tCO2 by 2050</span>
                        </div>
                        <div>
                          <span className="font-medium">Current Policies:</span>
                          <span className="text-gray-600 ml-2">$15-$35/tCO2 by 2050</span>
                        </div>
                        <div>
                          <span className="font-medium">Delayed Transition:</span>
                          <span className="text-gray-600 ml-2">$50-$600/tCO2 (shock)</span>
                        </div>
                        <div>
                          <span className="font-medium">Below 2°C:</span>
                          <span className="text-gray-600 ml-2">$120-$280/tCO2 by 2050</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stranded Assets */}
                  <div className="border rounded-lg p-5 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Factory className="w-5 h-5 mr-2 text-red-600" />
                      Stranded Asset Risk
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Estimates the percentage of sector assets at risk of becoming economically unviable 
                      before the end of their useful life due to climate transition.
                    </p>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-2">Assessment Factors</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Asset carbon intensity and remaining useful life</li>
                        <li>• Policy trajectory and regulatory stringency</li>
                        <li>• Technology substitution pace</li>
                        <li>• Demand shifts for carbon-intensive products</li>
                        <li>• Geographic and jurisdictional exposure</li>
                      </ul>
                    </div>
                  </div>

                  {/* Investment Requirements */}
                  <div className="border rounded-lg p-5 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                      Investment Requirements
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Estimates the capital investment needed for sector transition (USD billions).
                    </p>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-2">Investment Categories</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Clean technology deployment and R&D</li>
                        <li>• Infrastructure modernization</li>
                        <li>• Workforce retraining and transition</li>
                        <li>• Carbon capture and storage capacity</li>
                        <li>• Supply chain decarbonization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scenario Analysis */}
          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Globe className="w-6 h-6 mr-3 text-primary" />
                  Climate Scenario Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Our scenario analysis uses the NGFS (Network for Greening the Financial System) Phase V 
                  scenarios, released in November 2024. These scenarios represent the most comprehensive 
                  and widely-used framework for climate financial risk assessment.
                </p>

                {/* NGFS Scenarios */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">NGFS Scenario Framework</h3>
                  
                  <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900 mb-2">Orderly Scenarios</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-green-800">Net Zero 2050</h5>
                        <p className="text-green-700 text-sm">
                          Ambitious early action with immediate policy implementation. Limits warming to 1.5°C 
                          with 50% probability. Carbon prices reach $180/tCO2 by 2030, $450/tCO2 by 2050.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-800">Below 2°C</h5>
                        <p className="text-green-700 text-sm">
                          Gradual strengthening of policies. Limits warming to 2°C with 67% probability. 
                          More moderate but steady transition pathway.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-yellow-900 mb-2">Disorderly Scenarios</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-yellow-800">Delayed Transition</h5>
                        <p className="text-yellow-700 text-sm">
                          Annual emissions do not decrease until 2030. Strong policies then implemented suddenly, 
                          creating market shocks and stranded assets. Higher transition risk.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-yellow-800">Divergent Net Zero</h5>
                        <p className="text-yellow-700 text-sm">
                          Reaches net zero by 2050 but with higher costs due to divergent policies across sectors 
                          and regions. Some sectors face more rapid changes than others.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-semibold text-red-900 mb-2">Hot House World Scenarios</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-red-800">Nationally Determined Contributions (NDCs)</h5>
                        <p className="text-red-700 text-sm">
                          All pledged policies are implemented but no further action. Results in approximately 
                          2.5°C warming by 2100. Significant physical risks emerge.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-800">Current Policies</h5>
                        <p className="text-red-700 text-sm">
                          Only currently implemented policies continue. Results in 3°C+ warming. Severe physical 
                          risks and economic damages, but minimal transition risk.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-800">Fragmented World</h5>
                        <p className="text-red-700 text-sm">
                          Countries pursue independent policies with limited international cooperation. 
                          Inefficient transition with both high transition and physical risks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IAM Models */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrated Assessment Models (IAMs)</h3>
                  <p className="text-gray-600 mb-4">
                    NGFS scenarios are generated using multiple IAMs, each with different assumptions 
                    and methodologies. Our platform includes data from:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">REMIND-MAgPIE</h4>
                      <p className="text-gray-600 text-sm">
                        Potsdam Institute for Climate Impact Research. Strong focus on energy system 
                        transformation and land-use interactions.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">MESSAGEix-GLOBIOM</h4>
                      <p className="text-gray-600 text-sm">
                        International Institute for Applied Systems Analysis (IIASA). Detailed energy 
                        supply modeling with economic optimization.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">GCAM</h4>
                      <p className="text-gray-600 text-sm">
                        Pacific Northwest National Laboratory. Comprehensive coverage of energy, 
                        agriculture, and land-use systems.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">NiGEM</h4>
                      <p className="text-gray-600 text-sm">
                        National Institute Global Econometric Model. Focus on macroeconomic impacts 
                        and financial system interactions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time Horizons */}
                <div className="border rounded-lg p-5 bg-blue-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Time Horizons</h3>
                  <p className="text-gray-600 mb-4">
                    Our scenario projections cover three key time horizons aligned with TCFD recommendations:
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-4 rounded border">
                      <div className="text-2xl font-bold text-primary">2030</div>
                      <div className="text-gray-600 text-sm">Short-term</div>
                      <div className="text-gray-500 text-xs mt-1">Policy implementation phase</div>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <div className="text-2xl font-bold text-primary">2040</div>
                      <div className="text-gray-600 text-sm">Medium-term</div>
                      <div className="text-gray-500 text-xs mt-1">Transition acceleration</div>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <div className="text-2xl font-bold text-primary">2050</div>
                      <div className="text-gray-600 text-sm">Long-term</div>
                      <div className="text-gray-500 text-xs mt-1">Net-zero target year</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Database className="w-6 h-6 mr-3 text-primary" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Our platform integrates data from authoritative global sources to ensure accuracy, 
                  reliability, and comprehensive coverage of climate-related financial information.
                </p>

                {/* Climate Scenario Data */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-green-600" />
                    Climate Scenario Data
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">NGFS (Network for Greening the Financial System)</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Phase V - Nov 2024</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Central banks and supervisors climate scenarios for financial risk assessment.
                      </p>
                      <div className="text-xs text-gray-500">
                        <strong>Variables:</strong> Temperature, Carbon Price, GDP Impact, Energy Demand, 
                        Renewable Share, Fossil Fuel Demand, CO2 Emissions
                      </div>
                      <a href="https://www.ngfs.net/ngfs-scenarios-portal/" target="_blank" rel="noopener noreferrer" 
                         className="text-primary text-sm hover:underline mt-2 inline-block">
                        NGFS Scenarios Portal →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Emissions Data */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Factory className="w-5 h-5 mr-2 text-orange-600" />
                    Emissions & Sector Data
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">Climate TRACE</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Independent global inventory of greenhouse gas emissions using satellite data 
                        and AI. Provides facility-level and sector-level emissions data.
                      </p>
                      <div className="text-xs text-gray-500">
                        <strong>Used for:</strong> Sector emissions profiles, emissions intensity, 
                        emissions trends
                      </div>
                      <a href="https://climatetrace.org/" target="_blank" rel="noopener noreferrer" 
                         className="text-primary text-sm hover:underline mt-2 inline-block">
                        Climate TRACE →
                      </a>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">IEA (International Energy Agency)</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Global energy statistics, projections, and analysis. 2024 data release.
                      </p>
                      <div className="text-xs text-gray-500">
                        <strong>Used for:</strong> Energy consumption, renewable deployment, fossil fuel 
                        demand projections
                      </div>
                      <a href="https://www.iea.org/" target="_blank" rel="noopener noreferrer" 
                         className="text-primary text-sm hover:underline mt-2 inline-block">
                        IEA Data →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Economic Data */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Economic Data Sources
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">FRED (Federal Reserve)</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Economic data from the Federal Reserve Bank of St. Louis.
                      </p>
                      <div className="text-xs text-gray-500">
                        Oil prices (WTI), Natural gas, GDP, Industrial production, 
                        Manufacturing employment, Energy CPI
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">BEA (Bureau of Economic Analysis)</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        US Department of Commerce economic accounts.
                      </p>
                      <div className="text-xs text-gray-500">
                        GDP by industry, Personal income, Government expenditures
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">IMF (International Monetary Fund)</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        International Financial Statistics database.
                      </p>
                      <div className="text-xs text-gray-500">
                        Consumer Price Index, Real GDP, Exchange rates, Current account
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">OECD</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Organisation for Economic Co-operation and Development statistics.
                      </p>
                      <div className="text-xs text-gray-500">
                        Consumer prices, GDP, Industrial production, Unemployment
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">World Bank</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Global development indicators and economic data.
                      </p>
                      <div className="text-xs text-gray-500">
                        GDP contribution by sector, Employment statistics, Value added
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">DBnomics</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Aggregated economic data from multiple providers including Eurostat.
                      </p>
                      <div className="text-xs text-gray-500">
                        EU GHG emissions, World energy production, Energy supply
                      </div>
                    </div>
                  </div>
                </div>

                {/* Government Data */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Scale className="w-5 h-5 mr-2 text-purple-600" />
                    Government & Regulatory Data
                  </h3>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-900">Data.gov</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      US government open data portal with energy, emissions, and economic datasets.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Used for:</strong> Energy consumption statistics, US emissions data, 
                      Economic indicators
                    </div>
                  </div>
                </div>

                {/* Data Update Policy */}
                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Data Currency & Updates
                  </h3>
                  <p className="text-blue-800 text-sm">
                    <strong>NGFS Data:</strong> Phase V (November 2024) - Updated annually with NGFS releases<br />
                    <strong>Sector Data:</strong> Latest available from Climate TRACE, World Bank, and IEA<br />
                    <strong>Economic Indicators:</strong> Real-time when API keys configured; sample data otherwise<br />
                    <strong>Note:</strong> Some data sources require API keys for live data access. 
                    The platform provides representative sample data when keys are not configured.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Assessment */}
        <div className="mt-8 text-center">
          <Link href="/assessment">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Using These Methods in an Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
