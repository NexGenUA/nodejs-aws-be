import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  console.log('basicAuthorizer EVENT: ', event);

  if (event.type !== 'TOKEN') {
    throwUnauthorized();
  }

  try {
    const authString = Buffer.from(event.authorizationToken, 'base64').toString('utf-8');
    const isBasic = /^Basic\s[^\s]+/.test(authString);

    if (!isBasic) {
      throwUnauthorized();
    }

    const token = authString.replace(/Basic\s/, '');

    const [login, password] = token.split(':');

    const validPassword = process.env[login];

    let effect = 'Allow';

    if (!validPassword || validPassword !== password) {
      effect = 'Deny';
    }

    const message = 'Login or password is wrong. Access denied';

    return generatePolicy(token, event.methodArn, effect, message);
  } catch (err) {
    console.error(err);
    throwUnauthorized();
  }
};

const generatePolicy = (principalId, resource, effect, message): APIGatewayAuthorizerResult => {
  return {
    principalId,
    context: {
      message,
    },
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

const throwUnauthorized = () => {
  throw new Error('Unauthorized');
};
