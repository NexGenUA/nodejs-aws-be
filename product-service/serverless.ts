import type { Serverless } from 'serverless/aws';
import { ApiGateway } from 'serverless/plugins/aws/provider/awsProvider';
import { config } from './src/common/config';

const serverlessConfiguration: Serverless = {
  service: 'aws-be-nexgenua',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
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
        Action: 'sqs:*',
        Resource: ['${cf:import-service-${self:provider.stage}.SQSQueueArn}'],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [
          {
            Ref: 'SNSTopic',
          },
        ],
      },
    ],
    environment: {
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
    },
  },
  functions: {
    getProducts: {
      handler: 'handler.getProducts',
      events: [
        {
          http: {
            path: 'products',
            method: 'get',
            cors: true,
          },
        },
      ],
    },
    getProductById: {
      handler: 'handler.getProductById',
      events: [
        {
          http: {
            path: 'products/{id}',
            method: 'get',
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true,
                },
              },
            },
          },
        },
      ],
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            path: 'products',
            method: 'post',
            cors: true,
            request: {
              schema: {
                'application/json': '${file(./src/schemas/product-schema.json)}',
              },
            },
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 2,
            arn: ['${cf:import-service-${self:provider.stage}.SQSQueueArn}'],
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
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'import-service-topic',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: config.EMAIL,
          Protocol: 'email',
          FilterPolicy: { counts: ['good'] },
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
      SNSRunOutSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: config.EMAIL_TROUBLE,
          Protocol: 'email',
          FilterPolicy: { counts: ['run out'] },
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
