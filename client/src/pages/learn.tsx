import { ArrowLeft, Leaf, Calendar, Building2, Globe, TrendingUp, FileText, Users, Scale, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function LearnPage() {
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
                <h1 className="text-xl font-semibold text-gray-900">Understanding Climate Transition Risk</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Climate Transition Risk</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding how the shift to a low-carbon economy creates both risks and opportunities for businesses and investors
          </p>
        </div>

        {/* What is Climate Transition Risk */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="w-6 h-6 mr-3 text-primary" />
                What is Climate Transition Risk?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Climate transition risk refers to the financial risks that arise from the process of adjusting to a 
                low-carbon economy. As governments, industries, and consumers shift away from fossil fuels toward 
                cleaner energy sources, businesses face potential disruptions to their operations, supply chains, 
                and market positions.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unlike physical climate risks (such as extreme weather events), transition risks stem from policy 
                changes, technological innovation, shifting consumer preferences, and reputational concerns related 
                to climate action or inaction.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Categories of Transition Risk</h3>
              
              <div className="grid gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900">Policy and Legal Risks</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Carbon pricing mechanisms, emissions regulations, mandated efficiency standards, and climate-related litigation. 
                    Examples include carbon taxes, cap-and-trade systems, and stricter emissions limits.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900">Technology Risks</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Disruption from new low-carbon technologies, costs of transitioning to cleaner systems, and stranded assets. 
                    Electric vehicles disrupting automakers, renewable energy affecting utilities, and energy storage innovations.
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-900">Market Risks</h4>
                  <p className="text-orange-800 text-sm mt-1">
                    Shifts in supply and demand for commodities, products, and services as the economy decarbonizes. 
                    Declining demand for fossil fuels, changing consumer preferences, and new market opportunities.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-900">Reputation Risks</h4>
                  <p className="text-purple-800 text-sm mt-1">
                    Stakeholder perception shifts related to a company's climate action or inaction. 
                    Consumer boycotts, investor divestment, talent attraction challenges, and brand damage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* TCFD History */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Building2 className="w-6 h-6 mr-3 text-primary" />
                The TCFD Framework: History and Evolution
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Origins (2015-2017)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Task Force on Climate-related Financial Disclosures (TCFD) was established in December 2015 by 
                the Financial Stability Board (FSB), an international body that monitors and makes recommendations 
                about the global financial system. The FSB created the TCFD in response to growing concerns that 
                climate change posed systemic risks to the financial system.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Led by Michael Bloomberg (founder of Bloomberg L.P.) and Mark Carney (then Governor of the Bank of England), 
                the 32-member task force included representatives from banks, insurance companies, asset managers, 
                pension funds, large non-financial companies, accounting firms, and credit rating agencies.
              </p>

              <div className="bg-gray-100 p-4 rounded-lg my-6">
                <h4 className="font-semibold text-gray-900 mb-2">Key Milestone: June 2017</h4>
                <p className="text-gray-700 text-sm">
                  The TCFD released its final recommendations, providing a framework for companies to disclose 
                  climate-related financial information across four core areas: Governance, Strategy, Risk Management, 
                  and Metrics & Targets.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">The Four Pillars of TCFD</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    <h4 className="font-semibold text-gray-900">Governance</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    The organization's governance around climate-related risks and opportunities, including board 
                    oversight and management's role.
                  </p>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 mr-2 text-primary" />
                    <h4 className="font-semibold text-gray-900">Strategy</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    The actual and potential impacts of climate risks and opportunities on the organization's 
                    businesses, strategy, and financial planning.
                  </p>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Scale className="w-5 h-5 mr-2 text-primary" />
                    <h4 className="font-semibold text-gray-900">Risk Management</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    How the organization identifies, assesses, and manages climate-related risks, and how these 
                    processes are integrated into overall risk management.
                  </p>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    <h4 className="font-semibold text-gray-900">Metrics & Targets</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    The metrics and targets used to assess and manage relevant climate-related risks and opportunities, 
                    including Scope 1, 2, and 3 emissions.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Evolution and Global Adoption (2017-2023)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Since its release, the TCFD framework has gained unprecedented traction. By 2023, over 4,000 organizations 
                across 100 countries had expressed support for the TCFD recommendations, representing a combined market 
                capitalization of over $25 trillion.
              </p>
              
              <div className="space-y-3 my-6">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">2019:</span>
                    <span className="text-gray-700 ml-2">Japan becomes first country to endorse TCFD for all listed companies</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">2020:</span>
                    <span className="text-gray-700 ml-2">UK announces mandatory TCFD-aligned reporting by 2025</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">2021:</span>
                    <span className="text-gray-700 ml-2">G7 nations commit to mandatory climate disclosures; New Zealand mandates TCFD</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">2022:</span>
                    <span className="text-gray-700 ml-2">SEC proposes climate disclosure rules based on TCFD; EU incorporates into CSRD</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">2023:</span>
                    <span className="text-gray-700 ml-2">ISSB releases IFRS S1 and S2 standards, building on TCFD framework</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">From TCFD to ISSB (2023-Present)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In October 2023, the TCFD was officially disbanded, with its monitoring responsibilities transferred to 
                the IFRS Foundation. This marked the successful completion of the TCFD's mission—the framework had become 
                so widely adopted that it was incorporated into global baseline sustainability standards.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The International Sustainability Standards Board (ISSB), established in 2021, released its inaugural 
                standards (IFRS S1 and IFRS S2) in June 2023. These standards fully incorporate the TCFD recommendations 
                and are designed to create a global baseline for sustainability-related financial disclosures.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-6">
                <h4 className="font-semibold text-blue-900">The Legacy of TCFD</h4>
                <p className="text-blue-800 text-sm mt-1">
                  The TCFD succeeded in its primary mission: making climate-related financial disclosure mainstream. 
                  Its framework now underpins regulatory requirements across major economies and has fundamentally 
                  changed how businesses communicate climate risks to investors and stakeholders.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Climate Scenarios */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <TrendingUp className="w-6 h-6 mr-3 text-primary" />
                Climate Scenario Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A key component of the TCFD framework is scenario analysis—exploring how different climate futures 
                might affect an organization. The TCFD recommends analyzing at least two scenarios: one aligned with 
                limiting warming to 2°C or below, and one reflecting current policies.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">NGFS Climate Scenarios</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Network for Greening the Financial System (NGFS) has developed a set of climate scenarios 
                specifically designed for financial risk assessment. These scenarios, now in Phase V (November 2024), 
                are widely used by central banks, regulators, and financial institutions.
              </p>

              <div className="grid gap-4 mt-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Orderly Scenarios</h4>
                  <p className="text-green-800 text-sm mt-1">
                    <strong>Net Zero 2050 & Below 2°C:</strong> Early, coordinated policy action leads to smooth transition. 
                    Lower physical and transition risks, but requires significant near-term investment.
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Disorderly Scenarios</h4>
                  <p className="text-yellow-800 text-sm mt-1">
                    <strong>Delayed Transition & Divergent Net Zero:</strong> Late or uncoordinated action leads to higher 
                    transition risks. Sudden policy changes create market disruption and stranded assets.
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900">Hot House World Scenarios</h4>
                  <p className="text-red-800 text-sm mt-1">
                    <strong>Nationally Determined Contributions & Current Policies:</strong> Limited additional action leads 
                    to severe physical risks. Warming of 2.5-3°C+ by 2100 with catastrophic long-term consequences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why It Matters */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                Why Climate Transition Risk Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">For Businesses</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Identify vulnerabilities in operations and supply chains
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Discover new market opportunities in the low-carbon economy
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Prepare for regulatory changes and policy shifts
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Enhance resilience through strategic planning
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Attract capital from sustainability-focused investors
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">For Investors</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Better understand portfolio exposure to climate risks
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Make informed capital allocation decisions
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Engage with companies on transition planning
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Comply with fiduciary duties and regulations
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Identify companies positioned for the transition
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">The Economic Stakes</h3>
                <p className="text-gray-700 mb-4">
                  The transition to a low-carbon economy represents one of the largest economic transformations in history. 
                  According to various estimates:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Over $130 trillion in investment needed globally by 2050 for net-zero</li>
                  <li>• Potential $23 trillion in annual clean energy market by 2030</li>
                  <li>• $2.5 trillion in fossil fuel assets at risk of becoming stranded</li>
                  <li>• Climate-related financial losses could exceed $4 trillion by 2030 without action</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Get Started */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Assess Your Climate Risk?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our AI-powered platform to analyze your organization's exposure to climate transition risks 
                and discover opportunities in the low-carbon economy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/assessment">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Start New Assessment
                  </Button>
                </Link>
                <Link href="/ngfs">
                  <Button size="lg" variant="outline">
                    Explore NGFS Scenarios
                  </Button>
                </Link>
                <Link href="/sector-intelligence">
                  <Button size="lg" variant="outline">
                    View Sector Intelligence
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
