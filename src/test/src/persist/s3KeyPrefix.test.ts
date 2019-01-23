import { getS3KeyPrefix } from "persist/s3KeyPrefix";

describe('getS3KeyPrefix()', () => {
    describe('Return file prefix', () => {
        let originalNow: () => number;

        beforeEach(() => {
            originalNow = Date.now
        })

        afterEach(() => {
            Date.now = originalNow
        })

        it('It should call and return Date.now()', () => {
            const timestampInFuture = 1273017600000
            Date.now = jest.fn().mockImplementation(() => timestampInFuture)

            expect(getS3KeyPrefix()).toEqual('2010/5')
        });
    })
})