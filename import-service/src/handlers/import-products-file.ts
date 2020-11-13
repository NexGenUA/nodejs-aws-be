import { APIGatewayProxyHandler } from 'aws-lambda';
import { res } from '../../../common/res';
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const BUCKET = 'input-service';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  console.log('importProductsFile EVENT: ', event);

  try {
    const { name } = event.queryStringParameters;
    const path = `uploaded/${name}`;

    const s3: S3 = new AWS.S3({ region: 'eu-west-1' });

    const params = {
      Bucket: BUCKET,
      Key: path,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    return res().send(url);
  } catch (err) {
    console.error(err);
    res().sendInternal();
  }
};
