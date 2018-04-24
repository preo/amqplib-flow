/* @flow */

declare module 'amqplib' {
  declare export type SocketOptions = {}; // TODO
  declare export type Args = { [key: string]: string };
  declare export type Headers = { [key: string]: string };

  declare export type QueueOptions = {|
    exclusive?: ?boolean,
    durable?: ?boolean,
    autoDelete?: ?boolean,
    arguments?: ?Args,
    /* extenstions */
    messageTtl?: ?number,
    expires?: ?number,
    deadLetterExchange?: ?string,
    maxLength?: ?number,
    maxPriority?: ?number
  |};

  declare export type QueueOk = {
    queue: string,
    messageCount: number,
    consumerCount: number
  };

  declare export type DeleteOk = {
    messageCount: number
  };

  declare export type DeleteQueueOpts = {|
    ifUnused?: ?boolean,
    ifEmpty?: ?boolean
  |};

  declare export type ExchangeType =
    | 'fanout'
    | 'direct'
    | 'topic'
    | 'headers'
    ;

  declare export type ExchangeOpts = {|
    durable?: ?boolean,
    internal?: ?boolean,
    autoDelete?: ?boolean,
    alternateExchange?: ?string,
    arguments?: ?Args
  |};

  declare export type ExchangeOk = {
    exchange: string
  };

  declare export type ExchangeDeleteOpts = {|
    ifUnused?: ?boolean;
  |};

  declare export type PublishOpts = {|
    expiration?: ?number,
    userId?: ?string,
    CC?: ?(string | Array<string>),
    BCC?: ?(string | Array<string>),
    priority?: ?number,
    persistent?: ?boolean,
    deliveryMode?: ?(1 | 2),
    mandatory?: ?boolean,
    contentType?: ?string,
    contentEncoding?: ?string,
    headers?: ?Headers,
    correlationId?: ?string,
    replyTo?: ?string,
    messageId?: ?string,
    timestamp?: ?number,
    type?: ?string,
    appId?: ?string
  |};

  declare export type ConsumeOpts = {|
    consumerTag?: ?string,
    noLocal?: ?boolean,
    noAck?: ?boolean,
    exclusive?: ?boolean,
    priority?: ?number,
    arguments?: ?Args
  |};

  declare export type GetOpts = {|
    noAck?: ?boolean
  |};

  declare export type Callback<T> = (err: Error, res: T) => any;

  declare export class Message {
    content: Buffer;
    fields: {
      deliveryTag: string,
      consumerTag: string,
      exchange: string,
      routingKey: string,
      redelivered: boolean
    };
    properties: PublishOpts;
  }

  declare export class Channel extends events$EventEmitter {
    close(): Promise<void>;
    assertQueue(queue: ?string, options?: QueueOptions): Promise<QueueOk>;
    checkQueue(queue: string): Promise<QueueOk>;
    deleteQueue(queue: string, opts?: DeleteQueueOpts): Promise<DeleteOk>;
    purgeQueue(queue: string): Promise<DeleteOk>;
    bindQueue(queue: string, exchange: string, routingKey: string, args?: Args): Promise<void>;
    unbindQueue(queue: string, exchange: string, routingKey: string, args?: Args): Promise<void>;

    assertExchange(exchange: string, type: ExchangeType, opts?: ExchangeOpts): Promise<ExchangeOk>;
    checkExchange(exchange: string): Promise<ExchangeOk>; // TODO check return val
    deleteExchange(exchange: string, opts?: ExchangeDeleteOpts): Promise<void>;
    bindExchange(dst: string, src: string, routingKey: string, args?: Args): Promise<void>;
    unbindExchange(dst: string, src: string, routingKey: string, args?: Args): Promise<void>;

    publish(exchange: string, routingKey: string, content: Buffer, opts?: PublishOpts): boolean;
    sendToQueue(queue: string, content: Buffer, opts?: PublishOpts): boolean;

    consume(queue: string, fn: (msg: ?Message) => any, opts?: ConsumeOpts): Promise<{ consumerTag: string }>;
    cancel(consumerTag: string): Promise<{}>; // TODO
    get(queue: string, opts?: GetOpts): Promise<false | Message>;
    ack(message: Message, allUpTo?: boolean): void;
    ackAll(): void;
    nack(message: Message, allUpTo?: boolean, requeue?: boolean): void;
    nackAll(requeue?: boolean): void;
    reject(message: Message, requeue?: boolean): void;
    prefetch(count: number, global?: boolean): void;
    recover(): Promise<{}>
  }

  declare export class ConfirmChannel extends Channel {
    publish(exchange: string, routingKey: string, content: Buffer, opts?: PublishOpts, cb?: Callback<{}>): boolean;
    sendToQueue(queue: string, content: Buffer, opts?: PublishOpts, cb?: Callback<{}>): boolean;
    waitForConfirms(): Promise<void>;
  }

  declare export class Connection extends events$EventEmitter {
    close(): Promise<void>;
    createChannel(): Promise<Channel>;
    createConfirmChannel(): Promise<ConfirmChannel>;
  }

  declare export function connect(url?: string, socketOptions?: SocketOptions): Promise<Connection>;
}
