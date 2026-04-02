/**
 * 洛克王国 Wiki 数据抓取任务 (本地运行)
 *
 * 用法:
 *   npx tsx task/index.ts                # 抓取全部宠物数据
 *   npx tsx task/index.ts --range 1 10   # 抓取 NO.1 ~ NO.10
 *   npx tsx task/index.ts --pet 迪莫     # 只抓取迪莫
 *   npx tsx task/index.ts --list         # 只获取列表，不抓详情
 *
 * 抓取完成后运行:
 *   npx tsx task/generate.ts             # 将 JSON 转为 src/data/ 下的 TS 文件
 *
 * 数据来源: https://wiki.biligame.com/rocom/
 * 数据协议: CC BY-NC-SA 4.0
 */
import { fetchPetList, scrapeAll } from './scraper';

async function main() {
  const args = process.argv.slice(2);

  // 仅列出宠物列表
  if (args.includes('--list')) {
    const list = await fetchPetList();

    for (const pet of list) {
      console.log(`NO.${String(pet.id).padStart(3, '0')} ${pet.name} [${pet.elements.join('/')}]`);
    }
    console.log(`共 ${list.length} 个精灵`);

    return;
  }

  // 解析参数
  const petNames: string[] = [];
  let idRange: [number, number] | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pet' && args[i + 1]) {
      petNames.push(args[i + 1]);
      i++;
    }
    if (args[i] === '--range' && args[i + 1] && args[i + 2]) {
      idRange = [parseInt(args[i + 1], 10), parseInt(args[i + 2], 10)];
      i += 2;
    }
  }

  const startTime = Date.now();

  const result = await scrapeAll({
    petNames: petNames.length > 0 ? petNames : undefined,
    idRange,
    onProgress: (current, total, name) => {
      const pct = Math.round((current / total) * 100);

      process.stdout.write(`\r[${pct}%] ${current}/${total} ${name}    `);
    }
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n抓取完成! 耗时 ${elapsed}s, 成功 ${result.success}/${result.total}`);

  if (result.failed.length > 0) {
    console.log('失败:', result.failed.join(', '));
  }

  console.log('\n下一步: npx tsx task/generate.ts  (将数据生成为 src/data/ 下的 TS 文件)');
}

main().catch(err => {
  console.error('抓取任务出错:', err);
  process.exit(1);
});
