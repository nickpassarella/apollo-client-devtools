import React from "react";
import { render } from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, useQuery, gql, makeVar } from "@apollo/client";
// import Panel from './components/Panel';
import { Explorer } from './Explorer/Explorer';

export enum ColorThemes {
  Light = 'light',
  Dark = 'dark'
}

type ColorTheme = ColorThemes;

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        queries() {
          return queriesVar();
        },
        mutations() {
          return mutationsVar();
        },
        cache() {
          return cacheVar();
        },
        colorTheme() {
          return colorTheme();
        },
        graphiQLQuery() {
          return graphiQLQuery();
        },
      }
    }
  }
});

const queriesVar = makeVar(null);
const mutationsVar = makeVar(null);
const cacheVar = makeVar(null);
export const colorTheme = makeVar<ColorTheme>(ColorThemes.Light);
export const graphiQLQuery = makeVar<string>('');

const client = new ApolloClient({
  cache,
});

export const writeData = ({ queries, mutations, cache }) => {
  queriesVar(queries);
  mutationsVar(mutations);
  cacheVar(cache);
};

const GET_CACHE = gql`
  query GetCache {
    mutations @client
    queries @client
    cache @client
  }
`;

const App = () => {
  useQuery(GET_CACHE);
  return (<Explorer />)
};

export const initDevTools = () => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>, 
    document.getElementById("app")
  );
};
