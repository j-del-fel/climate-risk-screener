import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import NGFSPage from "@/pages/ngfs";
import FinancialImpactPage from "@/pages/financial-impact";
import SectorIntelligencePage from "@/pages/sector-intelligence";
import EconomicDataPage from "@/pages/economic-data";
import LcaDataPage from "@/pages/lca-data";
import LcaEducationPage from "@/pages/lca-education";
import CarbonPricingPage from "@/pages/carbon-pricing";
import LearnPage from "@/pages/learn";
import MethodologyPage from "@/pages/methodology";
import PhysicalRiskPage from "@/pages/physical-risk";
import ReputationalRiskPage from "@/pages/reputational-risk";
import SupplyChainPage from "@/pages/supply-chain";
import EcologicalEconomicsPage from "@/pages/ecological-economics";
import EcologicalRiskPage from "@/pages/ecological-risk";
import TnfdEducationPage from "@/pages/tnfd-education";
import TcfdRiskPage from "@/pages/tcfd-risk";
import TnfdRiskPage from "@/pages/tnfd-risk";
import CsrdEducationPage from "@/pages/csrd-education";
import CsrdReportPage from "@/pages/csrd-report";
import TcfdReportPage from "@/pages/tcfd-report";
import TnfdReportPage from "@/pages/tnfd-report";
import SecFilingsPage from "@/pages/sec-filings";
import CompanyDependenciesPage from "@/pages/company-dependencies";
import MunicipalRiskPage from "@/pages/municipal-risk";
import AgProgramsPage from "@/pages/ag-programs";
import LcaCalculatorPage from "@/pages/lca-calculator";
import TrlPage from "@/pages/trl";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/assessment/:id" component={Assessment} />
      <Route path="/ngfs" component={NGFSPage} />
      <Route path="/financial-impact" component={FinancialImpactPage} />
      <Route path="/financial-impact/:id" component={FinancialImpactPage} />
      <Route path="/sector-intelligence" component={SectorIntelligencePage} />
      <Route path="/economic-data" component={EconomicDataPage} />
      <Route path="/lca-data" component={LcaDataPage} />
      <Route path="/lca-education" component={LcaEducationPage} />
      <Route path="/carbon-pricing" component={CarbonPricingPage} />
      <Route path="/physical-risk" component={PhysicalRiskPage} />
      <Route path="/reputational-risk" component={ReputationalRiskPage} />
      <Route path="/supply-chain" component={SupplyChainPage} />
      <Route path="/ecological-economics" component={EcologicalEconomicsPage} />
      <Route path="/ecological-risk" component={EcologicalRiskPage} />
      <Route path="/tnfd-education" component={TnfdEducationPage} />
      <Route path="/tnfd-risk" component={TnfdRiskPage} />
      <Route path="/tcfd-risk" component={TcfdRiskPage} />
      <Route path="/csrd-education" component={CsrdEducationPage} />
      <Route path="/csrd-report" component={CsrdReportPage} />
      <Route path="/tcfd-report" component={TcfdReportPage} />
      <Route path="/tnfd-report" component={TnfdReportPage} />
      <Route path="/sec-filings" component={SecFilingsPage} />
      <Route path="/company-dependencies" component={CompanyDependenciesPage} />
      <Route path="/municipal-risk" component={MunicipalRiskPage} />
      <Route path="/ag-programs" component={AgProgramsPage} />
      <Route path="/lca-calculator" component={LcaCalculatorPage} />
      <Route path="/trl" component={TrlPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/methodology" component={MethodologyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
