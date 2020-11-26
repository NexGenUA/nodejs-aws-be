import type { Serverless } from 'serverless/aws';
import { ApiGateway } from 'serverless/plugins/aws/provider/awsProvider';

const BUCKET = 'input-service';

const serverlessConfiguration: Serverless = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      shouldStartNameWithService: true,
    } as ApiGateway,
    stage: 'dev',
    region: 'eu-west-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${BUCKET}`,
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${BUCKET}/*`,
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
    ],
    environment: {
      SQS_URL: {
        Ref: 'SQSQueue',
      },
    },
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            path: 'import',
            method: 'get',
            cors: true,
            authorizer: {
              name: 'tokenAuthorizer',
              arn: '${cf:authorization-service-${self:provider.stage}.basicAuthorizerArn}',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token',
            },
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: BUCKET,
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: '.csv',
              },
            ],
            existing: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      GatewayResponseDefault400: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseAccessDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'ACCESS_DENIED',
          ResponseTemplates: {
            'application/json': '{"message":"$context.authorizer.message"}',
          },
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'import-service-queue',
        },
      },
    },
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: 'SQSQueue',
        },
      },
      SQSQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
