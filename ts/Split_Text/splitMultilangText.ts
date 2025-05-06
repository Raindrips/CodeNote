// /src/splitMultilangText.ts

export function splitMultilangText(input: string): string[] {
    const results: string[] = [];
    let current = '';
  
    const isAsianChar = (char: string) => /[一-鿿぀-ゟ゠-ヿ가-힯]/.test(char); // CJK, JP, KR
    const isCyrillic = (char: string) => /[Ѐ-ӿ]/.test(char); // Russian
    const isVietnamese = (char: string) => /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(char);
    const isThai = (char: string) => /[฀-๿]/.test(char);
    const isWhitespace = (char: string) => /[\s]/.test(char);
    const isLetterOrDigit = (char: string) => /[a-zA-Z0-9]/.test(char);
    const isSymbol = (char: string) => /[.,!?;:~@#$%^&*()\[\]{}<>\/|+=_-]/.test(char);
  
    const isSingleCharLang = (char: string) =>
      isAsianChar(char) || isCyrillic(char) || isVietnamese(char) || isThai(char);
  
    const chars = [...input];
  
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
  
      if (isWhitespace(char)) {
        if (current) {
          current += char;
          results.push(current);
          current = '';
        } else {
          results.push(char);
        }
        continue;
      }
  
      if (isSingleCharLang(char)) {
        if (current) {
          results.push(current);
          current = '';
        }
        current = char;
        const nextChar = chars[i + 1];
        if (nextChar && isWhitespace(nextChar)) {
          current += nextChar;
          i++;
        }
        results.push(current);
        current = '';
        continue;
      }
  
      if (isLetterOrDigit(char)) {
        current += char;
        continue;
      }
  
      if (isSymbol(char)) {
        const nextChar = chars[i + 1];
        if (current && nextChar && isWhitespace(nextChar)) {
          current += char + nextChar;
          results.push(current);
          current = '';
          i++;
        } else if (current) {
          current += char;
          results.push(current);
          current = '';
        } else {
          results.push(char);
        }
        continue;
      }
  
      if (current) {
        results.push(current);
      }
      results.push(char);
      current = '';
    }
  
    if (current) {
      results.push(current);
    }
  
    return results;
  }
  
  // ✅ 示例
  // splitMultilangText('WIN UP TO 100,100X DURING')
  // => ["WIN ", "UP ", "TO ", "100,", "100X ", "DURING"]
  // splitMultilangText('你好,世界')
  // => ["你", "好,", "世", "界"]
  