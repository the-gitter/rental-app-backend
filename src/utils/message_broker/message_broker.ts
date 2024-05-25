import amqplib, { Connection, Channel } from "amqplib";

export default  class MessageBrokerService {
  private conn: Connection | null = null;
  private queue: string;

  constructor(queue: string) {
    this.queue = queue;
    this._connect();
  }

  private async _connect() {
    try {
      this.conn = await amqplib.connect(process.env.MSG_BROKER!);
      console.log("Connected to the message broker");

      await this.consumer();

      process.on("SIGINT", async () => {
        await this.conn?.close();
        console.log("Message broker connection closed.");
      });
    } catch (err) {
      console.error("Failed to connect to the message broker", err);
      throw err;
    }
  }

  public async send(msg: string, sendToQueue: string) {
    if (!this.conn) {
      await this._connect();
    }

    try {
      const channel: Channel = await this.conn!.createChannel();
      await channel.assertQueue(sendToQueue);
      channel.sendToQueue(sendToQueue, Buffer.from(msg));
      console.log(`Sent message: ${msg}`);
    } catch (err) {
      console.error("Failed to send message", err);
      throw err;
    }
  }

  public async consumer() {
    if (!this.conn) {
      await this._connect();
    }

    try {
      const channel: Channel = await this.conn!.createChannel();
      await channel.assertQueue(this.queue);
      channel.consume(this.queue, (msg) => {
        if (msg !== null) {
          console.log(`Received message: ${msg.content.toString()}`);
          channel.ack(msg);
        } else {
          console.log("Consumer cancelled by server");
        }
      });
    } catch (err) {
      console.error("Failed to consume messages", err);
      throw err;
    }
  }
}
