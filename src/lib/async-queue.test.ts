import { describe, expect } from 'vitest';
import { createAsyncQueue } from './async-queue';

describe('asyncQueue', (test) => {
  test('Runs promise', async () => {
    const queue = createAsyncQueue();
    let hasRun = false;

    /* eslint-disable-next-line @typescript-eslint/require-await -- Testing async */
    queue.enqueue(async () => {
      hasRun = true;
    });

    await queue.drain();

    expect(hasRun).to.equal(true);
  });

  test('drains below max', async () => {
    const queue = createAsyncQueue({ maxConcurrent: 5 });
    let hasRun = 0;

    /* eslint-disable-next-line @typescript-eslint/require-await -- Testing async */
    async function increment(): Promise<void> {
      hasRun += 1;
    }
    queue.enqueue(increment);
    queue.enqueue(increment);
    queue.enqueue(increment);
    queue.enqueue(increment);

    await queue.drain();

    expect(hasRun).to.equal(4);
  });

  test('drains above max', async () => {
    const queue = createAsyncQueue({
      maxConcurrent: 5,
      queueInterationTime: { miliseconds: 10 },
    });
    let hasRun = 0;

    /* eslint-disable-next-line @typescript-eslint/require-await -- Testing async */
    async function increment(): Promise<void> {
      hasRun += 1;
    }
    queue.enqueue(increment);
    queue.enqueue(increment);
    queue.enqueue(increment);
    queue.enqueue(increment);
    queue.enqueue(increment);
    queue.enqueue(increment);

    await queue.drain();

    expect(hasRun).to.equal(6);
  });

  test('stays below maxConcurrent', async () => {
    const queue = createAsyncQueue({
      maxConcurrent: 5,
      queueInterationTime: { miliseconds: 10 },
    });
    let shouldResolve = false;
    let hasRun = 0;

    async function hold(): Promise<void> {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (shouldResolve) {
            clearInterval(interval);
            hasRun += 1;
            resolve(undefined);
          }
        }, 5);
      });
    }

    queue.enqueue(hold);
    queue.enqueue(hold);
    queue.enqueue(hold);
    queue.enqueue(hold);
    queue.enqueue(hold);
    queue.enqueue(hold);
    queue.enqueue(hold);

    const drainHandle = queue.drain();

    expect(queue.getRunning()).to.equal(5);

    shouldResolve = true;

    await drainHandle;

    expect(hasRun).to.equal(7);
  });

  test('runs onError', async () => {
    let didError = false;
    const queue = createAsyncQueue({
      onError: () => {
        didError = true;
      },
    });

    /* eslint-disable-next-line @typescript-eslint/require-await -- Testing async */
    queue.enqueue(async () => {
      throw new Error('I Borke');
    });

    await queue.drain();

    expect(didError).to.equal(true);
  });
});
