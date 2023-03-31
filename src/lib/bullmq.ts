import { Sentiment } from '@prisma/client';
import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

import { default as logger } from './logger';
import { openai } from './openapi';
import { prisma } from './prisma';

const connection = new IORedis(String(process.env.REDIS_HOST), { family: 6 });

const createBullMQ = () => {
  logger.debug('BullMQ Init');

  // Queues
  const itemGPTSentiment = new Queue('item-gpt-sentiment', { connection });
  const itemGPTSummary = new Queue('item-gpt-summary', { connection });

  // Workers
  new Worker(
    'item-gpt-sentiment',
    async (job: Job) => {
      const jobLogger = logger.child({ job: 'item-gpt-sen', itemId: job.data.id });

      jobLogger.debug('Worker started');
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Based on the following message, infer a sentiment as either "POSITIVE", "NEGATIVE", or "NEUTRAL": ${job.data.content}`,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const openaiResponse = response.data.choices[0].text?.toUpperCase();
      let sentiment;
      if (openaiResponse?.includes(Sentiment.NEGATIVE)) sentiment = Sentiment.NEGATIVE;
      else if (openaiResponse?.includes(Sentiment.POSITIVE)) sentiment = Sentiment.POSITIVE;
      else if (openaiResponse?.includes(Sentiment.NEUTRAL)) sentiment = Sentiment.NEUTRAL;
      else sentiment = Sentiment.NEUTRAL;

      jobLogger.debug(`Sentiment generated: ${sentiment.toString()}`);

      await prisma.item.update({
        where: { id: job.data.id },
        data: { sentiment },
      });

      jobLogger.debug('Sentiment saved');
    },
    { connection },
  );

  new Worker(
    'item-gpt-summary',
    async (job: Job) => {
      const jobLogger = logger.child({ job: 'item-gpt-sen', itemId: job.data.id });

      jobLogger.debug('Worker started');
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Based on the following message, infer a sentiment as either "POSITIVE", "NEGATIVE", or "NEUTRAL": ${job.data.content}`,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const openaiResponse = response.data.choices[0].text?.toUpperCase();
      let sentiment;
      if (openaiResponse?.includes(Sentiment.NEGATIVE)) sentiment = Sentiment.NEGATIVE;
      else if (openaiResponse?.includes(Sentiment.POSITIVE)) sentiment = Sentiment.POSITIVE;
      else if (openaiResponse?.includes(Sentiment.NEUTRAL)) sentiment = Sentiment.NEUTRAL;
      else sentiment = Sentiment.NEUTRAL;

      jobLogger.debug(`Sentiment generated: ${sentiment.toString()}`);

      await prisma.item.update({
        where: { id: job.data.id },
        data: { sentiment },
      });

      jobLogger.debug('Sentiment saved');
    },
    { connection },
  );

  return {
    itemGPTSentiment,
  };
};

const bullmqGlobal = global as typeof global & {
  bullmq?: ReturnType<typeof createBullMQ>;
};

export const bullmq: ReturnType<typeof createBullMQ> = bullmqGlobal.bullmq || createBullMQ();

if (process.env.NODE_ENV !== 'production') {
  bullmqGlobal.bullmq = bullmq;
}
