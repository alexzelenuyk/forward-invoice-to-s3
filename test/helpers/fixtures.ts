import { Attachment } from 'mailparser';
import { SESEvent } from '../../src/common/event';

export const mailBodyFixture = {
  Body: 'Mail body'
};

export const pdfAttachment: Attachment = {
  filename: 'some.pdf'
} as Attachment;

export const textAttachment: Attachment = {
  filename: 'disclaimer.txt'
} as Attachment;

export const mailFixture = {
  attachments: [pdfAttachment]
};

export const lambdaEvent = {
  Records: [
    {
      ses: {
        mail: {
          messageId: 'jlfh42o2g13nlvb75al7knc10rjr6hncuqk3g1g1'
        }
      }
    }
  ]
} as SESEvent;

const dateInTheFuture = new Date('2010-05-01T12:00:00');

export const FakeDate = class extends Date {
  constructor() {
    super();

    return dateInTheFuture;
  }
};
