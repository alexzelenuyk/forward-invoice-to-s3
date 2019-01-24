import { getS3Key, getS3KeyPrefix } from '../../../src/persist/s3Key';

describe('Persist functions', () => {
  let originalNow: () => number;

  beforeAll(() => {
    originalNow = Date.now;
  });

  afterAll(() => {
    Date.now = originalNow;
  });

  describe('getS3KeyPrefix()', () => {
    describe('Return file prefix', () => {
      it('It should call and return Date.now()', () => {
        const timestampInFuture = 1273017600000;
        Date.now = jest.fn().mockImplementation(() => timestampInFuture);

        expect(getS3KeyPrefix()).toEqual('2010/May');
      });
    });
  });

  describe('getS3Key()', () => {
    describe('getS3Key()', () => {
      it('Should build correct file key', () => {
        expect(getS3Key('id', 'file')).toEqual('2010/May/id/file');
      });
    });
  });
});
