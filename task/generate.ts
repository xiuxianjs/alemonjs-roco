/**
 * 将抓取的 JSON 数据生成为 src/data/ 下的 TS 文件
 * 用法: npx tsx task/generate.ts
 *
 * 前置: 先运行 npx tsx task/index.ts 获取 data/scraped-pets.json
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { ScrapeResult, ScrapedPet } from './scraper';

const DATA_JSON = join(process.cwd(), 'data', 'scraped-pets.json');
const SRC_DATA_DIR = join(process.cwd(), 'src', 'data');

/** 每个文件放多少个宠物 */
const PETS_PER_FILE = 50;

function escapeStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function petToTs(pet: ScrapedPet): string {
  const element = Array.isArray(pet.element) ? `[${pet.element.map(e => `'${escapeStr(e)}'`).join(', ')}]` : `'${escapeStr(pet.element)}'`;

  const skills = pet.skills
    .map(s => {
      const n = escapeStr(s.name);
      const e = escapeStr(s.element);
      const t = escapeStr(s.type);
      const d = escapeStr(s.desc);

      return `      { name: '${n}', element: '${e}', type: '${t}', cost: ${s.cost}, power: ${s.power}, desc: '${d}' }`;
    })
    .join(',\n');

  return `  {
    id: ${pet.id},
    name: '${escapeStr(pet.name)}',
    element: ${element},
    hp: ${pet.hp},
    atk: ${pet.atk},
    mat: ${pet.mat},
    def: ${pet.def},
    mdf: ${pet.mdf},
    spd: ${pet.spd},
    trait: { name: '${escapeStr(pet.trait.name)}', desc: '${escapeStr(pet.trait.desc)}' },
    skills: [
${skills}
    ]
  }`;
}

function generatePetFile(pets: ScrapedPet[], index: number): string {
  const items = pets.map(petToTs).join(',\n');

  return `import type { Pet } from '@src/model/types';

export const petList${index}: Pet[] = [
${items}
];
`;
}

function generateIndexFile(fileCount: number): string {
  const imports = Array.from({ length: fileCount }, (_, i) => {
    const n = i + 1;

    return `import { petList${n} } from './pets${n}';`;
  }).join('\n');

  const spreads = Array.from({ length: fileCount }, (_, i) => `  ...petList${i + 1}`).join(',\n');

  return `import type { Pet } from '@src/model/types';
${imports}

/** 全部宠物列表 (由 task/generate.ts 生成) */
export const allPets: Pet[] = [
${spreads}
];

/** 按名称查找宠物 (模糊匹配) */
export function findPetByName(name: string): Pet | undefined {
  const trimmed = name.trim();

  // 精确匹配
  const exact = allPets.find(p => p.name === trimmed);

  if (exact) {
    return exact;
  }

  // 包含匹配
  return allPets.find(p => p.name.includes(trimmed) || trimmed.includes(p.name));
}

/** 按 ID 查找宠物 */
export function findPetById(id: number): Pet | undefined {
  return allPets.find(p => p.id === id);
}

/** 按属性过滤宠物 */
export function filterPetsByElement(element: string): Pet[] {
  return allPets.filter(p => {
    const el = p.element;

    return Array.isArray(el) ? el.includes(element) : el === element;
  });
}

/** 搜索技能 (按名称模糊匹配, 返回宠物+技能) */
export function searchSkill(skillName: string): Array<{ pet: Pet; skill: Pet['skills'][number] }> {
  const results: Array<{ pet: Pet; skill: Pet['skills'][number] }> = [];
  const trimmed = skillName.trim();

  for (const pet of allPets) {
    for (const skill of pet.skills) {
      if (skill.name === trimmed || skill.name.includes(trimmed)) {
        results.push({ pet, skill });
      }
    }
  }

  return results;
}

/** 获取宠物属性列表 (统一为数组) */
export function getPetElements(pet: Pet): string[] {
  return Array.isArray(pet.element) ? pet.element : [pet.element];
}

/** 计算种族值总和 */
export function getTotalStats(pet: Pet): number {
  return pet.hp + pet.atk + pet.mat + pet.def + pet.mdf + pet.spd;
}
`;
}

function main() {
  if (!existsSync(DATA_JSON)) {
    console.error(`数据文件不存在: ${DATA_JSON}`);
    console.error('请先运行: npx tsx task/index.ts');
    process.exit(1);
  }

  const raw = readFileSync(DATA_JSON, 'utf-8');
  const data = JSON.parse(raw) as ScrapeResult;

  console.log(`[Generate] 读取到 ${data.pets.length} 个精灵, 抓取时间: ${data.scrapedAt}`);

  // 按 ID 排序
  const sorted = [...data.pets].sort((a, b) => a.id - b.id);

  // 分组输出
  const fileCount = Math.ceil(sorted.length / PETS_PER_FILE);

  for (let i = 0; i < fileCount; i++) {
    const chunk = sorted.slice(i * PETS_PER_FILE, (i + 1) * PETS_PER_FILE);
    const content = generatePetFile(chunk, i + 1);
    const filePath = join(SRC_DATA_DIR, `pets${i + 1}.ts`);

    writeFileSync(filePath, content, 'utf-8');
    console.log(`[Generate] 写入 pets${i + 1}.ts (${chunk.length} 个精灵, NO.${chunk[0].id}~NO.${chunk[chunk.length - 1].id})`);
  }

  // 生成 index.ts
  const indexContent = generateIndexFile(fileCount);
  const indexPath = join(SRC_DATA_DIR, 'index.ts');

  writeFileSync(indexPath, indexContent, 'utf-8');
  console.log('[Generate] 写入 index.ts');

  console.log(`[Generate] 完成! 共生成 ${fileCount + 1} 个文件`);
}

main();
