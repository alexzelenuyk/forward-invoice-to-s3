import * as AWS from 'aws-sdk';
import * as mail from '../../src/parse/mail';
import * as mailParser from 'mailparser';
import * as storeBody from '../../src/persist/body';
import * as storePdf from '../../src/persist/pdf';

import { Callback, Context } from 'aws-lambda';
import { lambdaEvent, mailBodyFixture, mailFixture } from '../helpers/fixtures';

import { PromiseResult } from 'aws-sdk/lib/request';
import { handler } from '../../src/lambda';

describe('Lambda', () => {
  let callback: Callback;
  const context = {} as Context;

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
        await handler(lambdaEvent, context, callback);
        expect(callback).toHaveBeenCalledWith(error, { disposition });
      });
    });

    describe('Failed to parse email blob', () => {
      it('Should return error with desposition', async () => {
        error = 'Parse error';
        jest
          .spyOn(mail, 'getMailBlob')
          .mockImplementation(() =>
            Promise.resolve(
              mailBodyFixture as PromiseResult<
                AWS.S3.GetObjectOutput,
                AWS.AWSError
              >
            )
          );
        jest
          .spyOn(mailParser, 'simpleParser')
          .mockImplementation(() => Promise.reject(error));
        await handler(lambdaEvent, context, callback);
        expect(callback).toHaveBeenCalledWith(error, { disposition });
      });
    });

    describe('Failed to store pdf', () => {
      it('Should return error with desposition', async () => {
        error = 'Failed to save';
        jest
          .spyOn(mail, 'getMailBlob')
          .mockImplementation(() =>
            Promise.resolve(
              mailBodyFixture as PromiseResult<
                AWS.S3.GetObjectOutput,
                AWS.AWSError
              >
            )
          );
        jest
          .spyOn(mailParser, 'simpleParser')
          .mockImplementation(() =>
            Promise.resolve(mailFixture as mailParser.ParsedMail)
          );
        jest
          .spyOn(storePdf, 'storePdf')
          .mockImplementation(() => Promise.reject(error));
        await handler(lambdaEvent, context, callback);
        expect(callback).toHaveBeenCalledWith(error, { disposition });
      });
    });
  });

  describe('It should store attachments', () => {
    it('Should save pdf attachmentand mail body', async () => {
      jest
        .spyOn(mail, 'getMailBlob')
        .mockImplementation(() =>
          Promise.resolve(
            mailBodyFixture as PromiseResult<
              AWS.S3.GetObjectOutput,
              AWS.AWSError
            >
          )
        );
      jest
        .spyOn(mailParser, 'simpleParser')
        .mockImplementation(() =>
          Promise.resolve(mailFixture as mailParser.ParsedMail)
        );
      jest
        .spyOn(storePdf, 'storePdf')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(storeBody, 'storeBody')
        .mockImplementation(() => Promise.resolve());
      await handler(lambdaEvent, context, callback);
      expect(callback).toHaveBeenCalledWith(null, null);
    });
  });
});
