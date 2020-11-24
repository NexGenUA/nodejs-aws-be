import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  console.log('basicAuthorizer EVENT: ', event);

  return {
    principalId: 'sdsd',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
    },
  };
};
