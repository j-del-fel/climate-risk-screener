import { type User, type InsertUser, type Assessment, type InsertAssessment, type RiskAssessment, type InsertRiskAssessment, type Question, type InsertQuestion, type AssessmentAnswer, type InsertAssessmentAnswer, type CompanyDependency, type InsertCompanyDependency } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Assessment methods
  getAssessment(id: string): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: string, assessment: Partial<Assessment>): Promise<Assessment | undefined>;
  getAssessmentsByUser(userId: string): Promise<Assessment[]>;

  // Risk Assessment methods
  getRiskAssessments(assessmentId: string): Promise<RiskAssessment[]>;
  createRiskAssessment(riskAssessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: string, riskAssessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined>;

  // Question methods
  getQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Assessment Answer methods
  getAssessmentAnswers(assessmentId: string): Promise<AssessmentAnswer[]>;
  createAssessmentAnswer(answer: InsertAssessmentAnswer): Promise<AssessmentAnswer>;

  // Company Dependencies methods
  getCompanyDependencies(filters?: { sector?: string; naicsCode?: string; search?: string }): Promise<CompanyDependency[]>;
  getCompanyDependency(id: string): Promise<CompanyDependency | undefined>;
  createCompanyDependency(dep: InsertCompanyDependency): Promise<CompanyDependency>;
  updateCompanyDependency(id: string, dep: Partial<CompanyDependency>): Promise<CompanyDependency | undefined>;
  deleteCompanyDependency(id: string): Promise<boolean>;
  getCompanyDependencyCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assessments: Map<string, Assessment>;
  private companyDeps: Map<string, CompanyDependency>;
  private riskAssessments: Map<string, RiskAssessment>;
  private questions: Map<string, Question>;
  private assessmentAnswers: Map<string, AssessmentAnswer>;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.companyDeps = new Map();
    this.riskAssessments = new Map();
    this.questions = new Map();
    this.assessmentAnswers = new Map();
    this.initializeDefaultQuestions();
  }

  private initializeDefaultQuestions() {
    const defaultQuestions: InsertQuestion[] = [
      {
        questionText: "What is your organization's primary industry sector?",
        questionType: "multiple_choice",
        category: "business_context",
        order: 1,
        options: [
          { value: "oil_gas", label: "Oil & Gas", risk: "high", description: "High carbon intensity, significant transition risk exposure" },
          { value: "technology", label: "Technology", risk: "low", description: "Lower direct emissions, opportunity for climate solutions" },
          { value: "manufacturing", label: "Manufacturing", risk: "medium", description: "Variable risk depending on energy intensity and materials" },
          { value: "financial", label: "Financial Services", risk: "medium", description: "Indirect exposure through lending and investment portfolios" },
          { value: "real_estate", label: "Real Estate", risk: "medium", description: "Physical risk exposure and energy efficiency requirements" },
          { value: "agriculture", label: "Agriculture", risk: "high", description: "High exposure to physical climate risks" }
        ]
      },
      {
        questionText: "What is your organization's annual revenue?",
        questionType: "multiple_choice",
        category: "business_context",
        order: 2,
        options: [
          { value: "under_10m", label: "Under $10M" },
          { value: "10m_100m", label: "$10M - $100M" },
          { value: "100m_1b", label: "$100M - $1B" },
          { value: "over_1b", label: "Over $1B" }
        ]
      },
      {
        questionText: "In which geographic regions does your organization operate?",
        questionType: "multiple_choice",
        category: "geographic_exposure",
        order: 3,
        options: [
          { value: "north_america", label: "North America" },
          { value: "europe", label: "Europe" },
          { value: "asia_pacific", label: "Asia Pacific" },
          { value: "latin_america", label: "Latin America" },
          { value: "africa", label: "Africa" },
          { value: "middle_east", label: "Middle East" }
        ]
      },
      {
        questionText: "What is your organization's carbon intensity level?",
        questionType: "multiple_choice",
        category: "emissions_profile",
        order: 4,
        options: [
          { value: "very_high", label: "Very High (>500 tCO2e/revenue)", multiplier: 2.0 },
          { value: "high", label: "High (100-500 tCO2e/revenue)", multiplier: 1.5 },
          { value: "medium", label: "Medium (50-100 tCO2e/revenue)", multiplier: 1.0 },
          { value: "low", label: "Low (<50 tCO2e/revenue)", multiplier: 0.7 },
          { value: "unknown", label: "Unknown/Not Measured", multiplier: 1.2 }
        ]
      }
    ];

    defaultQuestions.forEach(question => {
      const id = randomUUID();
      this.questions.set(id, { ...question, id, options: question.options || null });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const now = new Date();
    const assessment: Assessment = { 
      ...insertAssessment, 
      id,
      userId: null,
      currentStep: insertAssessment.currentStep ?? 1,
      isComplete: insertAssessment.isComplete ?? false,
      createdAt: now,
      updatedAt: now
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: string, updateData: Partial<Assessment>): Promise<Assessment | undefined> {
    const existing = this.assessments.get(id);
    if (!existing) return undefined;
    
    const updated: Assessment = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.assessments.set(id, updated);
    return updated;
  }

  async getAssessmentsByUser(userId: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      (assessment) => assessment.userId === userId
    );
  }

  async getRiskAssessments(assessmentId: string): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values()).filter(
      (risk) => risk.assessmentId === assessmentId
    );
  }

  async createRiskAssessment(insertRiskAssessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = randomUUID();
    const riskAssessment: RiskAssessment = { 
      ...insertRiskAssessment, 
      id,
      impactScore: insertRiskAssessment.impactScore ?? null,
      likelihoodScore: insertRiskAssessment.likelihoodScore ?? null,
      vulnerabilityScore: insertRiskAssessment.vulnerabilityScore ?? null,
      timeHorizon: insertRiskAssessment.timeHorizon ?? null,
      overallRisk: insertRiskAssessment.overallRisk ?? null,
      narrative: insertRiskAssessment.narrative ?? null,
      reasoning: insertRiskAssessment.reasoning ?? null,
      peerComparison: insertRiskAssessment.peerComparison ?? null,
      sources: insertRiskAssessment.sources ?? null,
      isAiGenerated: insertRiskAssessment.isAiGenerated ?? false,
      updatedAt: new Date()
    };
    this.riskAssessments.set(id, riskAssessment);
    return riskAssessment;
  }

  async updateRiskAssessment(id: string, updateData: Partial<RiskAssessment>): Promise<RiskAssessment | undefined> {
    const existing = this.riskAssessments.get(id);
    if (!existing) return undefined;
    
    const updated: RiskAssessment = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.riskAssessments.set(id, updated);
    return updated;
  }

  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => a.order - b.order);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = { ...insertQuestion, id, options: insertQuestion.options || null };
    this.questions.set(id, question);
    return question;
  }

  async getAssessmentAnswers(assessmentId: string): Promise<AssessmentAnswer[]> {
    return Array.from(this.assessmentAnswers.values()).filter(
      (answer) => answer.assessmentId === assessmentId
    );
  }

  async createAssessmentAnswer(insertAnswer: InsertAssessmentAnswer): Promise<AssessmentAnswer> {
    const id = randomUUID();
    const answer: AssessmentAnswer = { 
      ...insertAnswer, 
      id,
      createdAt: new Date()
    };
    this.assessmentAnswers.set(id, answer);
    return answer;
  }
  async getCompanyDependencies(filters?: { sector?: string; naicsCode?: string; search?: string }): Promise<CompanyDependency[]> {
    let results = Array.from(this.companyDeps.values());
    if (filters?.sector) {
      results = results.filter(c => c.sector.toLowerCase() === filters.sector!.toLowerCase());
    }
    if (filters?.naicsCode) {
      results = results.filter(c => c.naicsCode.startsWith(filters.naicsCode!));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(c =>
        c.companyName.toLowerCase().includes(q) ||
        (c.ticker?.toLowerCase().includes(q)) ||
        c.sector.toLowerCase().includes(q) ||
        (c.naicsDescription?.toLowerCase().includes(q))
      );
    }
    return results.sort((a, b) => a.companyName.localeCompare(b.companyName));
  }

  async getCompanyDependency(id: string): Promise<CompanyDependency | undefined> {
    return this.companyDeps.get(id);
  }

  async createCompanyDependency(dep: InsertCompanyDependency): Promise<CompanyDependency> {
    const id = randomUUID();
    const company: CompanyDependency = {
      id,
      companyName: dep.companyName,
      ticker: dep.ticker ?? null,
      naicsCode: dep.naicsCode,
      naicsDescription: dep.naicsDescription ?? null,
      sector: dep.sector,
      subsector: dep.subsector ?? null,
      hqState: dep.hqState ?? null,
      hqRegion: dep.hqRegion ?? "US",
      revenueRange: dep.revenueRange ?? null,
      employees: dep.employees ?? null,
      materialDependencies: dep.materialDependencies ?? [],
      energyDependencies: dep.energyDependencies ?? [],
      waterDependency: dep.waterDependency ?? {},
      geographicDependencies: dep.geographicDependencies ?? [],
      supplyChainNotes: dep.supplyChainNotes ?? null,
      climateRiskExposure: dep.climateRiskExposure ?? null,
      sources: dep.sources ?? null,
    };
    this.companyDeps.set(id, company);
    return company;
  }

  async updateCompanyDependency(id: string, updateData: Partial<CompanyDependency>): Promise<CompanyDependency | undefined> {
    const existing = this.companyDeps.get(id);
    if (!existing) return undefined;
    const updated: CompanyDependency = { ...existing, ...updateData };
    this.companyDeps.set(id, updated);
    return updated;
  }

  async deleteCompanyDependency(id: string): Promise<boolean> {
    return this.companyDeps.delete(id);
  }

  async getCompanyDependencyCount(): Promise<number> {
    return this.companyDeps.size;
  }
}

export const storage = new MemStorage();
