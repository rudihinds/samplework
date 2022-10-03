import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `//${window.location.host}/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include'
});

export default client;
