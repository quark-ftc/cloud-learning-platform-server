/**
 *
 * @param originalname 原始文件名(包含后缀)
 * @returns 日期的毫秒字符串  + 随机数转化为36进制的形成的字符串 + 文件的原始名称
 */
export function generateFileUploadKey(originalname: string): string {
  return (
    +new Date() +
    '' +
    '-' +
    (Math.random() * 1e20).toString(36).slice(-8) +
    '-' +
    originalname
  );
}
