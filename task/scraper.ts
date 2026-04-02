/**
 * 洛克王国 Wiki 数据抓取器
 * 数据来源: https://wiki.biligame.com/rocom/
 * 数据协议: CC BY-NC-SA 4.0
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// ======================== 类型定义 ========================

export interface ScrapedSkill {
  name: string;
  element: string;
  type: string;
  cost: number;
  power: number;
  desc: string;
}

export interface ScrapedPet {
  id: number;
  name: string;
  element: string | string[];
  hp: number;
  atk: number;
  mat: number;
  def: number;
  mdf: number;
  spd: number;
  trait: { name: string; desc: string };
  skills: ScrapedSkill[];
}

export interface ScrapeResult {
  pets: ScrapedPet[];
  scrapedAt: string;
  source: string;
  total: number;
  success: number;
  failed: string[];
}

// ======================== 配置 ========================

const WIKI_BASE = 'https://wiki.biligame.com/rocom/';
const USER_AGENT = 'AlemonJS-Roco-Bot/1.0';
const REQUEST_DELAY = 1500; // 请求间隔(ms)，避免给 wiki 服务器造成压力
const MAX_RETRIES = 2;

// ======================== 工具函数 ========================

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
      'Accept-Language': 'zh-CN,zh;q=0.9'
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${url}`);
  }

  return res.text();
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .trim();
}

// ======================== 列表页解析 ========================

interface PetBasicInfo {
  id: number;
  name: string;
  elements: string[];
}

/**
 * 从精灵图鉴页面抓取所有宠物的基本信息
 */
export async function fetchPetList(): Promise<PetBasicInfo[]> {
  console.log('[Scraper] 正在获取精灵图鉴列表...');
  const url = WIKI_BASE + encodeURIComponent('精灵图鉴');
  const html = await fetchHtml(url);

  const pets: PetBasicInfo[] = [];
  const seen = new Set<string>();

  // 方法1: 解析 HTML 表格行
  // 每行格式: <tr>...<a href="/rocom/宠物名" title="宠物名">...NO.XXX 宠物名...属性图标...</tr>
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];

    // 提取 NO.XXX 编号
    const idMatch = rowHtml.match(/NO\.(\d+)/);

    if (!idMatch) {
      continue;
    }

    const id = parseInt(idMatch[1], 10);

    // 提取宠物名 - 从链接 title 属性
    const nameMatch = rowHtml.match(/title="([^"]+)"[^>]*>(?:\s*<img[^>]*>)*\s*<\/a>/);
    let name = '';

    if (nameMatch) {
      name = nameMatch[1].trim();
    } else {
      // 备选: 从文本内容提取
      const textContent = stripHtml(rowHtml);
      const textNameMatch = textContent.match(/NO\.\d+\s+(\S+)/);

      if (textNameMatch) {
        name = textNameMatch[1];
      }
    }

    if (!name) {
      continue;
    }

    // 提取属性 - 从属性图标文件名
    const elements: string[] = [];
    const elemRegex = /图标[_\s]+宠物[_\s]+属性[_\s]+([^._\s]+?)\.png/g;
    let elemMatch: RegExpExecArray | null;

    while ((elemMatch = elemRegex.exec(rowHtml)) !== null) {
      if (!elements.includes(elemMatch[1])) {
        elements.push(elemMatch[1]);
      }
    }

    // 去重 (同一ID的不同形态只取第一个)
    const key = `${id}-${name}`;

    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    pets.push({ id, name, elements });
  }

  // 方法2: 纯文本回退
  if (pets.length === 0) {
    console.log('[Scraper] HTML 表格解析失败，尝试纯文本解析...');
    const text = stripHtml(html);
    const textRegex = /NO\.(\d+)\s+(\S+)/g;
    let textMatch: RegExpExecArray | null;

    while ((textMatch = textRegex.exec(text)) !== null) {
      const id = parseInt(textMatch[1], 10);
      const name = textMatch[2];
      const key = `${id}-${name}`;

      if (!seen.has(key)) {
        seen.add(key);
        pets.push({ id, name, elements: [] });
      }
    }
  }

  // 按编号排序并去重 (同编号只保留主形态)
  const uniquePets = new Map<number, PetBasicInfo>();

  for (const pet of pets) {
    if (!uniquePets.has(pet.id)) {
      uniquePets.set(pet.id, pet);
    }
  }

  const result = [...uniquePets.values()].sort((a, b) => a.id - b.id);

  console.log(`[Scraper] 共找到 ${result.length} 个精灵`);

  return result;
}

// ======================== 详情页解析 ========================

/**
 * 从单个宠物详情页抓取完整数据
 */
export async function fetchPetDetail(petName: string, petId: number, fallbackElements: string[]): Promise<ScrapedPet | null> {
  const url = WIKI_BASE + encodeURIComponent(petName);

  let html: string;

  try {
    html = await fetchHtml(url);
  } catch (err) {
    console.error(`[Scraper] 获取 ${petName} 页面失败:`, err);

    return null;
  }

  const text = stripHtml(html);

  // --- 解析属性 ---
  const elements = parseElements(html);
  const element =
    elements.length > 0
      ? elements.length === 1
        ? elements[0]
        : elements
      : fallbackElements.length === 1
        ? fallbackElements[0]
        : fallbackElements.length > 1
          ? fallbackElements
          : '普通';

  // --- 解析种族值 ---
  const hp = parseStat(text, '生命');
  const atk = parseStat(text, '物攻');
  const mat = parseStat(text, '魔攻');
  const def = parseStat(text, '物防');
  const mdf = parseStat(text, '魔防');
  const spd = parseStat(text, '速度');

  // --- 解析特性 ---
  const trait = parseTrait(text);

  // --- 解析技能 ---
  const skills = parseSkills(html);

  return {
    id: petId,
    name: petName,
    element,
    hp,
    atk,
    mat,
    def,
    mdf,
    spd,
    trait,
    skills
  };
}

function parseElements(html: string): string[] {
  const elements: string[] = [];
  // 匹配详情页顶部的属性图标（通常在宠物编号附近）
  const headerMatch = html.match(/NO\d+[\s\S]{0,500}/i);
  const searchArea = headerMatch ? headerMatch[0] : html.slice(0, 3000);

  const regex = /属性[_\s]+([^._\s"]+?)\.png/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(searchArea)) !== null) {
    const el = match[1];

    if (!elements.includes(el) && el.length <= 3) {
      elements.push(el);
    }
  }

  return elements;
}

function parseStat(text: string, label: string): number {
  // 种族值解析 - 匹配 "标签 数字" 模式
  const patterns = [new RegExp(`${label}\\s+(\\d+)`, 'g'), new RegExp(`${label}[^\\d]{0,20}(\\d+)`, 'g')];

  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern)];

    for (const m of matches) {
      const val = parseInt(m[1], 10);

      // 种族值通常在 1-255 之间
      if (val > 0 && val <= 255) {
        return val;
      }
    }
  }

  return 0;
}

function parseTrait(text: string): { name: string; desc: string } {
  // 特性格式: "特性名 特性描述" — 出现在"特性"标题之后
  // 从抓取结果看格式是: 特性名\n\n描述\n\n进化链
  const traitMatch = text.match(/特性\s+(.+?)\s+(.+?)(?:\s+进化链|\s+克制表|\s+精灵技能)/s);

  if (traitMatch) {
    return {
      name: traitMatch[1].replace(/\s+/g, '').trim(),
      desc: traitMatch[2].replace(/\s+/g, '').trim()
    };
  }

  // 备选匹配
  const altMatch = text.match(/特性\s+(\S+)\s+(.+?)(?:\n|$)/);

  if (altMatch) {
    return { name: altMatch[1].trim(), desc: altMatch[2].trim() };
  }

  return { name: '未知', desc: '' };
}

function parseSkills(html: string): ScrapedSkill[] {
  const skills: ScrapedSkill[] = [];

  // 定位技能区域 (血脉技能 或 精灵技能 到 分类)
  const sectionMatch = html.match(/精灵技能([\s\S]+?)(?:<div[^>]*id="footer"|<div class="catlinks"|$)/i);

  if (!sectionMatch) {
    return skills;
  }

  const section = sectionMatch[1];

  // 按 LV 标记分割技能区块
  // 每个技能区块包含: LV等级 + 属性图标 + 技能信息
  const skillBlocks = section.split(/(?=LV\d+)/);

  for (const block of skillBlocks) {
    if (!block.includes('技能图标')) {
      continue;
    }

    // 提取技能属性 (从 "属性_XXX.png" 提取)
    const elemMatch = block.match(/属性[_\s]+([^._\s"]+?)\.png/);
    const element = elemMatch ? elemMatch[1] : '普通';

    // 提取技能名 (从 "技能图标 XXX.png" 提取)
    const nameMatch = block.match(/技能图标[_\s]+(.+?)\.png/);

    if (!nameMatch) {
      continue;
    }
    const name = nameMatch[1].replace(/\s+/g, '');

    // 提取纯文本用于解析数值
    const blockText = stripHtml(block);

    // 提取技能类型
    const typeMatch = blockText.match(/(物攻|魔攻|状态|防御)/);
    const type = typeMatch ? typeMatch[1] : '状态';

    // 提取威力和能耗
    // 文本格式大致为: "技能名 能耗(数字) 类型 威力(数字) ✦描述"
    let cost = 0;
    let power = 0;

    // 经观察, 文本格式为: "技能名✦? 数字(能耗) 类型图标名 类型名 数字(威力) ✦描述"
    // 简化提取: 找到类型词前后的数字
    const numsBeforeType = blockText.match(/(\d+)\s*(?:物攻|魔攻|状态|防御)/);

    if (numsBeforeType) {
      cost = parseInt(numsBeforeType[1], 10);
    }

    const numsAfterType = blockText.match(/(?:物攻|魔攻|状态|防御)\s+(\d+)/);

    if (numsAfterType) {
      power = parseInt(numsAfterType[1], 10);
    }

    // 提取描述 (✦ 后的内容)
    const descMatch = blockText.match(/✦(.+?)(?:$|LV\d)/s);
    const desc = descMatch ? descMatch[1].replace(/\s+/g, '').trim() : '';

    skills.push({ name, element, type, cost, power, desc });
  }

  return skills;
}

// ======================== 主流程 ========================

export interface ScrapeOptions {
  /** 只抓取指定名称的宠物(用于测试) */
  petNames?: string[];
  /** 只抓取指定 ID 范围的宠物 */
  idRange?: [number, number];
  /** 数据保存目录 */
  outputDir?: string;
  /** 请求间隔 (ms) */
  delayMs?: number;
  /** 进度回调 */
  onProgress?: (current: number, total: number, name: string) => void;
}

/**
 * 执行完整的数据抓取
 */
export async function scrapeAll(options: ScrapeOptions = {}): Promise<ScrapeResult> {
  const outputDir = options.outputDir ?? join(process.cwd(), 'data');
  const delayMs = options.delayMs ?? REQUEST_DELAY;

  // 1. 获取宠物列表
  let petList = await fetchPetList();

  // 2. 应用过滤
  if (options.petNames && options.petNames.length > 0) {
    petList = petList.filter(p => options.petNames!.includes(p.name));
  }
  if (options.idRange) {
    const [min, max] = options.idRange;

    petList = petList.filter(p => p.id >= min && p.id <= max);
  }

  console.log(`[Scraper] 即将抓取 ${petList.length} 个精灵的详细数据...`);

  // 3. 逐个抓取详情
  const pets: ScrapedPet[] = [];
  const failed: string[] = [];

  for (let i = 0; i < petList.length; i++) {
    const { id, name, elements } = petList[i];

    if (options.onProgress) {
      options.onProgress(i + 1, petList.length, name);
    }
    console.log(`[Scraper] (${i + 1}/${petList.length}) 正在抓取: ${name} (NO.${id})`);

    let pet: ScrapedPet | null = null;

    for (let retry = 0; retry <= MAX_RETRIES; retry++) {
      if (retry > 0) {
        console.log(`[Scraper] 重试 ${retry}/${MAX_RETRIES}: ${name}`);
        await delay(delayMs * 2);
      }

      pet = await fetchPetDetail(name, id, elements);
      if (pet) {
        break;
      }
    }

    if (pet) {
      pets.push(pet);
    } else {
      failed.push(name);
      console.error(`[Scraper] 抓取失败: ${name}`);
    }

    // 请求间隔
    if (i < petList.length - 1) {
      await delay(delayMs);
    }
  }

  // 4. 保存结果
  const result: ScrapeResult = {
    pets,
    scrapedAt: new Date().toISOString(),
    source: 'https://wiki.biligame.com/rocom/',
    total: petList.length,
    success: pets.length,
    failed
  };

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = join(outputDir, 'scraped-pets.json');

  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`[Scraper] 数据已保存到: ${outputPath}`);
  console.log(`[Scraper] 完成! 成功: ${pets.length}, 失败: ${failed.length}`);

  if (failed.length > 0) {
    console.log(`[Scraper] 失败列表: ${failed.join(', ')}`);
  }

  return result;
}

// ======================== 数据加载 ========================

/**
 * 从已抓取的 JSON 文件加载数据
 */
export function loadScrapedData(dir?: string): ScrapeResult | null {
  const dataDir = dir ?? join(process.cwd(), 'data');
  const filePath = join(dataDir, 'scraped-pets.json');

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const raw = readFileSync(filePath, 'utf-8');

    return JSON.parse(raw) as ScrapeResult;
  } catch {
    return null;
  }
}
