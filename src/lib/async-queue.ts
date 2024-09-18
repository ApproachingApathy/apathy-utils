interface Options {
  queueInterationTime?: { miliseconds: number };
  maxConcurrent?: number;
  onError?: (e: unknown) => Promise<void> | void;
}

async function timeout(duration: { miliseconds: number }): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, duration.miliseconds);
  });
}

interface Queue {
  enqueue: (job: () => Promise<void>) => void;
  drain: () => Promise<void>;
  getRunning: () => number;
}

/**
 * Creates a recursively operating asynchronous queue.
 */
export function createAsyncQueue(opts: Options = {}): Queue {
  const {
    maxConcurrent = 5,
    queueInterationTime = { miliseconds: 50 },
    onError,
  } = opts;

  const queue: (() => Promise<void>)[] = [];
  let running = 0;

  function enqueue(job: () => Promise<void>): void {
    queue.push(job);
  }

  async function drain(): Promise<void> {
    if (running < maxConcurrent && queue.length > 0) {
      const job = queue.shift();

      if (!job) throw new Error('Job did not exist.');

      running += 1;
      job()
        .catch((e) => {
          if (onError) return onError(e);
          return undefined;
        })
        .finally(() => {
          running -= 1;
        });

      return drain();
    }

    if (queue.length > 0 || running > 0) {
      await timeout({ miliseconds: queueInterationTime.miliseconds });
      return drain();
    }

    return undefined;
  }

  return {
    enqueue,
    drain,
    getRunning() {
      return running;
    },
  };
}
