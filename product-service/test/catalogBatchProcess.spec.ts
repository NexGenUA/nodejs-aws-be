import { catalogBatchProcess } from '../src/handlers/catalog-batch-process';
import { Client } from 'pg';
import { SQSEvent } from 'aws-lambda';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';

AWSMock.setSDKInstance(AWS);

jest.mock('pg', () => {
  const mockData = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mockData) };
});

describe('Batch Process', () => {
  let client: Client;
  let event: SQSEvent;

  beforeAll(() => {

  });

  beforeEach(() => {
    client = new Client();
    event = {
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
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('', async () => {
    await catalogBatchProcess(event, null, null);

    expect(client.connect).toBeCalledTimes(1);
  });

  test('SNS should invoked', async () => {
    AWSMock.mock('SNS', 'publish', (_, callback) => {
      callback(undefined, 'success');
    });
    const SNS = new AWS.SNS({ region: 'eu-west-1' });
    let params = {
      Message: JSON.stringify({ data: 'Message you want to send to SNS topic' })
    }
    SNS.publish(params, (_, res) => {
      expect(res).toBe('success');
    });
  });
});
