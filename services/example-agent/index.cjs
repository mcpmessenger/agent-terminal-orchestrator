const amqp = require('amqplib');

(async () => {
  const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost:5672';
  const EXCHANGE = 'mcp.poc';
  try {
    const conn = await amqp.connect(AMQP_URL);
    const ch = await conn.createChannel();
    await ch.assertExchange(EXCHANGE, 'fanout', { durable: false });
    const qInfo = await ch.assertQueue('', { exclusive: true });
    await ch.bindQueue(qInfo.queue, EXCHANGE, '');
    console.log('[example-agent] Waiting for ping messages...');

    ch.consume(qInfo.queue, (msg) => {
      if (!msg) return;
      try {
        const m = JSON.parse(msg.content.toString());
        if (m.type === 'ping') {
          const replyPayload = {
            type: 'pong',
            sender: 'example-agent',
            ts: Date.now(),
            correlationId: m.correlationId || null
          };
          const replyBuffer = Buffer.from(JSON.stringify(replyPayload));

          if (msg.properties.replyTo) {
            // RPC style reply
            ch.sendToQueue(msg.properties.replyTo, replyBuffer, {
              correlationId: msg.properties.correlationId || undefined
            });
          } else {
            ch.publish(EXCHANGE, '', replyBuffer, { correlationId: replyPayload.correlationId || undefined });
          }
          console.log('[example-agent] Responded to ping');
        }
      } catch (err) {
        console.error('[example-agent] Error handling message', err.message);
      }
    }, { noAck: true });
  } catch (err) {
    console.error('[example-agent] AMQP connection error', err.message);
    process.exit(1);
  }
})(); 