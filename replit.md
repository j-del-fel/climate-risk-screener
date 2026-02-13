# Climate Risk Screener

## Overview

The Climate Risk Screener is a platform designed to assess climate-related financial risks and opportunities based on the TCFD framework. It provides AI-powered research, automated scoring, and detailed assessments to help organizations understand their climate risk exposure across transition risks, physical risks, and climate opportunities. The platform integrates economic, LCA, and climate data to offer comprehensive insights for various sectors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript and Vite.
- **UI Components**: Shadcn/ui built on Radix UI, styled with Tailwind CSS.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **Form Handling**: React Hook Form with Zod validation.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript.
- **API Design**: RESTful API for assessments, risk analysis, questions, and answers.
- **Data Validation**: Zod schemas shared across frontend and backend.
- **AI Integration**: OpenAI API for climate risk analysis and assessment generation.

### Database
- **Database**: PostgreSQL with Neon serverless service.
- **ORM**: Drizzle ORM for type-safe operations.
- **Schema**: Tables for users, assessments, risk assessments, questions, answers, sector profiles, sector scenarios, and NGFS time series data.
- **Data Storage**: In-memory for assessments; database-backed for sector intelligence, NGFS scenarios, economic data, and LCA data.

### Authentication and Security
- **Session Management**: Express sessions with PostgreSQL store.
- **Data Validation**: Server-side validation using Zod.
- **Type Safety**: End-to-end TypeScript.

### Risk Assessment Framework
- **TCFD Alignment**: Categories cover transition risks, physical risks, and opportunities.
- **Scoring System**: Numerical impact and likelihood scoring (1-5 scale) with calculated overall risk scores.
- **AI Analysis**: Automated narrative generation based on business context and industry data.
- **Time Horizons**: Short, medium, and long-term assessment.

### Economic Data Integration
- **Data Sources**: FRED, BEA, IMF, OECD, DBnomics, Data.gov.
- **Caching**: PostgreSQL `economic_data` table with 24-hour cache validity.
- **Features**: Economic Data Explorer, sector-relevant indicators in Sector Intelligence.

### LCA Data Integration
- **Data Source**: Federal LCA Commons API.
- **Caching**: PostgreSQL `lca_data` table with 1-week cache validity.
- **Features**: Searchable emission factors by material/process, repository filtering.

### LCA Education
- **LCA Education Page**: `/lca-education` - Comprehensive learning page covering ISO 14040/14044 methodology, system boundaries (cradle-to-gate, cradle-to-grave, cradle-to-cradle, gate-to-gate), environmental impact categories (GWP, AP, EP, ODP, ADP, HTP), real-world product examples, key standards, and LCA databases.

### LCA Calculator
- **LCA Calculator Page**: `/lca-calculator` - AI-powered product lifecycle analysis tool. User inputs product name, description, quantity, system boundary, and selectable lifecycle stages.
- **Output**: Three emission scenarios (low/medium/high) with emissions (kg CO₂e), energy (MJ), and cost (USD) for each lifecycle stage.
- **Features**: Tabbed views (Overview/Stage Details/Scenario Comparison), emission hotspot identification, recommendations, CSV export, quick example products.
- **API**: `POST /api/lca-calculator/analyze` - Generates comprehensive LCA with three scenarios using OpenAI.

### Carbon Pricing Tool
- **Functionality**: Emissions Inventory, Forecast Upload, NGFS Scenarios visualization, Reduction Analysis, Carbon Pricing scenario analysis.
- **LCA Integration**: Search LCA database for emission factors.

### Supply Chain Intelligence
- **Visualization**: Leaflet-based world map for bilateral trade flows.
- **Data**: Based on UN Comtrade patterns for selected sectors (Semiconductors, EV Batteries).
- **Features**: Trade Flow Map, Top Exporters/Importers, Supply Chain Stages, Climate Risks.

### Ecological Economics & Risk
- **Ecological Economics Page**: Explains concepts, planetary boundaries, ecosystem services, key thinkers, and frameworks.
- **Ecological Risk Page**: AI-powered assessment across 6 categories (e.g., Natural Capital Depletion, Ecosystem Services Disruption), with scoring and analysis.

### TNFD Education
- **Content**: Explains TNFD, compares it with TCFD, outlines LEAP approach, disclosure recommendations, and implementation guidance.

### TCFD Risk Tool
- **Functionality**: AI-powered TCFD-aligned climate risk and opportunity assessment across 10 categories (e.g., Policy & Legal, Acute Physical Risk, Resource Efficiency).
- **Scoring**: Impact, Likelihood, Vulnerability scores with overall risk calculation.

### Reputational Risk Analysis
- **Functionality**: Sector-specific climate reputational risk assessment with key considerations and curated resources for 8 sectors.

### Physical Risk Screening
- **Data Architecture**: Database-first approach with pre-imported CMIP6 and ISIMIP climate data for 91 global cities.
- **Data Sources**: Open-Meteo Climate API (CMIP6), modeled ISIMIP3b projections.
- **Indicators**: Mean/max/min temperature, precipitation, sea level rise, flood depth, drought severity, wildfire risk.
- **Scenarios & Time Periods**: SSP pathways (e.g., SSP1-2.6, SSP5-8.5) and time windows (e.g., 2030, 2050).
- **Features**: Interactive map, location input, bulk import, export.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL.

### AI and Machine Learning
- **OpenAI API**: GPT models for climate risk analysis.

### UI and Design System
- **Radix UI**: Accessible UI primitives.
- **Lucide React**: Icon library.
- **Inter Font**: Google Fonts.
- **Tailwind CSS**: Utility-first CSS framework.

### Development and Build Tools
- **Vite**: Frontend build tool.
- **PostCSS**: CSS processing.

### Form and Data Handling
- **React Hook Form**: Form state management.
- **Hookform Resolvers**: Integration with Zod.
- **Date-fns**: Date manipulation utilities.
- **Class Variance Authority**: Component API utility.

## Key Pages & Features

### TNFD Education & Risk Tool
- **TNFD Education**: `/tnfd-education` - TNFD framework education with LEAP approach, disclosure recommendations, nature & biodiversity, implementation guidance. Links to TNFD Risk Tool.
- **TNFD Risk Tool**: `/tnfd-risk` - AI-powered TNFD-aligned nature-related risk assessment. 10 categories (Dependencies, Impacts, Risks, Opportunities) with 30 subcategories. LEAP-based prompting. View modes: All/Dependencies/Impacts/Risks/Opportunities. CSV export.
- **API**: `POST /api/tnfd-risk/analyze` - Generates TNFD nature-related risk assessment.

### TCFD Risk Tool
- **TCFD Risk Tool**: `/tcfd-risk` - AI-powered TCFD-aligned climate risk assessment. 10 categories (4 transition, 2 physical, 4 opportunity) with 30 subcategories. View modes: All/Risks/Opportunities. CSV export.
- **API**: `POST /api/tcfd-risk/analyze` - Generates TCFD climate risk assessment.

### Ecological Economics & Risk
- **Ecological Economics**: `/ecological-economics` - Education page on ecological economics concepts.
- **Ecological Risk**: `/ecological-risk` - AI-powered ecological risk assessment across 6 categories.
- **API**: `POST /api/ecological-risk/analyze` - Generates ecological risk assessment.

### CSRD Framework
- **CSRD Education**: `/csrd-education` - Extensive CSRD learning page covering ESRS standards (E1-E5, S1-S4, G1), double materiality, comparison with TCFD/TNFD/GRI/ISSB, phased implementation timeline, scope criteria, implementation guidance, and key resources.
- **CSRD Report Writer**: `/csrd-report` - AI-powered CSRD-aligned sustainability report generator. Input: company name (required) + optional details. Output: 10-section structured report with executive summary, ESRS coverage, EU Taxonomy alignment, recommendations, and data sources.
- **API**: `POST /api/csrd-report` - Generates CSRD/ESRS sustainability report.

### Report Writing Tools
- **TCFD Report Writer**: `/tcfd-report` - AI-powered TCFD climate disclosure report generator. 8-section report covering governance, strategy, risk management, metrics & targets, transition/physical risk deep dives, financial impact, and action plan.
- **TNFD Report Writer**: `/tnfd-report` - AI-powered TNFD nature-related financial disclosure report. 8-section report covering governance, strategy, LEAP-based risk management, metrics, nature dependencies, impacts, biodiversity, and recommendations.
- **APIs**: `POST /api/tcfd-report`, `POST /api/tnfd-report` - Generate framework-specific reports.
- **Common Features**: Company name required, optional advanced inputs (geography, revenue, employees, description, focus areas). Copy to clipboard and download as text file. Expand/collapse all sections.

### SEC Filing Explorer
- **SEC Filing Explorer**: `/sec-filings` - Search and view SEC EDGAR 10-K filings for any US public company. Company search by name or ticker, filing list with dates, inline document viewer with text extraction.
- **APIs**: `GET /api/sec/search?q=...` - Search companies. `GET /api/sec/filings/:cik` - Get filings for a company. `GET /api/sec/filing-content/:cik/:accessionNumber/:document` - Get filing text content.
- **Data Source**: SEC EDGAR official APIs (free, no API key required). Company tickers cached for 24 hours.
- **Features**: Supports 10-K, 10-Q, 8-K, DEF 14A, S-1 form types. HTML-to-text conversion for readable display. Links to original SEC.gov documents.

### Municipal Climate Risk Assessment
- **Municipal Risk Page**: `/municipal-risk` - Climate risk assessments for US municipalities covering physical hazards and transition risks. Pre-built assessments for 13 cities: Denver, Los Angeles, New York, Dallas, Chicago, Miami, Boston, Tucson, Atlanta, Raleigh, Washington DC, Seattle, Baltimore.
- **Features**: City selector sorted by combined risk score, tabbed views (Overview/Physical Risks/Transition Risks), expandable risk cards with severity/likelihood scoring, projected impacts, adaptation/mitigation measures, CSV export, AI-powered new city generation.
- **API**: `POST /api/municipal-risk/analyze` - AI-powered municipal climate risk assessment for any city.
- **Scoring**: Physical and transition risks scored 1-5 for severity and likelihood. Overall scores per category with combined score.

### Agricultural Environmental Programs
- **Ag Programs Map**: `/ag-programs` - Interactive US county-level map showing agricultural environmental programs at federal, state, and local levels.
- **Map**: D3 + TopoJSON SVG rendering of all US counties with green color scale based on program availability. Mouseover tooltips show county name, state, and available programs. Click to view full details.
- **Data**: 12 federal USDA programs (EQIP, CRP, CSP, ACEP, RCPP, REAP, etc.), state-specific programs for all 50 states, and local/county-level programs for ~30 notable counties.
- **Features**: Search programs, filter by level (Federal/State/Local), filter by category, expandable program cards with description/eligibility/funding/external links.

### Technology Readiness Levels (TRL)
- **TRL Page**: `/trl` - Comprehensive TRL education and IEA clean energy technology analysis tool with three tabs: Learning & Background, Technology Explorer, and Risk Analysis.
- **Learning**: IEA 11-level TRL scale explanation, maturity phase categories (Concept, Prototype, Demonstration, Early Adoption, Mature), importance for climate risk, technology distribution and sector breakdown visualizations.
- **Technology Explorer**: Browse 75+ clean energy technologies from 7 sectors (Power Generation, Energy Storage, Transport, Industry, Buildings, Carbon Capture & Hydrogen, Fuels & Bioenergy). Filter by sector, TRL phase, search. Expandable cards with descriptions, key players, net-zero role.
- **Risk Analysis**: AI-powered technology risk and opportunity assessment. Select sector, describe organization, get executive summary, per-technology risk scores, sector outlook, strategic recommendations, climate impact assessment. CSV export.
- **Data Source**: IEA ETP Clean Energy Technology Guide (2024), ~600 technologies with TRL 1-11 assessments. Data explicitly attributed on every page and in analysis results.
- **APIs**: `GET /api/trl/technologies` (filter by sector, phase, search, TRL range), `POST /api/trl/analyze` (AI-powered risk analysis using IEA TRL data).

### Company Dependencies Database
- **Company Dependencies Explorer**: `/company-dependencies` - Browse material, energy, water, and geographic dependencies for ~30 major US companies across 12 sectors. Search/filter by sector, company name, or ticker. Detailed view with tabbed dependency breakdown.
- **APIs**: `GET /api/company-dependencies` (search/filter), `GET /api/company-dependencies/:id`, `POST /api/company-dependencies` (create), `POST /api/company-dependencies/seed` (init seed data), `POST /api/company-dependencies/ai-suggest` (AI-powered dependency generation), `GET /api/company-dependencies/sectors`, `GET /api/company-dependencies/stats`.
- **Data Model**: JSONB columns for materialDependencies, energyDependencies, waterDependency, geographicDependencies with criticality ratings. Seed data for ~30 companies across Energy, Utilities, Technology, Automotive, Retail, Agriculture, Chemicals, Financial, Healthcare, Aerospace, Mining, Transportation sectors.
- **AI Feature**: GPT-4o powered dependency suggestion for adding new companies with realistic supply chain data.
- **Purpose**: Enables high-level economic simulation and narrative generation about sector interactions and overlapping dependencies for climate risk analysis.