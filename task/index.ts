/**
 * 1、访问 https://wiki.biligame.com/rocom/%E9%A6%96%E9%A1%B5
 * 2、获取所有数据并保存到本地
 * 3、寻找所有可点击，打开新页面，重复上述操作
 * 4、数据清洗，构建索引
 * 5、整理接口
 */
import { Puppeteer } from 'jsxp';

const Pup = new Puppeteer();

console.log('正在获取数据...', Pup);
