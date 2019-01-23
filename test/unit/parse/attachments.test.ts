import { isPdfFile } from '../../../src/parse/attachments';
import { pdfAttachment, textAttachment } from '../../../test/helpers/fixtures';

describe('isPdfFile()', () => {
  describe('Return true', () => {
    it('Should detect pdf file', () => {
      expect(isPdfFile(pdfAttachment)).toBeTruthy();
    });
  });
  describe('Return false', () => {
    it('Should detect none pdf file', () => {
      expect(isPdfFile(textAttachment)).toBeFalsy();
    });
  });
});
