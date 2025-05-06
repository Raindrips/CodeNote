// // /tests/splitMultilangText.test.ts
// import { splitMultilangText } from './splitMultilangText';
// {
// describe('splitMultilangText', () => {
//   it('should split English words with spaces', () => {
//     expect(splitMultilangText('WIN UP TO 100,100X DURING')).toEqual([
//       'WIN ', 'UP ', 'TO ', '100,', '100X ', 'DURING'
//     ]);
//   });

//   it('should split Chinese characters with punctuation', () => {
//     expect(splitMultilangText('你好,世界')).toEqual([
//       '你', '好,', '世', '界'
//     ]);
//   });

//   it('should split Japanese text correctly', () => {
//     expect(splitMultilangText('こんにちは 世界')).toEqual([
//       'こ', 'ん', 'に', 'ち', 'は ', '世', '界'
//     ]);
//   });

//   it('should split Russian text correctly', () => {
//     expect(splitMultilangText('привет мир')).toEqual([
//       'п', 'р', 'и', 'в', 'е', 'т ', 'м', 'и', 'р'
//     ]);
//   });

//   it('should split Vietnamese text correctly', () => {
//     expect(splitMultilangText('xin chào thế giới')).toEqual([
//       'xin ', 'chào ', 'thế ', 'giới'
//     ]);
//   });

//   it('should split Thai text correctly', () => {
//     expect(splitMultilangText('สวัสดี โลก')).toEqual([
//       'ส', 'ว', 'ั', 'ส', 'ด', 'ี ', 'โ', 'ล', 'ก'
//     ]);
//   });
// });
// }