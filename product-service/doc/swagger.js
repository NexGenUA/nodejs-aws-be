import swaggerConfig from './rest-api-aws.json';

export const swagger = async () => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
    body: JSON.stringify(swaggerConfig)
  };
};
