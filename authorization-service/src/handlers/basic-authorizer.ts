import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  console.log('basicAuthorizer EVENT: ', event);

  if (event.type !== 'TOKEN') {
    throw new Error('Unauthorized');
  }

  try {
    const authString = Buffer.from(event.authorizationToken, 'base64').toString('utf-8');
    const isBasic = /^Basic\s[^\s]+/.test(authString);

    if (!isBasic) {
      throw new Error('Unauthorized');
    }

    const token = authString.replace(/Basic\s/, '');

    const [login, password] = token.split(':');

    const validPassword = process.env[login];

    let effect = 'Allow';

    if (!validPassword || validPassword !== password) {
      effect = 'Deny';
    }

    return generatePolicy(token, event.methodArn, effect);
  } catch (err) {
    console.error(err);
    throw new Error(`Unauthorized`);
  }
};

const generatePolicy = (principalId, resource, effect): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
