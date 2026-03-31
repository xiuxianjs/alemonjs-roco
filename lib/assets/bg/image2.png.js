const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../image2-CiEWZ3oL.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
