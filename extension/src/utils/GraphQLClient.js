import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {

    const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
    operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
  }
  return forward(operation).map((data) => {
    return data;
  });
});

const httpLink = createHttpLink({
  uri: (process.env.NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION_SERVER : process.env.REACT_APP_DEVELOPMENT_SERVER) + "graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const GraphQLClient = new ApolloClient({
  link: ApolloLink.from([authLink, cleanTypeName, httpLink]),
  cache: new InMemoryCache({
    addTypename: true,
    typePolicies: {
      Note: {
        fields: {
          todo: {
            merge(existing = [], incoming) {
              return [...incoming];
            },
          }
        }
      }
    }
  })
});

export default GraphQLClient;