import * as AWSMock from 'aws-sdk-mock';
import { importProductsFile } from '../src/handlers/import-products-file';

describe('S3 bucket', () => {

  test('should return signedUrl', async () => {
    await AWSMock.mock('S3', 'getSignedUrl', (_, __, cb) => {
      cb(null, 'https://example.com');
    });
    const signedUrl = await importProductsFile({
      queryStringParameters: {
        name: 'test.csv'
      }
    } as any, null, null);

    expect((signedUrl as any).body).toBeDefined();
    expect((signedUrl as any).body).toEqual('https://example.com');
  });
})
