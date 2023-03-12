/**
 *
 * @param originalname 原始文件名(包含后缀)
 * @returns 日期的毫秒字符串  + 随机数转化为36进制的形成的字符串 + 10 位数随机字符串 + 文件后缀
 */
export function generateFileUploadKey(originalname: string): string {
  /**
   *
   * @param len 生成字符串位数
   * @returns len位随机字符串
   */
  const generateRandomString = (len: number) => {
    let text = '';
    const charset = 'abcdefghijklmnopqrstuvwxyz23456789';
    for (let i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  };
  //从原始文件名提取后缀
  const getSuffixFromOriginalname = (originalname: string) => {
    const lastPointIndex = originalname.lastIndexOf('.');
    return originalname.slice(lastPointIndex, originalname.length);
  };
  return (
    +new Date() +
    '' +
    '-' +
    (Math.random() * 1e20).toString(36).slice(-8) +
    '-' +
    generateRandomString(10) +
    getSuffixFromOriginalname(originalname)
  );
}
