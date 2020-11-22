import { catalogBatchProcess } from '../src/handlers/catalog-batch-process';
import { SQSEvent } from 'aws-lambda';

test('Batch Process', async () => {
  const event: SQSEvent = {
    Records: [
      {
        body: JSON.stringify({
          title: 'Samsung-test',
          description: 'Galaxy 99',
          price: 100,
          count: 5,
        })
      }
    ]
  } as SQSEvent;

  await catalogBatchProcess(event, null, null);
});
