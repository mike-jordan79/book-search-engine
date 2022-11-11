const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const db = require("./config/connection");

const { typeDefs, resolvers } = require("./schema");

const routes = require("./routes");

async function startApolloServe(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return serverContext(req);
    },
  });

  await server.start();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // app.use(express.urlencoded({ extended: true }));
  // app.use(express.json());
  app.use(express.static(path.join(__dirname, "../client/build")));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  // app.use(routes);

  server.applyMiddleware({
    app,
  });

  await new Promise((resolve) => {
    return app.listen(process.env.PORT || PORT, resolve);
  });
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  // db.once("open", () => {
  //   app.listen(PORT, () =>
  //     console.log(`🌍 Now listening on localhost:${PORT}`)
  //   );
  // });
}

startApolloServe(typeDefs, resolvers);