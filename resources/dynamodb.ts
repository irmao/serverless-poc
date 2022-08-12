export default {
  DynamoSingleTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "${self:provider.environment.TABLE_NAME}",
      AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "PK", KeyType: "HASH" },
        { AttributeName: "SK", KeyType: "RANGE" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
};
