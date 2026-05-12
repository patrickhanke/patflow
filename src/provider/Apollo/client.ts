import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const GRAPHQL_API_URL =
  'https://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/graphql/';

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/1/',
    connectionParams: {
      reconnect: true,
      op: 'connect'
    }
  })
);

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
  headers: {
    'X-Parse-Application-Id': '6Soqn6XEf2By4YAa2WN9YV9pNk3hT7dTNFOAVYaQ',
    // 'X-Parse-REST-API-Key': env.SASHIDO_REST_KEY || '',
    'X-Parse-Master-Key': 'ya02fyyVMVoqFC3rtzgrckdF3VrQN3hk9TNpPdRA'
    // 'X-Parse-Session-Token': token
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      ObjectsQuery: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        }
      }
    }
  }),
  link: httpLink

  // link: asyncAuthLink.concat(httpLink),
});
