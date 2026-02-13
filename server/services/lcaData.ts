import { db } from "../db";
import { lcaData } from "@shared/schema";
import { eq, and, like, desc, sql, or } from "drizzle-orm";

export interface LcaProcess {
  refId: string;
  repository: string;
  name: string;
  category: string | null;
  flowType: string | null;
  processType: string | null;
  location: string | null;
  description: string | null;
  units: string | null;
  emissionFactor: number | null;
  emissionUnit: string | null;
  metadata: any;
}

export interface LcaSearchResult {
  refId: string;
  name: string;
  category: string;
  repository: string;
  location: string | null;
  type: string;
  description: string | null;
}

export interface LcaRepository {
  id: string;
  name: string;
  group: string;
  description: string;
}

const LCA_COMMONS_BASE_URL = "https://lcacommons.gov/lca-collaboration/ws/public";
const CACHE_DURATION_HOURS = 168; // 1 week cache for LCA data (changes infrequently)

function isCacheValid(updatedAt: Date | null): boolean {
  if (!updatedAt) return false;
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceUpdate < CACHE_DURATION_HOURS;
}

async function getCachedProcess(refId: string): Promise<LcaProcess | null> {
  try {
    const cached = await db.select()
      .from(lcaData)
      .where(eq(lcaData.refId, refId))
      .limit(1);
    
    if (cached.length === 0) return null;
    
    const row = cached[0];
    if (!isCacheValid(row.updatedAt)) return null;
    
    return {
      refId: row.refId,
      repository: row.repository,
      name: row.name,
      category: row.category,
      flowType: row.flowType,
      processType: row.processType,
      location: row.location,
      description: row.description,
      units: row.units,
      emissionFactor: row.emissionFactor,
      emissionUnit: row.emissionUnit,
      metadata: row.metadata,
    };
  } catch (error) {
    console.error('Error reading cached LCA data:', error);
    return null;
  }
}

async function cacheProcess(process: LcaProcess): Promise<void> {
  try {
    await db.delete(lcaData).where(eq(lcaData.refId, process.refId));
    
    await db.insert(lcaData).values({
      refId: process.refId,
      repository: process.repository,
      name: process.name,
      category: process.category,
      flowType: process.flowType,
      processType: process.processType,
      location: process.location,
      description: process.description,
      units: process.units,
      emissionFactor: process.emissionFactor,
      emissionUnit: process.emissionUnit,
      metadata: process.metadata,
    });
  } catch (error) {
    console.error('Error caching LCA data:', error);
  }
}

async function cacheProcesses(processes: LcaProcess[]): Promise<void> {
  if (processes.length === 0) return;
  
  try {
    const refIds = processes.map(p => p.refId);
    await db.delete(lcaData).where(sql`${lcaData.refId} IN (${sql.join(refIds.map(id => sql`${id}`), sql`, `)})`);
    
    const batchSize = 100;
    for (let i = 0; i < processes.length; i += batchSize) {
      const batch = processes.slice(i, i + batchSize);
      await db.insert(lcaData).values(batch.map(p => ({
        refId: p.refId,
        repository: p.repository,
        name: p.name,
        category: p.category,
        flowType: p.flowType,
        processType: p.processType,
        location: p.location,
        description: p.description,
        units: p.units,
        emissionFactor: p.emissionFactor,
        emissionUnit: p.emissionUnit,
        metadata: p.metadata,
      })));
    }
    
    console.log(`Cached ${processes.length} LCA processes`);
  } catch (error) {
    console.error('Error batch caching LCA data:', error);
  }
}

export async function getRepositories(): Promise<LcaRepository[]> {
  try {
    const response = await fetch(`${LCA_COMMONS_BASE_URL}/repository`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.map((repo: any) => ({
      id: repo.repositoryId || repo.name,
      name: repo.name,
      group: repo.group,
      description: repo.description || '',
    }));
  } catch (error) {
    console.error('Error fetching LCA repositories:', error);
    return getDefaultRepositories();
  }
}

function getDefaultRepositories(): LcaRepository[] {
  return [
    { id: 'USLCI_Database_Public', name: 'USLCI Database', group: 'National_Renewable_Energy_Laboratory', description: 'U.S. Life Cycle Inventory Database' },
    { id: 'US_Electricity_Baseline', name: 'US Electricity Baseline', group: 'NETL', description: 'U.S. electricity generation emission factors' },
    { id: 'NIST_Building_Systems', name: 'NIST Building Systems', group: 'NIST', description: 'Building materials and systems' },
    { id: 'USDA_LCA_Digital_Commons', name: 'USDA LCA Commons', group: 'USDA', description: 'Agricultural life cycle data' },
    { id: 'Forestry_and_Forest_Products', name: 'Forestry and Forest Products', group: 'USFS', description: 'Forestry and wood products' },
  ];
}

export async function searchProcesses(query: string, options: {
  repository?: string;
  type?: string;
  category?: string;
  location?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<LcaSearchResult[]> {
  const { repository, type, category, location, page = 1, pageSize = 50 } = options;
  
  try {
    const cachedResults = await searchCachedProcesses(query, { repository, type, category, location, page, pageSize });
    if (cachedResults.length > 0) {
      return cachedResults;
    }
  } catch (error) {
    console.log('Cache search failed, falling back to API');
  }
  
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (repository) params.append('repositoryId', repository);
    if (type) params.append('type', type);
    if (location) params.append('location', location);
    
    const response = await fetch(`${LCA_COMMONS_BASE_URL}/search?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const items = data.data || data || [];
    const results: LcaSearchResult[] = items.map((item: any) => {
      const version = item.versions?.[0] || {};
      const repoInfo = version.repos?.[0] || {};
      
      return {
        refId: item.refId || item.id,
        name: version.name || item.name || item.label || 'Unknown',
        category: version.category || version.categoryPaths?.slice(-1)?.[0] || item.category || '',
        repository: repoInfo.label || repoInfo.path?.split('/')?.[1] || item.repositoryId || 'USLCI',
        location: version.location || item.location || null,
        type: version.flowType || item.type || version.processType || 'PROCESS',
        description: version.description || item.description || null,
      };
    });
    
    const processesToCache: LcaProcess[] = results.map(r => ({
      refId: r.refId,
      repository: r.repository,
      name: r.name,
      category: r.category,
      flowType: r.type === 'FLOW' || r.type === 'ELEMENTARY_FLOW' || r.type === 'PRODUCT_FLOW' ? r.type : null,
      processType: r.type === 'PROCESS' || r.type === 'UNIT_PROCESS' || r.type === 'LCI_RESULT' || r.type === 'PRODUCT_SYSTEM' ? r.type : null,
      location: r.location,
      description: r.description,
      units: null,
      emissionFactor: null,
      emissionUnit: null,
      metadata: null,
    }));
    
    if (processesToCache.length > 0) {
      cacheProcesses(processesToCache).catch(err => console.log('Cache error:', err));
    }
    
    return results;
  } catch (error) {
    console.error('Error searching LCA Commons:', error);
    return getSampleSearchResults(query);
  }
}

async function searchCachedProcesses(query: string, options: {
  repository?: string;
  type?: string;
  category?: string;
  location?: string;
  page?: number;
  pageSize?: number;
}): Promise<LcaSearchResult[]> {
  const { repository, type, category, location, page = 1, pageSize = 50 } = options;
  const offset = (page - 1) * pageSize;
  
  let conditions = [like(lcaData.name, `%${query}%`)];
  
  if (repository) {
    conditions.push(eq(lcaData.repository, repository));
  }
  if (type) {
    conditions.push(or(eq(lcaData.flowType, type), eq(lcaData.processType, type)) as any);
  }
  if (category) {
    conditions.push(like(lcaData.category, `%${category}%`));
  }
  if (location) {
    conditions.push(eq(lcaData.location, location));
  }
  
  const results = await db.select()
    .from(lcaData)
    .where(and(...conditions))
    .limit(pageSize)
    .offset(offset);
  
  return results.map(row => ({
    refId: row.refId,
    name: row.name,
    category: row.category || '',
    repository: row.repository,
    location: row.location,
    type: row.processType || row.flowType || 'PROCESS',
    description: row.description,
  }));
}

export async function getProcess(group: string, repo: string, type: string, refId: string): Promise<LcaProcess | null> {
  const cached = await getCachedProcess(refId);
  if (cached) return cached;
  
  try {
    const response = await fetch(`${LCA_COMMONS_BASE_URL}/browse/${group}/${repo}/${type}/${refId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const process: LcaProcess = {
      refId: data.refId || refId,
      repository: repo,
      name: data.name,
      category: data.category?.path || data.categoryPath || null,
      flowType: data.flowType || null,
      processType: data.processType || null,
      location: data.location?.code || data.location || null,
      description: data.description || null,
      units: data.quantitativeReference?.unit?.name || null,
      emissionFactor: null,
      emissionUnit: null,
      metadata: data,
    };
    
    await cacheProcess(process);
    return process;
  } catch (error) {
    console.error('Error fetching LCA process:', error);
    return null;
  }
}

export async function getLcaStats(): Promise<{
  totalRecords: number;
  byRepository: { repository: string; count: number }[];
  byCategory: { category: string; count: number }[];
  lastUpdated: string | null;
}> {
  try {
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(lcaData);
    const totalRecords = totalResult[0]?.count || 0;
    
    const byRepoResult = await db.select({
      repository: lcaData.repository,
      count: sql<number>`count(*)`,
    })
      .from(lcaData)
      .groupBy(lcaData.repository)
      .orderBy(desc(sql`count(*)`));
    
    const byCategoryResult = await db.select({
      category: lcaData.category,
      count: sql<number>`count(*)`,
    })
      .from(lcaData)
      .groupBy(lcaData.category)
      .orderBy(desc(sql`count(*)`))
      .limit(20);
    
    const lastUpdatedResult = await db.select({
      updatedAt: sql<string>`max(updated_at)`,
    }).from(lcaData);
    
    return {
      totalRecords,
      byRepository: byRepoResult.map(r => ({ repository: r.repository, count: Number(r.count) })),
      byCategory: byCategoryResult.map(r => ({ category: r.category || 'Uncategorized', count: Number(r.count) })),
      lastUpdated: lastUpdatedResult[0]?.updatedAt || null,
    };
  } catch (error) {
    console.error('Error getting LCA stats:', error);
    return { totalRecords: 0, byRepository: [], byCategory: [], lastUpdated: null };
  }
}

export async function importLcaData(repository?: string): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;
  
  try {
    const repos = repository 
      ? getDefaultRepositories().filter(r => r.id === repository)
      : getDefaultRepositories();
    
    for (const repo of repos) {
      try {
        console.log(`Importing LCA data from ${repo.name}...`);
        
        const searchTerms = ['electricity', 'natural gas', 'gasoline', 'diesel', 'steel', 'aluminum', 'concrete', 'plastic', 'paper', 'wood'];
        
        for (const term of searchTerms) {
          try {
            const params = new URLSearchParams({
              query: term,
              page: '1',
              pageSize: '100',
            });
            
            const response = await fetch(`${LCA_COMMONS_BASE_URL}/search?${params}`);
            if (!response.ok) continue;
            
            const data = await response.json();
            const items = data.data || data || [];
            
            const processes: LcaProcess[] = items.map((item: any) => ({
              refId: item.refId || item.id || `${repo.id}-${item.name}-${Date.now()}`,
              repository: repo.id,
              name: item.name,
              category: item.category || item.categoryPath || null,
              flowType: item.flowType || null,
              processType: item.processType || item.type || 'UNIT_PROCESS',
              location: item.location || 'US',
              description: item.description || null,
              units: null,
              emissionFactor: null,
              emissionUnit: null,
              metadata: item,
            }));
            
            if (processes.length > 0) {
              await cacheProcesses(processes);
              imported += processes.length;
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (searchError) {
            console.log(`Search for "${term}" failed:`, searchError);
          }
        }
        
      } catch (repoError) {
        errors.push(`Failed to import from ${repo.name}: ${repoError}`);
      }
    }
    
    if (imported === 0) {
      console.log('API import failed, using sample data...');
      const sampleData = getSampleLcaData();
      await cacheProcesses(sampleData);
      imported = sampleData.length;
    }
    
  } catch (error) {
    errors.push(`Import error: ${error}`);
  }
  
  return { imported, errors };
}

export async function clearLcaCache(repository?: string): Promise<{ deleted: number }> {
  try {
    let deleted = 0;
    
    if (repository) {
      const result = await db.delete(lcaData).where(eq(lcaData.repository, repository));
      deleted = result.rowCount || 0;
    } else {
      const result = await db.delete(lcaData);
      deleted = result.rowCount || 0;
    }
    
    return { deleted };
  } catch (error) {
    console.error('Error clearing LCA cache:', error);
    return { deleted: 0 };
  }
}

function getSampleSearchResults(query: string): LcaSearchResult[] {
  const samples = getSampleLcaData();
  const lowerQuery = query.toLowerCase();
  
  return samples
    .filter(s => s.name.toLowerCase().includes(lowerQuery) || 
                 (s.category && s.category.toLowerCase().includes(lowerQuery)))
    .slice(0, 20)
    .map(s => ({
      refId: s.refId,
      name: s.name,
      category: s.category || '',
      repository: s.repository,
      location: s.location,
      type: s.processType || 'PROCESS',
      description: s.description,
    }));
}

function getSampleLcaData(): LcaProcess[] {
  return [
    {
      refId: 'uslci-electricity-grid-mix-us',
      repository: 'USLCI_Database_Public',
      name: 'Electricity, at grid, US average',
      category: 'Energy/Electricity/Grid Mix',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'U.S. average electricity grid mix including all generation sources',
      units: 'kWh',
      emissionFactor: 0.417,
      emissionUnit: 'kg CO2e/kWh',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-natural-gas-combustion',
      repository: 'USLCI_Database_Public',
      name: 'Natural gas, combustion at industrial boiler',
      category: 'Energy/Fuels/Natural Gas',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Natural gas combustion in industrial boilers',
      units: 'MJ',
      emissionFactor: 0.0561,
      emissionUnit: 'kg CO2e/MJ',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-gasoline-combustion',
      repository: 'USLCI_Database_Public',
      name: 'Gasoline, combustion in passenger vehicle',
      category: 'Energy/Fuels/Petroleum',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Gasoline combustion in average passenger vehicle',
      units: 'liter',
      emissionFactor: 2.31,
      emissionUnit: 'kg CO2e/liter',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-diesel-combustion',
      repository: 'USLCI_Database_Public',
      name: 'Diesel, combustion in heavy-duty truck',
      category: 'Energy/Fuels/Petroleum',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Diesel combustion in heavy-duty freight trucks',
      units: 'liter',
      emissionFactor: 2.68,
      emissionUnit: 'kg CO2e/liter',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-steel-production-eaf',
      repository: 'USLCI_Database_Public',
      name: 'Steel, production from electric arc furnace',
      category: 'Materials/Metals/Steel',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Steel production via electric arc furnace using scrap steel',
      units: 'kg',
      emissionFactor: 0.47,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-steel-production-bof',
      repository: 'USLCI_Database_Public',
      name: 'Steel, production from basic oxygen furnace',
      category: 'Materials/Metals/Steel',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Steel production via basic oxygen furnace from iron ore',
      units: 'kg',
      emissionFactor: 1.85,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-aluminum-primary',
      repository: 'USLCI_Database_Public',
      name: 'Aluminum, primary production',
      category: 'Materials/Metals/Aluminum',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Primary aluminum production from bauxite ore',
      units: 'kg',
      emissionFactor: 11.89,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-aluminum-recycled',
      repository: 'USLCI_Database_Public',
      name: 'Aluminum, secondary/recycled production',
      category: 'Materials/Metals/Aluminum',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Recycled aluminum production from scrap',
      units: 'kg',
      emissionFactor: 0.58,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-concrete-ready-mix',
      repository: 'USLCI_Database_Public',
      name: 'Concrete, ready-mix, 4000 psi',
      category: 'Materials/Construction/Concrete',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Ready-mix concrete production, 4000 psi strength',
      units: 'kg',
      emissionFactor: 0.13,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-cement-portland',
      repository: 'USLCI_Database_Public',
      name: 'Cement, portland, production',
      category: 'Materials/Construction/Cement',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Portland cement production',
      units: 'kg',
      emissionFactor: 0.93,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-plastic-hdpe',
      repository: 'USLCI_Database_Public',
      name: 'Plastic, HDPE (high-density polyethylene)',
      category: 'Materials/Plastics/Polyethylene',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'High-density polyethylene resin production',
      units: 'kg',
      emissionFactor: 1.93,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-plastic-pet',
      repository: 'USLCI_Database_Public',
      name: 'Plastic, PET (polyethylene terephthalate)',
      category: 'Materials/Plastics/Polyester',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'PET resin production for bottles and packaging',
      units: 'kg',
      emissionFactor: 3.14,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-paper-kraft',
      repository: 'USLCI_Database_Public',
      name: 'Paper, kraft (unbleached)',
      category: 'Materials/Paper/Packaging',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Unbleached kraft paper production',
      units: 'kg',
      emissionFactor: 1.29,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-paper-recycled',
      repository: 'USLCI_Database_Public',
      name: 'Paper, recycled corrugated',
      category: 'Materials/Paper/Recycled',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Recycled corrugated paper production',
      units: 'kg',
      emissionFactor: 0.68,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-wood-lumber-softwood',
      repository: 'USLCI_Database_Public',
      name: 'Lumber, softwood, kiln-dried',
      category: 'Materials/Wood/Lumber',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Kiln-dried softwood lumber production',
      units: 'kg',
      emissionFactor: 0.31,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'uslci-glass-container',
      repository: 'USLCI_Database_Public',
      name: 'Glass, container (bottles)',
      category: 'Materials/Glass/Containers',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Glass container (bottle) production',
      units: 'kg',
      emissionFactor: 0.85,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USLCI', year: 2022 },
    },
    {
      refId: 'netl-electricity-coal',
      repository: 'US_Electricity_Baseline',
      name: 'Electricity, from coal power plant',
      category: 'Energy/Electricity/Coal',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Electricity generation from coal-fired power plants',
      units: 'kWh',
      emissionFactor: 0.95,
      emissionUnit: 'kg CO2e/kWh',
      metadata: { source: 'NETL', year: 2022 },
    },
    {
      refId: 'netl-electricity-natural-gas',
      repository: 'US_Electricity_Baseline',
      name: 'Electricity, from natural gas combined cycle',
      category: 'Energy/Electricity/Natural Gas',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Electricity generation from natural gas combined cycle plants',
      units: 'kWh',
      emissionFactor: 0.41,
      emissionUnit: 'kg CO2e/kWh',
      metadata: { source: 'NETL', year: 2022 },
    },
    {
      refId: 'netl-electricity-solar',
      repository: 'US_Electricity_Baseline',
      name: 'Electricity, from solar PV',
      category: 'Energy/Electricity/Solar',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Electricity generation from utility-scale solar photovoltaic',
      units: 'kWh',
      emissionFactor: 0.041,
      emissionUnit: 'kg CO2e/kWh',
      metadata: { source: 'NETL', year: 2022 },
    },
    {
      refId: 'netl-electricity-wind',
      repository: 'US_Electricity_Baseline',
      name: 'Electricity, from wind turbines',
      category: 'Energy/Electricity/Wind',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Electricity generation from onshore wind turbines',
      units: 'kWh',
      emissionFactor: 0.011,
      emissionUnit: 'kg CO2e/kWh',
      metadata: { source: 'NETL', year: 2022 },
    },
    {
      refId: 'nist-concrete-35mpa',
      repository: 'NIST_Building_Systems',
      name: 'Concrete, ready mix, 35 MPa',
      category: 'Building/Structural/Concrete',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Ready-mix concrete, 35 MPa compressive strength',
      units: 'm3',
      emissionFactor: 334.0,
      emissionUnit: 'kg CO2e/m3',
      metadata: { source: 'NIST', year: 2022 },
    },
    {
      refId: 'nist-gypsum-board',
      repository: 'NIST_Building_Systems',
      name: 'Gypsum board, 1/2 inch',
      category: 'Building/Finishes/Gypsum',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Standard 1/2 inch gypsum wallboard',
      units: 'm2',
      emissionFactor: 2.94,
      emissionUnit: 'kg CO2e/m2',
      metadata: { source: 'NIST', year: 2022 },
    },
    {
      refId: 'nist-insulation-fiberglass',
      repository: 'NIST_Building_Systems',
      name: 'Insulation, fiberglass batt',
      category: 'Building/Insulation/Fiberglass',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Fiberglass batt insulation, R-19',
      units: 'm2',
      emissionFactor: 4.12,
      emissionUnit: 'kg CO2e/m2',
      metadata: { source: 'NIST', year: 2022 },
    },
    {
      refId: 'usda-corn-grain',
      repository: 'USDA_LCA_Digital_Commons',
      name: 'Corn grain, production',
      category: 'Agriculture/Crops/Corn',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Corn grain production, U.S. average',
      units: 'kg',
      emissionFactor: 0.29,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USDA', year: 2022 },
    },
    {
      refId: 'usda-soybean',
      repository: 'USDA_LCA_Digital_Commons',
      name: 'Soybean, production',
      category: 'Agriculture/Crops/Soybean',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Soybean production, U.S. average',
      units: 'kg',
      emissionFactor: 0.34,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USDA', year: 2022 },
    },
    {
      refId: 'usda-beef-cattle',
      repository: 'USDA_LCA_Digital_Commons',
      name: 'Beef, cattle production',
      category: 'Agriculture/Livestock/Beef',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Beef cattle production, U.S. average',
      units: 'kg',
      emissionFactor: 26.5,
      emissionUnit: 'kg CO2e/kg',
      metadata: { source: 'USDA', year: 2022 },
    },
    {
      refId: 'usfs-lumber-softwood',
      repository: 'Forestry_and_Forest_Products',
      name: 'Lumber, softwood, southeast US',
      category: 'Forestry/Lumber/Softwood',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US-SE',
      description: 'Softwood lumber production, southeastern U.S.',
      units: 'm3',
      emissionFactor: 46.2,
      emissionUnit: 'kg CO2e/m3',
      metadata: { source: 'USFS', year: 2022 },
    },
    {
      refId: 'usfs-plywood',
      repository: 'Forestry_and_Forest_Products',
      name: 'Plywood, softwood',
      category: 'Forestry/Panels/Plywood',
      flowType: 'PRODUCT_FLOW',
      processType: 'UNIT_PROCESS',
      location: 'US',
      description: 'Softwood plywood panel production',
      units: 'm3',
      emissionFactor: 287.0,
      emissionUnit: 'kg CO2e/m3',
      metadata: { source: 'USFS', year: 2022 },
    },
  ];
}
