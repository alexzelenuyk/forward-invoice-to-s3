import { Callback, Context } from 'aws-lambda';
import { handler } from 'lambda';
import * as mailParser from 'mailparser';
import * as mail from 'parse/mail';
import * as storePdf from 'persist/pdf';
import {
  lambdaEvent,
  mailBodyFixture,
  mailFixture
} from 'test/helpers/fixtures';

describe('Lambda', () => {
  let callback: Callback;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    callback = jest.fn();

    process.env.TEMP_MAIL_BUCKET = 'temp_bucket';
    process.env.DESTINATION_BUCKET = 'destination_bucket';
  });

  afterAll(() => {
    process.env.TEMP_MAIL_BUCKET = '';
    process.env.DESTINATION_BUCKET = '';
  });

  describe('It should fail', () => {
    let error: string;
    const disposition = 'STOP_RULE_SET';

    describe('Can not read message from S3', () => {
      it('Should return error with disposition', async () => {
        error = 'Access denied';
        jest
          .spyOn(mail, 'getMailBlob')
          .mockImplementation(() => Promise.reject(error));
        await handler(lambdaEvent, {} as Context, callback);
        expect(callback).toHaveBeenCalledWith(error, { disposition });
      });
    });

    describe('Failed to parse email blob', () => {
      it('Should return error with desposition', async () => {
        error = 'Parse error';
        jest
          .spyOn(mail, 'getMailBlob')
          .mockImplementation(() => Promise.resolve(mailBodyFixture));
        jest
          .spyOn(mailParser, 'simpleParser')
          .mockImplementation(() => Promise.reject(error));
        await handler(lambdaEvent, {} as Context, callback);
        expect(callback).toHaveBeenCalledWith(error, { disposition });
      });
    });

    describe('Failed to store pdf', () => {
      it('Should return error with desposition', async () => {
        error = 'Failed to save';
        jest
          .spyOn(mail, 'getMailBlob')
          .mockImplementation(() => Promise.resolve(mailBodyFixture));
        jest
          .spyOn(mailParser, 'simpleParser')
          .mockImplementation(() => Promise.resolve(mailFixture));
        jest
          .spyOn(storePdf, 'storePdf')
          .mockImplementation(() => Promise.reject(error));
        await handler(lambdaEvent, {} as Context, callback);
        expect(callback).toHaveBeenCalledWith(error, { disposition });
      });
    });
  });

  describe('It should store files', () => {
    it('Should save pdf attachment', async () => {
      jest
        .spyOn(mail, 'getMailBlob')
        .mockImplementation(() => Promise.resolve(mailBodyFixture));
      jest
        .spyOn(mailParser, 'simpleParser')
        .mockImplementation(() => Promise.resolve(mailFixture));
      jest
        .spyOn(storePdf, 'storePdf')
        .mockImplementation(() => Promise.resolve());
      await handler(lambdaEvent, {} as Context, callback);
      expect(callback).toHaveBeenCalledWith(null, null);
    });
  });
});
