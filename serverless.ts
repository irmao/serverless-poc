import type { AWS } from "@serverless/typescript";
import dynamoDbTables from "./resources/dynamodb";
import functions from "./resources/functions";

const serverlessConfiguration: AWS = {
  service: "serverless-framework-poc",
  frameworkVersion: "3",
  plugins: [
    "serverless-bundle",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    stage: "dev",
    region: "us-east-1",
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      REGION: "${self:custom.region}",
      STAGE: "${self:custom.stage}",
      TABLE_NAME: "${self:custom.table_name}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource: [{ "Fn::GetAtt": ["DynamoSingleTable", "Arn"] }],
      },
    ],
  },
  functions: functions,
  resources: {
    Resources: dynamoDbTables,
  },
  custom: {
    region: "${opt:region, self:provider.region}",
    stage: "${opt:stage, self:provider.stage}",
    prefix: "${self:service}-${self:custom.stage}",
    table_name: "${self:service}-singletable-${opt:stage, self:provider.stage}",
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput:
      "${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}",
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8008,
        inMemory: true,
        heapInitial: "200m",
        heapMax: "1g",
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        // Uncomment only if you already have a DynamoDB running locally
        // noStart: true
      },
    },
    ["serverless-offline"]: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"],
      },
    },
  },
};

module.exports = serverlessConfiguration;
