const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const helloSchema = require("./schema/helloSchema");

// Initialize Express app
const app = express();

// Configure GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: helloSchema,
    graphiql: true, // Enable GraphiQL UI
  })
);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
