import { Handler } from 'aws-lambda'

export interface CommonHeaders {
    MessageId: string;
    Subject: string;
}

export interface SesMail {
    timestamp: string;
    source: string;
    messageId: string;
    destination: string[];
    commonHeaders: CommonHeaders;
}

export interface SESMessage {
    mail: SesMail;
    content?: any;
}

export interface SESEventRecord {
    EventVersion: string;
    EventSource: string;
    ses: SESMessage;
}

export interface SESEvent {
    Records: SESEventRecord[];
}

export type SESHandler = Handler<SESEvent, void>;