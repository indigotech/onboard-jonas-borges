const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require("graphql");

// Define a query root
const queryRoot = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "Hello, world!",
    },
  },
});

// Export the schema
module.exports = new GraphQLSchema({ query: queryRoot });
